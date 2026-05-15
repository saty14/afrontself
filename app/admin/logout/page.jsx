"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logoutcokis() {


      const cookie = await fetch("/api/cookies");
      const { id } = await cookie.json();
      const suid = id;

      if (!suid) {
        // router.push("/login");
        alert('something went wrong ! ')
        return;
      }

      async function logoutHandler() {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/user/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ suid }),
          });

          await fetch("/api/logout");
          

          // // Remove cookies
          // Cookies.remove("token");
          // Cookies.remove("role");
          // Cookies.remove("id");

          router.push("/login");
        } catch (error) {
          console.error("Logout Error:", error);
        }
      }

      logoutHandler();
    }
    logoutcokis();
  }, [router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <h2>Logging out...</h2>
    </div>
  );
}
