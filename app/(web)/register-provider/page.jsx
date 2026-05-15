"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile:"",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(data.message || "Failed to register");
        return;
      }

      setMessage("Registration successful! Check your email for OTP.");
      setForm({ name: "", email: "",  mobile:"", password: "" });
         setTimeout(() => {
        window.location.href = "/email-verify-provider";
      }, 2000);

    } catch (error) {
      setLoading(false);
      setMessage("Something went wrong.");
      console.error("Register error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register Provider</h2>

        {/* NAME INPUT */}
        <label className="block mb-4">
          <span className="block text-sm font-medium">Full Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg"
            required
          />
        </label>

        {/* EMAIL INPUT */}
        <label className="block mb-4">
          <span className="block text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg"
            required
          />
        </label>

        
           {/* MOBILE INPUT */}
        <label className="block mb-4">
          <span className="block text-sm font-medium">Mobile</span>
          <input
            type="number"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg"
            required
          />
        </label>

        {/* PASSWORD INPUT */}
        <label className="block mb-6">
          <span className="block text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}
