
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SuperAdminHeader from "@/app/component/admin/superadminheader"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();


  const adminCode = cookieStore.get("admincode")?.value;

  // verify token with backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/super-admin/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminCode }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/"); 
  }

  return (
    <main>
      <SuperAdminHeader />
      {children}
    </main>
  );
}