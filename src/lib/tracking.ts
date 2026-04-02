import { supabase } from "./supabase";

let currentSessionId: string | null = null;

export async function startSession(companyName: string): Promise<string> {
  const { data, error } = await supabase
    .from("sessions")
    .insert({ company_name: companyName })
    .select("id")
    .single();
  if (!error && data) {
    currentSessionId = data.id;
  }
  return currentSessionId ?? "";
}

export async function updateSession(fields: {
  company_type?: string;
  overall_score?: number;
  data_confidence?: string;
}) {
  if (!currentSessionId) return;
  await supabase
    .from("sessions")
    .update(fields)
    .eq("id", currentSessionId);
}

export function getSessionId() {
  return currentSessionId;
}

/** Fire-and-forget interaction tracker */
export function track(
  eventType: string,
  eventData?: Record<string, unknown>
): void {
  if (!currentSessionId) return;
  supabase
    .from("interaction_events")
    .insert({
      session_id: currentSessionId,
      event_type: eventType,
      event_data: eventData ?? {},
    })
    .then(() => {/* intentionally ignored */});
}

/** Persist full report to DB */
export async function saveReport(
  companyName: string,
  reportData: unknown,
  matchesData?: unknown
) {
  if (!currentSessionId) return;
  await supabase.from("reports").insert({
    session_id: currentSessionId,
    company_name: companyName,
    report_data: reportData,
    matches_data: matchesData ?? null,
  });
}
