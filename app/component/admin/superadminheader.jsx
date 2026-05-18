"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";


export default function SuperAdminHeader() {
  const [open, setOpen] = useState(false);     // mobile menu
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const loginRef = useRef(null);
  const registerRef = useRef(null);

  // CLICK OUTSIDE HANDLER FOR BOTH DROPDOWNS
  useEffect(() => {
    const handler = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setLoginOpen(false);
      }
      if (registerRef.current && !registerRef.current.contains(e.target)) {
        setRegisterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <Link href="/me-super-admin" className="text-xl font-bold">
          MySite pro
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-6 text-lg items-center">
          <Link href="/me-super-admin">Home</Link>
          <Link href="/me-super-admin/all-providers">all Providers</Link>
          {/* <Link href="/admin/provider-my-orders">My Orders</Link>
          <Link href="/admin/analytics">Analytics</Link>
          <Link href="/admin/edit-provider-profile">Profile</Link> */}
          
    
          
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <nav className="md:hidden flex flex-col gap-4 mt-4 px-4 pb-4 text-lg">
          <Link href="/me-super-admin" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/me-super-admin/all-providers" onClick={() => setOpen(false)}>all providers</Link>
          {/* <Link href="/about" onClick={() => setOpen(false)}>About</Link> */}
      
          {/* <Link href="/admin//work-list-filter" onClick={() => setOpen(false)}>Find Work</Link>
          <Link href="/admin/my-work-provider" onClick={() => setOpen(false)}>My Work</Link> */}
        </nav>
      )}
    </header>
  );
}













// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export default function Header() {
//     const [open, setOpen] = useState(false);
//     const [loginShow, SetLoginShow] = useState(false);
//     const [registerShow, SetRegisterShow] = useState(false);
//     const loginShowFun = ()=>{
//         SetLoginShow(true)
//         SetRegisterShow(false)
//     }
   

//     return (
//         <header className="bg-white shadow-md px-6 py-4">
//             <div className="max-w-6xl mx-auto flex justify-between items-center">

//                 {/* LOGO */}
//                 <Link href="/" className="text-xl font-bold">
//                     MySite
//                 </Link>

//                 {/* DESKTOP MENU */}
//                 <nav className="hidden md:flex gap-6 text-lg">
//                     <Link href="/">Home</Link>
//                     <Link href="/about">About</Link>
//                     {/* <a>Login
//                        <Link href="/login" >Login</Link>
//                        <Link href="/login-provider" >Login-provider</Link>
//                          </a> */}

//                             <div className="relative group inline-block">
//                             {/* Main Login button */}
//                             <span className="cursor-pointer" onClick={()=>loginShowFun()}>Login</span>

//                             {/* Dropdown */}
//                             {loginShow?
//                             <div className="absolute  group-hover:block bg-white shadow-lg rounded mt-2 py-2 w-40">
//                                 <Link href="/login" className="block px-4 py-2 hover:bg-gray-100">
//                                 Login User
//                                 </Link>
//                                 <Link href="/login-provider" className="block px-4 py-2 hover:bg-gray-100">
//                                 Login Provider
//                                 </Link>
//                             </div>:null}
//                             </div>

//                     {/* <Link href="/login" >Login</Link> */}
//                     {/* <Link href="/register" >Register</Link> */}
//                     {/* <Link href="/email-verify" >Email-verify</Link>/ */}
//                     {/* <Link href="/login-provider" >Login-provider</Link> */}
//                     {/* <Link href="/register-provider" >Register-provider</Link> */}

//                       <div className="relative group inline-block">
//                             {/* Main Login button */}
//                             <span className="cursor-pointer">Register</span>

//                             {/* Dropdown hidden */}
//                             <div className="absolute  group-hover:block bg-white shadow-lg rounded mt-2 py-2 w-48">
//                                 <Link href="/register" className="block px-4 py-2 hover:bg-gray-100">
//                                 Register User
//                                 </Link>
//                                 <Link href="/register-provider" className="block px-4 py-2 hover:bg-gray-100">
//                                 Register Provider
//                                 </Link>
//                             </div>
//                             </div>



//                     {/* <Link href="/email-verify-provider" >Email-verify-provider</Link> */}
//                     {/* <Link href="/user-forgot-password" > User-forgot-password</Link> */}
//                     {/* <Link href="/provider-forgot-password" > Provider-forgot-password</Link> */}
//                     <Link href="/admin/all-work-list" > All-work-list</Link>
//                     <Link href="/admin/add-work" > add-work</Link>
//                     <Link href="/admin/my-work-list" > my-work-list</Link>
                     
//                 </nav>

//                 {/* MOBILE MENU BUTTON */}
//                 <button
//                     className="md:hidden flex flex-col gap-1"
//                     onClick={() => setOpen(!open)}
//                 >
//                     <span className="w-6 h-0.5 bg-black"></span>
//                     <span className="w-6 h-0.5 bg-black"></span>
//                     <span className="w-6 h-0.5 bg-black"></span>
//                 </button>
//             </div>

//             {/* MOBILE DROPDOWN */}
//             {open && (
//                 <nav className="md:hidden flex flex-col gap-4 mt-4 px-4 pb-4 text-lg">
//                     <Link href="/" onClick={() => setOpen(false)}>Home</Link>
//                     <Link href="/about" onClick={() => setOpen(false)}>About</Link>
//                     <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
//                     <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
//                 </nav>
//             )}
//         </header>
//     );
// }




