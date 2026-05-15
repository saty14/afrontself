import { NextResponse } from "next/server";


//=========== LOGOUT ============ 

export function GET() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("token", "", { expires: new Date(0) });
  res.cookies.set("role", "", { expires: new Date(0) });
  res.cookies.set("id", "", { expires: new Date(0) });

  return res;
}
