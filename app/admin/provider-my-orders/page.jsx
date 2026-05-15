"use client";

import { useEffect, useState } from "react";

export default function ProviderOrdersPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [cookies, setCookies] = useState({ id: null });

  // =====================================================
  // GET PROVIDER ID
  // =====================================================
  useEffect(() => {
    async function fetchCookies() {
      const res = await fetch("/api/cookies", {
        cache: "no-store",
      });
      const data = await res.json();
      setCookies(data);
    }

    fetchCookies();
  }, []);

  // =====================================================
  // FETCH ORDERS
  // =====================================================
  async function fetchOrders(pageNumber = 1) {
    if (!cookies.id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/order/provider-orders/${cookies.id}?page=${pageNumber}&limit=5`
      );

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
        setPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // load orders when provider id comes
  useEffect(() => {
    if (cookies.id) {
      fetchOrders(1);
    }
  }, [cookies.id]);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================
  async function updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(
        `${BASE_URL}/api/order/update-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: status }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: status } : o
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  // =====================================================
  // UPDATE PAYMENT STATUS
  // =====================================================
  async function updatePaymentStatus(orderId, status) {
    try {
      const res = await fetch(
        `${BASE_URL}/api/order/update-payment/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus: status }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, paymentStatus: status } : o
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Provider Orders
          </h1>
          <p className="text-gray-500">
            Manage all incoming orders
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
            No orders found
          </div>
        ) : (
          <div className="space-y-6">

            {/* ORDERS */}
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow p-5"
              >

                {/* TOP */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4 border-b pb-4">

                  <div>
                    <h2 className="text-2xl font-bold">
                      Token #{order.tokenNumber}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <p className="text-gray-600 text-sm">
                      Mobile: {order.customerMobile}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ₹{order.totalAmount}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.paymentMethod === "online"
                        ? "Online Payment"
                        : "Pay At Counter"}
                    </p>
                  </div>
                </div>

                {/* CONTROLS */}
                <div className="grid md:grid-cols-2 gap-4 mt-5">

                  {/* ORDER STATUS */}
                  <div>
                    <label className="text-sm text-gray-500">
                      Order Status
                    </label>

                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="w-full border p-3 rounded-lg mt-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* PAYMENT STATUS */}
                  <div>
                    <label className="text-sm text-gray-500">
                      Payment Status
                    </label>

                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        updatePaymentStatus(order._id, e.target.value)
                      }
                      className="w-full border p-3 rounded-lg mt-1"
                    >
                      <option value="UnPaid">UnPaid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="mt-6">
                  <h3 className="font-bold mb-3">
                    Items
                  </h3>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between border p-3 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <div className="font-bold">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 mt-10">

              <button
                disabled={page === 1}
                onClick={() => fetchOrders(page - 1)}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => fetchOrders(page + 1)}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}



// =========================================================

// "use client";

// import { useEffect, useState } from "react";

// export default function ProviderOrdersPage() {

//   const BASE_URL =
//     process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

//   const [orders, setOrders] = useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [cookies, setCookies] =
//     useState({
//       id: null,
//     });

//   // =====================================================
//   // GET PROVIDER ID FROM COOKIE
//   // =====================================================

//   useEffect(() => {

//     async function fetchCookies() {

//       const res = await fetch(
//         "/api/cookies",
//         {
//           cache: "no-store",
//         }
//       );

//       const data = await res.json();

//       setCookies(data);
//     }

//     fetchCookies();

//   }, []);

//   // =====================================================
//   // FETCH ORDERS
//   // =====================================================

//   useEffect(() => {

//     async function fetchOrders() {

//       if (!cookies.id) return;

//       try {

//         setLoading(true);

//         const res = await fetch(
//           `${BASE_URL}/api/order/provider-orders/${cookies.id}`
//         );

//         const data = await res.json();

//         if (data.success) {
//           setOrders(data.orders || []);
//         }

//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrders();

//   }, [cookies.id]);

//   // =====================================================
//   // UPDATE ORDER STATUS
//   // =====================================================

//   async function updateOrderStatus(
//     orderId,
//     orderStatus
//   ) {
//     try {

//       const res = await fetch(
//         `${BASE_URL}/api/order/update-status/${orderId}`,
//         {
//           method: "PUT",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             orderStatus,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {

//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === orderId
//               ? {
//                   ...o,
//                   orderStatus,
//                 }
//               : o
//           )
//         );
//       }

//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // =====================================================
//   // UPDATE PAYMENT STATUS
//   // =====================================================

//   async function updatePaymentStatus(
//     orderId,
//     paymentStatus
//   ) {
//     try {

//       const res = await fetch(
//         `${BASE_URL}/api/order/update-payment/${orderId}`,
//         {
//           method: "PUT",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             paymentStatus,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {

//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === orderId
//               ? {
//                   ...o,
//                   paymentStatus,
//                 }
//               : o
//           )
//         );
//       }

//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">

//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}

//         <div className="mb-6">

//           <h1 className="text-3xl font-bold">
//             Provider Orders
//           </h1>

//           <p className="text-gray-500">
//             Manage customer orders
//           </p>
//         </div>

//         {/* LOADING */}

//         {loading ? (
//           <div className="text-center py-20">
//             Loading orders...
//           </div>

//         ) : orders.length === 0 ? (

//           <div className="bg-white rounded-xl p-10 shadow text-center text-gray-500">
//             No orders found
//           </div>

//         ) : (

//           <div className="space-y-5">

//             {orders.map((order) => (

//               <div
//                 key={order._id}
//                 className="bg-white rounded-2xl shadow p-5"
//               >

//                 {/* TOP */}

//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">

//                   <div>

//                     <h2 className="text-2xl font-bold">
//                       Token #{order.tokenNumber}
//                     </h2>

//                     <p className="text-gray-500 text-sm">
//                       {new Date(
//                         order.createdAt
//                       ).toLocaleString()}
//                     </p>
//                   </div>

//                   <div className="text-right">

//                     <p className="font-bold text-2xl">
//                       ₹{order.totalAmount}
//                     </p>

//                     <p className="text-sm text-gray-500">
//                       {order.customerMobile}
//                     </p>
//                   </div>
//                 </div>

//                 {/* DETAILS */}

//                 <div className="grid md:grid-cols-3 gap-4 mt-5">

//                   {/* ORDER STATUS */}

//                   <div className="border rounded-xl p-4">

//                     <label className="block text-sm text-gray-500 mb-2">
//                       Order Status
//                     </label>

//                     <select
//                       value={order.orderStatus}
//                       onChange={(e) =>
//                         updateOrderStatus(
//                           order._id,
//                           e.target.value
//                         )
//                       }
//                       className="w-full border p-3 rounded-lg"
//                     >
//                       <option value="Pending">
//                         Pending
//                       </option>

//                       <option value="Preparing">
//                         Preparing
//                       </option>

//                       <option value="Ready">
//                         Ready
//                       </option>

//                       <option value="Completed">
//                         Completed
//                       </option>

//                       <option value="Cancelled">
//                         Cancelled
//                       </option>
//                     </select>
//                   </div>

//                   {/* PAYMENT STATUS */}

//                   <div className="border rounded-xl p-4">

//                     <label className="block text-sm text-gray-500 mb-2">
//                       Payment Status
//                     </label>

//                     <select
//                       value={order.paymentStatus}
//                       onChange={(e) =>
//                         updatePaymentStatus(
//                           order._id,
//                           e.target.value
//                         )
//                       }
//                       className="w-full border p-3 rounded-lg"
//                     >
//                       <option value="UnPaid">
//                         UnPaid
//                       </option>

//                       <option value="Paid">
//                         Paid
//                       </option>
//                     </select>
//                   </div>

//                   {/* PAYMENT METHOD */}

//                   <div className="border rounded-xl p-4">

//                     <label className="block text-sm text-gray-500 mb-2">
//                       Payment Method
//                     </label>

//                     <div className="bg-gray-100 rounded-lg p-3 font-medium">

//                       {order.paymentMethod ===
//                       "online"
//                         ? "Online Payment"
//                         : "Pay At Counter"}
//                     </div>
//                   </div>
//                 </div>

//                 {/* ITEMS */}

//                 <div className="mt-6">

//                   <h3 className="font-bold text-lg mb-4">
//                     Order Items
//                   </h3>

//                   <div className="space-y-3">

//                     {order.items.map((item) => (

//                       <div
//                         key={item._id}
//                         className="border rounded-xl p-4 flex justify-between items-center"
//                       >

//                         <div>

//                           <h4 className="font-semibold">
//                             {item.name}
//                           </h4>

//                           <p className="text-sm text-gray-500">
//                             Qty: {item.quantity}
//                           </p>
//                         </div>

//                         <div className="font-bold text-lg">
//                           ₹
//                           {item.price *
//                             item.quantity}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }