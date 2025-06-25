import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const TABLE = "current_expenses";

export async function GET() {
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Replace all rows with the new data
  await supabase.from(TABLE).delete().neq("id", 0);
  const { error } = await supabase.from(TABLE).insert(body);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
