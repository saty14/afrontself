"use client";

import { useEffect, useState } from "react";

export default function RegisterLocalAreaPage() {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sctyid: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // FETCH ALL CITIES
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city`)
      .then((res) => res.json())
      .then((data) => setCities(data.citys || []))
      .catch(() =>
        setMsg({ type: "error", text: "Failed to load cities" })
      );
  }, []);

  // HANDLE INPUT CHANGE
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // SUBMIT FORM
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/local-aria/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMsg({ type: "success", text: data.message });
        setForm({ name: "", sctyid: "" });
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
          Register Local Area
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
          {/* CITY SELECT */}
          <select
            name="sctyid"
            value={form.sctyid}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c._id} value={c.sctyid}>
                {c.name}
              </option>
            ))}
          </select>

          {/* LOCAL AREA NAME */}
          <input
            type="text"
            name="name"
            placeholder="Local Area Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register Local Area"}
          </button>
        </form>
      </div>
    </div>
  );
}
