import { NextResponse } from "next/server";

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const id = request.cookies.get("id")?.value;
  const role = request.cookies.get("role")?.value;
  const path = request.nextUrl.pathname;

  // -----------------------------
  // 1️⃣ Not logged in → redirect
  // -----------------------------
  if (!token || !role || !id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // -----------------------------------------
  // 2️⃣ Verify token from your external API
  // -----------------------------------------
  let result;
  try {
    if(role == "2"){
       const verifyReq = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/verify-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "id":`${id}`, "token":token,  "role":role }),
    });

     result = await verifyReq.json();
    }else{
   const verifyReq = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/user/verify-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "id":`${id}`, "token":token,  "role":role }),
    });
      result = await verifyReq.json();
    }
 

  
  } catch (error) {
    console.error("Token verify failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // -----------------------------
  // 3️⃣ Token INVALID → redirect
  // -----------------------------
  // Backend must send: { valid: true/false }
  if (!result.valid) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    response.cookies.delete("id");
    response.cookies.delete("role");
    return response;
  }

  // -----------------------------
  // 4️⃣ Role Based Protection
  // -----------------------------
   // ADMIN
  if (path.startsWith("/admin") && !["1", "2"].includes(role)) {
  return NextResponse.redirect(new URL("/no-access", request.url));
}

  // // ADMIN
  // if (path.startsWith("/admin") && role !== "1") {
  //   return NextResponse.redirect(new URL("/no-access", request.url));
  // }

  // // USER
  // if (path.startsWith("/user") && role !== "2") {
  //   return NextResponse.redirect(new URL("/no-access", request.url));
  // }

  // // PROVIDER
  // if (path.startsWith("/provider") && role !== "3") {
  //   return NextResponse.redirect(new URL("/no-access", request.url));
  // }

  // Everything OK → continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/provider/:path*",
  ],
};

