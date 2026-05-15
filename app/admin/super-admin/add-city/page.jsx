"use client";

import { useState } from "react";

export default function RegisterCityPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMsg({ type: "success", text: data.message });
        setName(""); // clear input
      } else {
        setMsg({ type: "error", text: data.message });
      }
    } catch (error) {
      setLoading(false);
      setMsg({ type: "error", text: "Server error. Try again." });
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Register City
        </h2>

        {msg && (
          <p
            className={`p-2 mb-4 text-center rounded ${
              msg.type === "success"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {msg.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="City Name"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register City"}
          </button>
        </form>
      </div>
    </div>
  );
}
