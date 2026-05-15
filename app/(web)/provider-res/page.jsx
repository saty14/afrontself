"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Provider() {
  const [providers, setProviders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await fetch("http://localhost:8000/api/providers/providers");
      const data = await res.json();

      if (data.success) {
        setProviders(data.providers);
      }
    };

    fetchProviders();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Providers</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <div
            key={provider._id}
            onClick={() => router.push(`/provider-res/${provider.sprovid}`)}
            className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {provider.name}
            </h2>

            <p className="text-sm text-gray-500">{provider.email}</p>
            <p className="text-sm text-gray-500">{provider.mobile}</p>

            <span className="text-xs text-blue-600 mt-2 inline-block">
              View Details →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}