import Link from "next/link";
import  Footer from "@/app/component/web/footer"


export default function HomePage() {
  const features = [
    {
      icon: "🛒",
      title: "Self Ordering Kiosk",
      desc: "Customers can place orders directly from the mobile  or kiosk screens themselves.",
    },
    {
      icon: "📱",
      title: "QR Table Ordering",
      desc: "Scan QR from table and order instantly.",
    },
    {
      icon: "💳",
      title: "Online & Offline Payments",
      desc: "Accept UPI, cards, wallets and cash payments.",
    },
    {
      icon: "🍽️",
      title: "Dine In & Packaging",
      desc: "Support dine-in, takeaway and packing orders.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      desc: "Track sales, revenue and top-selling products.",
    },
    {
      icon: "🏨",
      title: "Multi Restaurant Support",
      desc: "Restaurants and hotels can register and manage.",
    },
  ];

  // const pricing = [
  //   {
  //     name: "Starter",
  //     price: "₹29",
  //   },
  //   {
  //     name: "Business",
  //     price: "₹79",
  //   },
  //   {
  //     name: "Enterprise",
  //     price: "₹199",
  //   },
  // ];
    const pricing = [
    {
      name: "Only offline",
      price: "free",
    },
    {
      name: "Online with offline",
      price: "4% of total order amount",
    },

  ];

  return (
    <main className="bg-[#050505] text-white overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center px-6">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-yellow-500/20 blur-3xl" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* LEFT */}
          <div className="animate-fadeIn">

            <div className="inline-block px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 mb-6 mt-4">
              Smart Restaurant SaaS Platform
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              Smart Self Ordering
              <span className="text-orange-500"> Kiosk System </span>
              For Restaurants & Hotels
            </h1>

            <p className="mt-8 text-gray-300 text-xl leading-relaxed max-w-xl">
              Manage orders, products, tables, payments and restaurant earnings
              from one modern platform. Perfect for restaurants, cafés, hotels
              and food courts.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <button className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-orange-500/30">
                {/* Start Free Trial */}
                Start 
              </button>

              <button className="border border-white/20 hover:bg-white/10 transition px-8 py-4 rounded-2xl font-semibold text-lg">
                Live Demo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12">

              <div>
                <h2 className="text-3xl font-bold text-orange-400">500+</h2>
                <p className="text-gray-400">Restaurants</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-orange-400">20K+</h2>
                <p className="text-gray-400">Daily Orders</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-orange-400">99.9%</h2>
                <p className="text-gray-400">Uptime</p>
              </div>

            </div>

          </div>

          {/* RIGHT DASHBOARD */}
          <div className="relative animate-float">

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-gray-400">Restaurant Dashboard</p>
                  <h3 className="text-2xl font-bold mt-2">
                    Royal Food Plaza
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl">
                  🍔
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">

                <div className="bg-black/30 rounded-2xl p-5">
                  <p className="text-gray-400">Orders</p>
                  <h2 className="text-4xl font-bold mt-3">248</h2>
                </div>

                <div className="bg-black/30 rounded-2xl p-5">
                  <p className="text-gray-400">Revenue</p>
                  <h2 className="text-4xl font-bold mt-3">₹3420</h2>
                </div>

                <div className="bg-black/30 rounded-2xl p-5 col-span-2">

                  <div className="flex justify-between mb-3">
                    <span>Dine In Orders</span>
                    <span>68%</span>
                  </div>

                  <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-4 w-[68%] rounded-full"></div>
                  </div>

                </div>

              </div>

              <div className="mt-6 bg-orange-500 rounded-2xl p-5 flex items-center gap-4">
                <div className="text-3xl">⚡</div>

                <div>
                  <h4 className="font-bold text-lg">
                    Live Order Processing
                  </h4>

                  <p className="text-sm opacity-90">
                    Kitchen and cashier synced instantly
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="py-28 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold">
              Powerful Features
            </h2>

            <p className="text-gray-400 mt-6 text-xl">
              Everything needed to run modern restaurants
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 hover:border-orange-500/40 transition-all duration-300 rounded-3xl p-8 hover:-translate-y-2"
              >

                <div className="text-5xl mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 bg-white/5">

        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold">
              How It Works
            </h2>

          </div>

          <div className="space-y-8">

            {[
              "Restaurant registers on the platform",
              "Add tables, menu and products",
              "Customers order from kiosk or QR or directly from the mobile",
              "Kitchen receives orders instantly",
              "Payments processed online/offline",
              "Track earnings and analytics",
              "Customers can instantly view their order details and order status",
            ].map((step, i) => (

              <div
                key={i}
                className="flex items-center gap-6 bg-black/40 border border-white/10 rounded-3xl p-6"
              >

                <div className="min-w-[60px] h-[60px] rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold">
                  {i + 1}
                </div>

                <h3 className="text-xl font-semibold">
                  {step}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* PRICING */}
      <section className="py-28 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold">
              Pricing Plans
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {pricing.map((plan, i) => (

              <div
                key={i}
                className={`rounded-3xl p-10 border ${
                  i === 1
                    ? "bg-orange-500 border-orange-400 scale-105"
                    : "bg-white/5 border-white/10"
                }`}
              >

                <h3 className="text-3xl font-bold">
                  {plan.name}
                </h3>

                <div className="mt-8 text-6xl font-black">
                  {plan.price}
                </div>

                <ul className="space-y-4 mt-10 text-lg">
                  <li>✔ Unlimited Orders</li>
                  <li>✔ QR Ordering</li>
                  <li>✔ Analytics Dashboard</li>
                  {/* <li>✔ Online Payments</li> */}
                  <li>✔  Payments</li>
                </ul>

                <button className="mt-10 w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition">
                  Choose Plan
                </button>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-32 px-6">

        <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-orange-500 to-red-500 rounded-[40px] p-16">

          <h2 className="text-5xl font-black leading-tight">
            Ready To Transform Your Restaurant?
          </h2>

          <p className="mt-6 text-xl text-white/90">
            Launch your self-ordering restaurant platform today.
          </p>

          <button className="mt-10 bg-black hover:bg-gray-900 transition px-10 py-5 rounded-2xl text-xl font-bold">
            Get Started Now
          </button>

        </div>

      </section>

      
      {/* FOOTER */}

      <Footer />



      {/* <footer className="border-t border-white/10 py-10 px-6">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">

          <div>
            <h3 className="text-3xl font-black text-orange-500">
              KioskCloud
            </h3>

            <p className="text-gray-400 mt-3">
              Smart restaurant ordering SaaS platform.
            </p>
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
               <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
              <Link href="/refund-policy">Refund Policy</Link>
              <Link href="/shipping-policy">Shipping Policy</Link>
              <Link href="/support">Support</Link>
              <Link href="/contact">Contact</Link>
            </div>

          <div className="text-gray-400">
            © 2026 KioskCloud. All rights reserved.
          </div>


        </div>

      </footer> */}
      {/* FOOTER */}
   

    </main>
  );
}


// import Link from "next/link"


// export default function WebHome() {
//   return (

//     <main className="w-full">

//       {/* HERO SECTION */}
//       <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
//         <div className="max-w-6xl mx-auto px-6 py-24 text-center">
//           <h1 className="text-5xl font-bold mb-6">
//             your sods
//           </h1>

//         </div>
//       </section>

//       <section className="bg-gradient-to-r from-black-600 to-black-800 text-white">
//         <div className="max-w-6xl mx-auto px-6 py-24 text-center">

          

//         </div>
//       </section>



//     </main>

//   );
// }




// "use client";
// import { useState } from "react";

// export default function Page() {
//   const [pickup, setPickup] = useState("");
//   const [drop, setDrop] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");

//   const handleSubmit = () => {
//     alert(`Cab booked from ${pickup} to ${drop} on ${date} at ${time}`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
//         <h1 className="text-2xl font-bold mb-6 text-center">Book Your Cab</h1>

//         <div className="space-y-4">
//           <input
//             placeholder="Pickup Location"
//             value={pickup}
//             onChange={(e) => setPickup(e.target.value)}
//             className="w-full p-3 border rounded-xl"
//           />
//           <input
//             placeholder="Drop Location"
//             value={drop}
//             onChange={(e) => setDrop(e.target.value)}
//             className="w-full p-3 border rounded-xl"
//           />
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="w-full p-3 border rounded-xl"
//           />
//           <input
//             type="time"
//             value={time}
//             onChange={(e) => setTime(e.target.value)}
//             className="w-full p-3 border rounded-xl"
//           />
//           <button
//             onClick={handleSubmit}
//             className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg hover:bg-blue-700 transition"
//           >
//             Book Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }