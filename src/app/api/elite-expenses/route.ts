import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const TABLE = "elite_expenses";

export async function GET() {
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Upsert (insert or update) the provided rows
  const { error } = await supabase
    .from(TABLE)
    .upsert(body, { onConflict: "id" });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
