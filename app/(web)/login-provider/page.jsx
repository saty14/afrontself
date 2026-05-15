



"use client";

import { useState } from "react";
import Link from "next/link";

export default  function LoginPage() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); // clear previous error
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("/api/login-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // backend sends JSON error
        const data = await res.json().catch(() => null);

        setError(data?.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLoading(false);

      // redirect based on role
      // if (data.role === "1") window.location.href = "/admin";
      // else if (data.role === "provider") window.location.href = "/provider";
      // else window.location.href = "/user";
      //  if (data.length >0) window.location.href = "/admin";
       window.location.href = "/admin";

    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Server unreachable.");
      console.error("Login error:", err);
    }
  }

  return (
    <>
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 mt-10"
    >
      <h2 className="text-xl font-semibold text-center mb-4">Login Provider</h2>

      {/* ERROR MESSAGE */}
      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded-lg text-sm text-center">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          name="email"
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          type="email"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          name="password"
          placeholder="Enter your password"
          type="password"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
   <div  className="w-full max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 mt-10">

                    <p>      <Link href="/email-verify-provider" >Email-verify-provider</Link> </p> 
                      <p> <Link href="/provider-forgot-password" > Provider-forgot-password</Link></p> 
    </div>

    </>
  );
}
















////////////////////////////////////////////////////////

// "use client";

// export default function LoginPage() {
//   async function handleLogin(e) {
//     e.preventDefault();
//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     const res = await fetch("/api/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password })
//     });

//     if (res.ok) {
//       // redirect based on role
//       const role = (await res.json()).role;
//       if (role === "1") window.location.href = "/admin";
//       else if (role === "provider") window.location.href = "/provider";
//       else window.location.href = "/user";
//     }
//   }

//   return (
//     // <form onSubmit={handleLogin}>
//     //   <input name="email" placeholder="Email" />
//     //   <input name="password" placeholder="Password" type="password" />
//     //   <button type="submit">Login</button>
//     // </form>
//     <form
//       onSubmit={handleLogin}
//       className="w-full max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 mt-10"
//     >
//       <div>
//         <label className="block text-sm font-medium mb-1">Email</label>
//         <input
//           name="email"
//           placeholder="Enter your email"
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           type="email"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Password</label>
//         <input
//           name="password"
//           placeholder="Enter your password"
//           type="password"
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//       >
//         Login
//       </button>
//     </form>

//   );
// }
