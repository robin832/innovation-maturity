import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

/** Call the analyze edge function */
export async function callAnalyze<T>(
  action: string,
  payload: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke("analyze", {
    body: { action, ...payload },
  });
  if (error) throw new Error(error.message);
  return data as T;
}
