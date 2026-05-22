import type { Lead } from "@/types/domain";

export const sampleLeads: Lead[] = [
  {
    id: "lead-001",
    conferenceId: "finovate-europe-2026",
    capturedAt: "2026-02-10T10:15:00.000Z",
    fullName: "Maya Chen",
    company: "FlyPay",
    title: "VP Partnerships",
    email: "maya.chen@flypay.com",
    notes: "Runs partner integrations for a PSP serving travel merchants. Asked how Grain handles volatile EUR/GBP exposure.",
    intent: "High",
    tags: ["PSP", "Travel merchants", "FX exposure"],
    hubspotStatus: "mock_synced",
    syncedAt: "2026-02-10T18:45:00.000Z"
  },
  {
    id: "lead-002",
    conferenceId: "money2020-asia-2026",
    capturedAt: "2026-04-22T08:40:00.000Z",
    fullName: "M. Chen",
    company: "FlyPay Global",
    title: "Head of Strategic Partnerships",
    email: "maya.chen@flypay.com",
    notes: "Mentioned a new APAC expansion and asked for an intro to product. Same payments team, stronger urgency.",
    intent: "High",
    tags: ["Repeat", "APAC expansion", "Partnerships"],
    hubspotStatus: "not_synced"
  },
  {
    id: "lead-003",
    conferenceId: "skift-global-forum-2026",
    capturedAt: "2026-09-23T13:05:00.000Z",
    fullName: "Daniel Rosen",
    company: "GlobeStay Wholesale",
    title: "Treasury Director",
    email: "daniel.rosen@globestay.com",
    notes: "Wants better visibility into supplier currency exposure before 2027 contracting.",
    intent: "Medium",
    tags: ["Travel wholesaler", "Treasury"],
    hubspotStatus: "not_synced"
  },
  {
    id: "lead-004",
    conferenceId: "phocuswright-2026",
    capturedAt: "2026-11-18T15:30:00.000Z",
    fullName: "Dan Rosen",
    company: "GlobeStay Wholesale",
    title: "Director, Treasury Operations",
    email: "daniel.rosen@globestay.com",
    notes: "Asked to compare hedging workflow against current bank spreadsheet process. Buying committee forming.",
    intent: "High",
    tags: ["Repeat", "Buying committee"],
    hubspotStatus: "not_synced"
  },
  {
    id: "lead-005",
    conferenceId: "saastr-ai-annual-2026",
    capturedAt: "2026-05-13T20:10:00.000Z",
    fullName: "Alex Morgan",
    company: "SaaSScale",
    title: "Growth Advisor",
    notes: "Curious about FX but mostly asked for market maps and free content.",
    intent: "Curious",
    tags: ["SaaS", "Advisor"],
    hubspotStatus: "not_synced"
  },
  {
    id: "lead-006",
    conferenceId: "money2020-europe-2026",
    capturedAt: "2026-06-03T11:25:00.000Z",
    fullName: "Alex Morgan",
    company: "AirLedger",
    title: "Payments Product Lead",
    notes: "Owns multi-currency settlement for online travel agencies. Asked for ROI calculator.",
    intent: "Medium",
    tags: ["Payments", "OTA"],
    hubspotStatus: "not_synced"
  },
  {
    id: "lead-007",
    conferenceId: "eurofinance-2026",
    capturedAt: "2026-09-16T09:20:00.000Z",
    fullName: "Priya Nair",
    company: "Northstar Remit",
    title: "CFO",
    email: "priya.nair@northstarremit.com",
    notes: "Cross-border remittance company with USD/MXN and EUR/GBP exposure. Requested CFO-level case study.",
    intent: "High",
    tags: ["Cross-border payments", "CFO"],
    hubspotStatus: "not_synced"
  }
];
