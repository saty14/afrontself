"use client";
import { useRouter } from "next/navigation";

export default function UserLogoutButton() {
  const router = useRouter();
  return (
    <p>
      <button className="
        flex items-center gap-2
        rounded-full
        bg-red-600
        px-5 py-2
        text-sm font-semibold text-white
        shadow-lg
        transition-all duration-200
        hover:bg-red-700 hover:scale-105
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-400
      " onClick={() => router.push("/admin/logout")}>
      Logout
    </button>
    </p>



  );
}