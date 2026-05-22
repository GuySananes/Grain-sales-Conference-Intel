import type { ContactGroup, Lead } from "@/types/domain";

const commonNames = new Set(["alex morgan", "sam lee", "chris johnson", "david lee", "michael brown", "jessica smith"]);

export function normalizeText(value: string | undefined): string {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9@. ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeEmail(value: string | undefined): string {
  return normalizeText(value);
}

function normalizedCompany(value: string): string {
  return normalizeText(value)
    .replace(/\b(inc|ltd|llc|global|group|corp|corporation|limited|plc)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function emailDomain(value: string | undefined): string {
  const email = normalizeEmail(value);
  const [, domain] = email.split("@");
  return domain ?? "";
}

function nameParts(name: string): string[] {
  return normalizeText(name).split(" ").filter(Boolean);
}

function isInitialVariant(a: string, b: string): boolean {
  const aParts = nameParts(a);
  const bParts = nameParts(b);

  if (aParts.length < 2 || bParts.length < 2) return false;

  const [aFirst, ...aRest] = aParts;
  const [bFirst, ...bRest] = bParts;
  const aLast = aRest.at(-1);
  const bLast = bRest.at(-1);

  return Boolean(aLast && bLast && aLast === bLast && aFirst[0] === bFirst[0]);
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);

  for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }

  return matrix[b.length][a.length];
}

function nameSimilarity(a: string, b: string): number {
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (isInitialVariant(left, right)) return 0.92;
  const distance = levenshtein(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

function companySimilarity(a: string, b: string): number {
  const left = normalizedCompany(a);
  const right = normalizedCompany(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.84;

  const leftTokens = new Set(left.split(" "));
  const rightTokens = new Set(right.split(" "));
  const overlap = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return overlap / Math.max(leftTokens.size, rightTokens.size);
}

function shouldMergeLeadIntoGroup(lead: Lead, group: ContactGroup): { merge: boolean; reason: string; confidence: ContactGroup["confidence"] } {
  const leadEmail = normalizeEmail(lead.email);
  const groupEmails = group.encounters.map((encounter) => normalizeEmail(encounter.email)).filter(Boolean);

  if (leadEmail && groupEmails.includes(leadEmail)) {
    return { merge: true, reason: "Exact email match", confidence: "exact" };
  }

  const groupLead = group.encounters[0];
  const sameDomain = Boolean(emailDomain(lead.email) && group.encounters.some((encounter) => emailDomain(encounter.email) === emailDomain(lead.email)));
  const nameScore = Math.max(...group.encounters.map((encounter) => nameSimilarity(lead.fullName, encounter.fullName)));
  const companyScore = Math.max(...group.encounters.map((encounter) => companySimilarity(lead.company, encounter.company)));
  const normalizedName = normalizeText(lead.fullName);
  const isCommonName = commonNames.has(normalizedName) || commonNames.has(normalizeText(groupLead.fullName));

  if (nameScore >= 0.9 && (companyScore >= 0.75 || sameDomain)) {
    return {
      merge: true,
      reason: companyScore >= 0.75 ? "Name variation and company match" : "Name variation and email domain match",
      confidence: "strong"
    };
  }

  if (nameScore >= 0.94 && !isCommonName && companyScore >= 0.45) {
    return { merge: true, reason: "Distinctive name with partial company overlap", confidence: "strong" };
  }

  if (nameScore >= 0.9 && isCommonName) {
    return { merge: false, reason: "Common name needs manual review", confidence: "possible" };
  }

  return { merge: false, reason: "No reliable identity match", confidence: "single" };
}

function relationshipSignal(encounters: Lead[]): Pick<ContactGroup, "relationshipSignal" | "interpretation"> {
  const highIntent = encounters.filter((lead) => lead.intent === "High").length;
  const mediumIntent = encounters.filter((lead) => lead.intent === "Medium").length;
  const curiousOrLow = encounters.filter((lead) => lead.intent === "Curious" || lead.intent === "Low").length;
  const hasBuyingLanguage = encounters.some((lead) => /buying|committee|roi|case study|product|requested|budget|urgent/i.test(lead.notes));
  const hasTireKickerLanguage = encounters.some((lead) => /free content|curious|market maps|no budget|student|just browsing/i.test(lead.notes));

  if (encounters.length === 1) {
    return {
      relationshipSignal: "New",
      interpretation: "Single encounter. Capture the next step, but do not over-read the signal yet."
    };
  }

  if (highIntent >= 1 && (mediumIntent >= 1 || hasBuyingLanguage)) {
    return {
      relationshipSignal: "Warming",
      interpretation: "Repeated engagement plus buying-context language. Treat this as a relationship worth advancing."
    };
  }

  if (curiousOrLow === encounters.length && hasTireKickerLanguage) {
    return {
      relationshipSignal: "Tire-kicker risk",
      interpretation: "Repeat interest without buying intent. Keep the touch light unless a concrete project appears."
    };
  }

  return {
    relationshipSignal: "Needs review",
    interpretation: "Multiple encounters are visible, but the buying signal is mixed. Ask one sharper qualification question."
  };
}

function buildGroupId(lead: Lead): string {
  return normalizeEmail(lead.email) || `${normalizeText(lead.fullName)}-${normalizedCompany(lead.company)}`.replace(/\s/g, "-");
}

export function createContactGroups(leads: Lead[]): ContactGroup[] {
  const groups: ContactGroup[] = [];

  leads.forEach((lead) => {
    const candidates = groups.map((group) => ({ group, match: shouldMergeLeadIntoGroup(lead, group) }));
    const best = candidates.find((candidate) => candidate.match.merge);

    if (best) {
      best.group.encounters.push(lead);
      best.group.reasons = Array.from(new Set([...best.group.reasons, best.match.reason]));
      best.group.confidence = best.group.confidence === "exact" || best.match.confidence === "exact" ? "exact" : "strong";
      return;
    }

    groups.push({
      id: buildGroupId(lead),
      displayName: lead.fullName,
      primaryCompany: lead.company,
      encounters: [lead],
      confidence: "single",
      reasons: ["First known encounter"],
      relationshipSignal: "New",
      interpretation: ""
    });
  });

  return groups
    .map((group) => {
      const latest = [...group.encounters].sort((a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt))[0];
      const signal = relationshipSignal(group.encounters);

      return {
        ...group,
        displayName: latest.fullName,
        primaryCompany: latest.company,
        encounters: group.encounters.sort((a, b) => Date.parse(a.capturedAt) - Date.parse(b.capturedAt)),
        ...signal
      };
    })
    .sort((a, b) => b.encounters.length - a.encounters.length || a.displayName.localeCompare(b.displayName));
}
