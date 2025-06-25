import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "incomeAllocations.json");

export async function GET() {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2));
  return NextResponse.json({ success: true });
}
