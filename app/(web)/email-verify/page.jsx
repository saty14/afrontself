"use client";

import { useState } from "react";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("error"); // success or error

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const email = e.target.email.value;
    const password = e.target.password.value;
    const otp = e.target.otp.value;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/user/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setType("error");
        setMessage(data.message || "Verification failed");
        return;
      }

      setType("success");
      setMessage("Email verified successfully! Redirecting...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err) {
      setLoading(false);
      setType("error");
      setMessage("Something went wrong. Server unreachable.");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Verify Your Email
        </h2>

        {/* MESSAGE */}
        {message && (
          <p
            className={`p-2 rounded-lg text-center text-sm ${
              type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* NEW PASSWORD */}
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter new password"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* OTP INPUT */}
        <div>
          <label className="block text-sm font-medium mb-1">OTP</label>
          <input
            name="otp"
            placeholder="Enter OTP"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
}
