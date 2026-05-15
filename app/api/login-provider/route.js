import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  // CALL YOUR EXTERNAL API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ message: data.message }, { status: 401 });
  }

  // Save token, role and id into cookies
  const res = NextResponse.json({ success: true });

  res.cookies.set("token", data.provider.accesstoken, { httpOnly: true });
  res.cookies.set("role", data.provider.roll, { httpOnly: true });
  res.cookies.set("id", data.provider.sprovid, { httpOnly: true });

  return res;
}



//=========== LOGOUT ============ 

// export function GET() {
//   const res = NextResponse.json({ success: true });

//   res.cookies.set("token", "", { expires: new Date(0) });
//   res.cookies.set("role", "", { expires: new Date(0) });
//   res.cookies.set("id", "", { expires: new Date(0) });

//   return res;
// }




// export async function GET() {
//   try {
//     const response = await fetch("{process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/user/users", {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });

//     const data = await response.json(); // <-- important!

//     return NextResponse.json({
//       success: true,
//       msg: "API is working",
//       data: data,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, msg: "Something went wrong", error: error.message },
//       { status: 500 }
//     );
//   }
// }
