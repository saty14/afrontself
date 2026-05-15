import { NextResponse } from "next/server";

export async function GET(request) {
  const token = request.cookies.get("token")?.value || null;
  const id = request.cookies.get("id")?.value || null;
  const role = request.cookies.get("role")?.value || null;

  return NextResponse.json({ token, role ,id});
}
