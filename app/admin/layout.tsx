import { cookies } from "next/headers";
import UserLogoutButton from "@/app/component/admin/userLogouteBtn/logoutbtn"
import ProviderLogoutButton from "@/app/component/admin/providerLogouteBtn/logoutbtn"
import UserAdminHeader from "@/app/component/admin/userheader"
import ProviderAdminHeader from "@/app/component/admin/providerheader"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const cookieStore = await cookies();               // ✔ correct
  const id = cookieStore.get("id")?.value;     // ✔ correct
  const role = cookieStore.get("role")?.value; // ✔ correct
  return (
    <main>
        {role== "2" ? <ProviderAdminHeader /> : <UserAdminHeader/>}
   <div>
    {/* <span > {role== "2" ? <ProviderLogoutButton /> : <UserLogoutButton/>}</span> */}
   </div>
      {children}
      </main>
  )
}