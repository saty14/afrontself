import Link from "next/link"


export default function WebHome() {
  return (

    <main className="w-full">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            your sods
          </h1>

        </div>
      </section>

      <section className="bg-gradient-to-r from-black-600 to-black-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">

          

        </div>
      </section>



    </main>

  );
}




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