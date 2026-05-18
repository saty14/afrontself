import { NextResponse } from "next/server";

export async function GET(request) {

  const admincode = request.cookies.get("admincode")?.value || "";

  return NextResponse.json({ admincode});
}
