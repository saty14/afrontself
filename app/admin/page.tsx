
import { cookies } from "next/headers";
import UserLogoutButton from "@/app/component/admin/userLogouteBtn/logoutbtn"
import ProviderLogoutButton from "@/app/component/admin/providerLogouteBtn/logoutbtn"
import UserAdminHeader from "@/app/component/admin/userheader"
import ProviderAdminHeader from "@/app/component/admin/providerheader"
 import UserDashboardHome from "@/app/component/admin/userHomepage"
 import ProviderDashboardHome from "@/app/component/admin/providerHomepage"
export default async function AdminHome() {
  const cookieStore = await cookies();               // ✔ correct
  const id = cookieStore.get("id")?.value;     // ✔ correct
  const role = cookieStore.get("role")?.value; // ✔ correct

  return (
    <div className="min-h-screen bg-gray-100 ">
   
   {/* {role== "2" ? <ProviderAdminHeader /> : <UserAdminHeader/>}
   <div>
    <span style={{float:"right",margin:"10px"}}> {role== "2" ? <ProviderLogoutButton /> : <UserLogoutButton/>}</span>
   </div> */}
   
    
      {/* AdminHome page — ID: {id}, Role: {role}
      {role === "1" ?<p>You are User  </p>:<p>You are Provider  </p>} */}

    {role== "2" ? <ProviderDashboardHome /> : <UserDashboardHome/>}


    </div>
  );
}




