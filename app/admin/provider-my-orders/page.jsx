"use client";

import { useEffect, useState } from "react";

export default function ProviderOrdersPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [cookies, setCookies] = useState({ id: null });

  const [editingOrder, setEditingOrder] = useState(null);

  const [filters, setFilters] = useState({
    status: "All",
    payment: "All",
    search: "",
  });

  // ==============================
  // GET PROVIDER ID
  // ==============================
  useEffect(() => {
    async function fetchCookies() {
      const res = await fetch("/api/cookies", { cache: "no-store" });
      const data = await res.json();
      setCookies(data);
    }
    fetchCookies();
  }, []);

  // ==============================
  // FETCH ORDERS (SERVER FILTER)
  // ==============================
  async function fetchOrders(pageNumber = 1) {
    if (!cookies.id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/order/provider-orders/${cookies.id}` +
          `?page=${pageNumber}` +
          `&limit=5` +
          `&search=${filters.search}` +
          `&status=${filters.status}` +
          `&payment=${filters.payment}`
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

  useEffect(() => {
    if (cookies.id) {
      fetchOrders(1);
    }
  }, [cookies.id, filters]);

  // ==============================
  // UPDATE ORDER STATUS
  // ==============================
  async function updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(
        `${BASE_URL}/api/order/update-status/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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

  // ==============================
  // UPDATE PAYMENT STATUS
  // ==============================
  async function updatePaymentStatus(orderId, status) {
    try {
      const res = await fetch(
        `${BASE_URL}/api/order/update-payment/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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

  // ==============================
  // UPDATE ITEMS (IMPORTANT FIX)
  // ==============================
  async function updateOrderItems(order) {
    try {
      const res = await fetch(
        `${BASE_URL}/api/order/update-items/${order._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: order.items,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? data.order : o))
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  // ==============================
  // UI
  // ==============================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Provider Orders</h1>
          <p className="text-gray-500">
            Manage orders, filters & items
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-3">

          <input
            placeholder="Search Mobile / Token"
            className="border p-2 rounded"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />

          <select
            className="border p-2 rounded"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="border p-2 rounded"
            value={filters.payment}
            onChange={(e) =>
              setFilters({ ...filters, payment: e.target.value })
            }
          >
            <option value="All">All Payment</option>
            <option value="Paid">Paid</option>
            <option value="UnPaid">UnPaid</option>
          </select>

          <button
            className="bg-black text-white rounded p-2"
            onClick={() =>
              setFilters({
                status: "All",
                payment: "All",
                search: "",
              })
            }
          >
            Reset
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-xl">
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
                <div className="flex justify-between border-b pb-4">

                  <div>
                    <h2 className="text-xl font-bold">
                      Token #{order.tokenNumber}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-600">
                      {order.customerMobile}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">
                      ₹{order.totalAmount}
                    </p>

                    {/* EDIT BUTTON */}
                    <button
                      onClick={() =>
                        setEditingOrder(JSON.parse(JSON.stringify(order)))
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                    >
                      Edit Items
                    </button>
                  </div>
                </div>

                {/* STATUS */}
                <div className="grid md:grid-cols-2 gap-3 mt-4">

                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className="border p-2 rounded"
                  >
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>Completed</option>
                  </select>

                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      updatePaymentStatus(order._id, e.target.value)
                    }
                    className="border p-2 rounded"
                  >
                    <option>UnPaid</option>
                    <option>Paid</option>
                  </select>

                </div>

                {/* ITEMS VIEW */}
                <div className="mt-4 space-y-2">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between border p-2 rounded"
                    >
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}

            {/* PAGINATION */}
            <div className="flex justify-center gap-4 mt-8">

              <button
                disabled={page === 1}
                onClick={() => fetchOrders(page - 1)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => fetchOrders(page + 1)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Next
              </button>

            </div>

          </div>
        )}

        {/* ================= EDIT MODAL ================= */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px]">

              <h2 className="text-xl font-bold mb-4">
                Edit Order Items
              </h2>

              {editingOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border p-2 mb-2 rounded"
                >

                  <p>{item.name}</p>

                  <input
                    type="number"
                    className="border p-1 w-20"
                    value={item.quantity}
                    onChange={(e) => {
                      const updated = [...editingOrder.items];
                      updated[index].quantity = Number(e.target.value);

                      setEditingOrder({
                        ...editingOrder,
                        items: updated,
                      });
                    }}
                  />

                </div>
              ))}

              <div className="flex justify-end gap-3 mt-4">

                <button
                  className="px-3 py-2 bg-gray-400 rounded"
                  onClick={() => setEditingOrder(null)}
                >
                  Cancel
                </button>

                <button
                  className="px-3 py-2 bg-green-600 text-white rounded"
                  onClick={async () => {
                    await updateOrderItems(editingOrder);
                    setEditingOrder(null);
                  }}
                >
                  Save
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
// =============================filter working without edit======================
// "use client";

// import { useEffect, useState } from "react";

// export default function ProviderOrdersPage() {
//   const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [cookies, setCookies] = useState({ id: null });

//   const [editingOrder, setEditingOrder] = useState(null);

//   const [filters, setFilters] = useState({
//     status: "All",
//     payment: "All",
//     search: "",
//   });

//   // ==============================
//   // GET PROVIDER ID
//   // ==============================
//   useEffect(() => {
//     async function fetchCookies() {
//       const res = await fetch("/api/cookies", { cache: "no-store" });
//       const data = await res.json();
//       setCookies(data);
//     }
//     fetchCookies();
//   }, []);

//   // ==============================
//   // FETCH ORDERS (SERVER FILTERING)
//   // ==============================
//   async function fetchOrders(pageNumber = 1) {
//     if (!cookies.id) return;

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${BASE_URL}/api/order/provider-orders/${cookies.id}` +
//           `?page=${pageNumber}` +
//           `&limit=5` +
//           `&search=${filters.search}` +
//           `&status=${filters.status}` +
//           `&payment=${filters.payment}`
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders(data.orders || []);
//         setPage(data.pagination.page);
//         setTotalPages(data.pagination.totalPages);
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ==============================
//   // RE-FETCH ON FILTER CHANGE
//   // ==============================
//   useEffect(() => {
//     if (cookies.id) {
//       fetchOrders(1);
//     }
//   }, [cookies.id, filters]);

//   // ==============================
//   // UPDATE ORDER STATUS
//   // ==============================
//   async function updateOrderStatus(orderId, status) {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/order/update-status/${orderId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orderStatus: status }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === orderId ? { ...o, orderStatus: status } : o
//           )
//         );
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // ==============================
//   // UPDATE PAYMENT STATUS
//   // ==============================
//   async function updatePaymentStatus(orderId, status) {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/order/update-payment/${orderId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ paymentStatus: status }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === orderId ? { ...o, paymentStatus: status } : o
//           )
//         );
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // ==============================
//   // UPDATE ITEMS
//   // ==============================
//   async function updateOrderItems(order) {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/order/update-items/${order._id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ items: order.items }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders((prev) =>
//           prev.map((o) => (o._id === order._id ? data.order : o))
//         );
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // ==============================
//   // UI
//   // ==============================
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">Provider Orders</h1>
//           <p className="text-gray-500">
//             Manage orders, payments, items
//           </p>
//         </div>

//         {/* FILTERS */}
//         <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-3">

//           <input
//             className="border p-2 rounded"
//             placeholder="Search mobile / token"
//             value={filters.search}
//             onChange={(e) =>
//               setFilters({ ...filters, search: e.target.value })
//             }
//           />

//           <select
//             className="border p-2 rounded"
//             value={filters.status}
//             onChange={(e) =>
//               setFilters({ ...filters, status: e.target.value })
//             }
//           >
//             <option value="All">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Preparing">Preparing</option>
//             <option value="Completed">Completed</option>
//           </select>

//           <select
//             className="border p-2 rounded"
//             value={filters.payment}
//             onChange={(e) =>
//               setFilters({ ...filters, payment: e.target.value })
//             }
//           >
//             <option value="All">All Payment</option>
//             <option value="Paid">Paid</option>
//             <option value="UnPaid">UnPaid</option>
//           </select>

//           <button
//             className="bg-black text-white rounded p-2"
//             onClick={() =>
//               setFilters({
//                 status: "All",
//                 payment: "All",
//                 search: "",
//               })
//             }
//           >
//             Reset
//           </button>
//         </div>

//         {/* LOADING */}
//         {loading ? (
//           <div className="text-center py-20">Loading...</div>
//         ) : orders.length === 0 ? (
//           <div className="bg-white p-10 rounded-xl text-center text-gray-500">
//             No orders found
//           </div>
//         ) : (
//           <div className="space-y-6">

//             {/* ORDERS */}
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white rounded-2xl shadow p-5"
//               >

//                 <div className="flex justify-between border-b pb-4">

//                   <div>
//                     <h2 className="text-xl font-bold">
//                       Token #{order.tokenNumber}
//                     </h2>

//                     <p className="text-sm text-gray-500">
//                       {new Date(order.createdAt).toLocaleString()}
//                     </p>

//                     <p className="text-sm text-gray-600">
//                       {order.customerMobile}
//                     </p>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-xl font-bold">
//                       ₹{order.totalAmount}
//                     </p>
//                   </div>

//                 </div>

//                 {/* STATUS */}
//                 <div className="grid md:grid-cols-2 gap-3 mt-4">

//                   <select
//                     value={order.orderStatus}
//                     onChange={(e) =>
//                       updateOrderStatus(order._id, e.target.value)
//                     }
//                     className="border p-2 rounded"
//                   >
//                     <option>Pending</option>
//                     <option>Preparing</option>
//                     <option>Completed</option>
//                   </select>

//                   <select
//                     value={order.paymentStatus}
//                     onChange={(e) =>
//                       updatePaymentStatus(order._id, e.target.value)
//                     }
//                     className="border p-2 rounded"
//                   >
//                     <option>UnPaid</option>
//                     <option>Paid</option>
//                   </select>

//                 </div>

//                 {/* ITEMS */}
//                 <div className="mt-4">
//                   {order.items.map((item, i) => (
//                     <div
//                       key={i}
//                       className="flex justify-between border p-2 rounded mt-2"
//                     >
//                       <span>{item.name}</span>
//                       <span>Qty: {item.quantity}</span>
//                     </div>
//                   ))}
//                 </div>

//               </div>
//             ))}

//             {/* PAGINATION */}
//             <div className="flex justify-center gap-4 mt-8">

//               <button
//                 disabled={page === 1}
//                 onClick={() => fetchOrders(page - 1)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Prev
//               </button>

//               <span>
//                 Page {page} of {totalPages}
//               </span>

//               <button
//                 disabled={page === totalPages}
//                 onClick={() => fetchOrders(page + 1)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Next
//               </button>

//             </div>

//           </div>
//         )}

//         {/* EDIT MODAL */}
//         {editingOrder && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//             <div className="bg-white p-5 rounded-xl w-[400px]">
//               <h2 className="font-bold mb-3">Edit Order</h2>

//               {editingOrder.items.map((item, i) => (
//                 <input
//                   key={i}
//                   className="border p-2 w-full mb-2"
//                   value={item.quantity}
//                   onChange={(e) => {
//                     const updated = [...editingOrder.items];
//                     updated[i].quantity = e.target.value;

//                     setEditingOrder({
//                       ...editingOrder,
//                       items: updated,
//                     });
//                   }}
//                 />
//               ))}

//               <button
//                 className="bg-green-600 text-white px-3 py-2 rounded mt-3"
//                 onClick={() => {
//                   updateOrderItems(editingOrder);
//                   setEditingOrder(null);
//                 }}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }
// =====================================================================
// "use client";

// import { useEffect, useState } from "react";

// export default function ProviderOrdersPage() {
//   const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [cookies, setCookies] = useState({ id: null });

//   const [editingOrder, setEditingOrder] = useState(null);

//   const [filters, setFilters] = useState({
//     status: "All",
//     payment: "All",
//     search: "",
//   });

//   // =====================================================
//   // GET PROVIDER ID
//   // =====================================================
//   useEffect(() => {
//     async function fetchCookies() {
//       const res = await fetch("/api/cookies", { cache: "no-store" });
//       const data = await res.json();
//       setCookies(data);
//     }

//     fetchCookies();
//   }, []);

//   // =====================================================
//   // FETCH ORDERS
//   // =====================================================
//   // async function fetchOrders(pageNumber = 1) {
//   //   if (!cookies.id) return;

//   //   try {
//   //     setLoading(true);

//   //     const res = await fetch(
//   //       `${BASE_URL}/api/order/provider-orders/${cookies.id}?page=${pageNumber}&limit=5`
//   //     );

//   //     const data = await res.json();

//   //     if (data.success) {
//   //       setOrders(data.orders || []);
//   //       setPage(data.pagination.page);
//   //       setTotalPages(data.pagination.totalPages);
//   //     }
//   //   } catch (err) {
//   //     console.log(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }
//   async function fetchOrders(pageNumber = 1) {
//     if (!cookies.id) return;

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${BASE_URL}/api/order/provider-orders/${cookies.id}` +
//         `?page=${pageNumber}&limit=5` +
//         `&search=${filters.search}` +
//         `&status=${filters.status}` +
//         `&payment=${filters.payment}`
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders(data.orders || []);
//         setPage(data.pagination.page);
//         setTotalPages(data.pagination.totalPages);
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // useEffect(() => {
//   //   if (cookies.id) {
//   //     fetchOrders(1);
//   //   }
//   // }, [cookies.id]);
//   useEffect(() => {
//     if (cookies.id) {
//       fetchOrders(1);
//     }
//   }, [filters]);

//   // =====================================================
//   // UPDATE ORDER STATUS
//   // =====================================================
//   async function updateOrderStatus(orderId, status) {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/order/update-status/${orderId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orderStatus: status }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === orderId ? { ...o, orderStatus: status } : o
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
//   async function updatePaymentStatus(orderId, status) {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/order/update-payment/${orderId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ paymentStatus: status }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === orderId ? { ...o, paymentStatus: status } : o
//           )
//         );
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // =====================================================
//   // UPDATE ITEMS
//   // =====================================================
//   async function updateOrderItems(order) {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/order/update-items/${order._id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ items: order.items }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders((prev) =>
//           prev.map((o) => (o._id === order._id ? data.order : o))
//         );
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // =====================================================
//   // FILTER LOGIC
//   // =====================================================
  
//   const filteredOrders = orders.filter((order) => {
//     const matchStatus =
//       filters.status === "All" ||
//       order.orderStatus === filters.status;

//     const matchPayment =
//       filters.payment === "All" ||
//       order.paymentStatus === filters.payment;

//     const matchSearch =
//       order.customerMobile?.includes(filters.search) ||
//       String(order.tokenNumber).includes(filters.search);

//     return matchStatus && matchPayment && matchSearch;
//   });

//   // =====================================================
//   // UI
//   // =====================================================
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">Provider Orders</h1>
//           <p className="text-gray-500">
//             Manage orders, payments, and items
//           </p>
//         </div>

//         {/* FILTER BAR */}
//         <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-3">

//           <input
//             placeholder="Search Mobile / Token"
//             className="border p-2 rounded"
//             value={filters.search}
//             onChange={(e) =>
//               setFilters({ ...filters, search: e.target.value })
//             }
//           />

//           <select
//             className="border p-2 rounded"
//             value={filters.status}
//             onChange={(e) =>
//               setFilters({ ...filters, status: e.target.value })
//             }
//           >
//             <option value="All">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Preparing">Preparing</option>
//             <option value="Completed">Completed</option>
//           </select>

//           <select
//             className="border p-2 rounded"
//             value={filters.payment}
//             onChange={(e) =>
//               setFilters({ ...filters, payment: e.target.value })
//             }
//           >
//             <option value="All">All Payment</option>
//             <option value="Paid">Paid</option>
//             <option value="UnPaid">UnPaid</option>
//           </select>

//           <button
//             className="bg-gray-800 text-white rounded p-2"
//             onClick={() =>
//               setFilters({
//                 status: "All",
//                 payment: "All",
//                 search: "",
//               })
//             }
//           >
//             Reset
//           </button>
//         </div>

//         {/* CONTENT */}
//         {loading ? (
//           <div className="text-center py-20">
//             Loading orders...
//           </div>
//         ) : filteredOrders.length === 0 ? (
//           <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
//             No orders found
//           </div>
//         ) : (
//           <div className="space-y-6">

//             {filteredOrders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white rounded-2xl shadow p-5"
//               >

//                 {/* TOP */}
//                 <div className="flex justify-between border-b pb-4">

//                   <div>
//                     <h2 className="text-xl font-bold">
//                       Token #{order.tokenNumber}
//                     </h2>

//                     <p className="text-gray-500 text-sm">
//                       {new Date(order.createdAt).toLocaleString()}
//                     </p>

//                     <p className="text-gray-600 text-sm">
//                       Mobile: {order.customerMobile}
//                     </p>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-xl font-bold">
//                       ₹{order.totalAmount}
//                     </p>

//                     <button
//                       className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
//                       onClick={() => setEditingOrder(order)}
//                     >
//                       Edit Items
//                     </button>
//                   </div>
//                 </div>

//                 {/* STATUS */}
//                 <div className="grid md:grid-cols-2 gap-4 mt-4">

//                   <select
//                     value={order.orderStatus}
//                     onChange={(e) =>
//                       updateOrderStatus(order._id, e.target.value)
//                     }
//                     className="border p-2 rounded"
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Preparing">Preparing</option>
//                     <option value="Completed">Completed</option>
//                   </select>

//                   <select
//                     value={order.paymentStatus}
//                     onChange={(e) =>
//                       updatePaymentStatus(order._id, e.target.value)
//                     }
//                     className="border p-2 rounded"
//                   >
//                     <option value="UnPaid">UnPaid</option>
//                     <option value="Paid">Paid</option>
//                   </select>

//                 </div>

//                 {/* ITEMS */}
//                 <div className="mt-4 space-y-2">
//                   {order.items.map((item, i) => (
//                     <div
//                       key={i}
//                       className="flex justify-between border p-2 rounded"
//                     >
//                       <div>
//                         <p className="font-medium">{item.name}</p>
//                       </div>

//                       <div>Qty: {item.quantity}</div>
//                     </div>
//                   ))}
//                 </div>

//               </div>
//             ))}

//             {/* PAGINATION */}
//             <div className="flex justify-center gap-4 mt-8">

//               <button
//                 disabled={page === 1}
//                 onClick={() => fetchOrders(page - 1)}
//                 className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>

//               <span>
//                 Page {page} of {totalPages}
//               </span>

//               <button
//                 disabled={page === totalPages}
//                 onClick={() => fetchOrders(page + 1)}
//                 className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//               >
//                 Next
//               </button>

//             </div>

//           </div>
//         )}

//         {/* EDIT MODAL */}
//         {editingOrder && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px]">

//               <h2 className="text-xl font-bold mb-4">
//                 Edit Items
//               </h2>

//               {editingOrder.items.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between items-center border p-2 mb-2 rounded"
//                 >

//                   <p>{item.name}</p>

//                   <input
//                     type="number"
//                     value={item.quantity}
//                     className="border p-1 w-20"
//                     onChange={(e) => {
//                       const updated = [...editingOrder.items];
//                       updated[index].quantity = Number(e.target.value);

//                       setEditingOrder({
//                         ...editingOrder,
//                         items: updated,
//                       });
//                     }}
//                   />
//                 </div>
//               ))}

//               <div className="flex justify-end gap-2 mt-4">

//                 <button
//                   className="px-3 py-2 bg-gray-400 rounded"
//                   onClick={() => setEditingOrder(null)}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   className="px-3 py-2 bg-green-600 text-white rounded"
//                   onClick={async () => {
//                     await updateOrderItems(editingOrder);
//                     setEditingOrder(null);
//                   }}
//                 >
//                   Save
//                 </button>

//               </div>

//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// ==============================without fiter but working code ==============================
// "use client";

// import { useEffect, useState } from "react";

// export default function ProviderOrdersPage() {
//   const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [cookies, setCookies] = useState({ id: null });

//   // =====================================================
//   // GET PROVIDER ID
//   // =====================================================
//   useEffect(() => {
//     async function fetchCookies() {
//       const res = await fetch("/api/cookies", {
//         cache: "no-store",
//       });
//       const data = await res.json();
//       setCookies(data);
//     }

//     fetchCookies();
//   }, []);

//   // =====================================================
//   // FETCH ORDERS
//   // =====================================================
//   async function fetchOrders(pageNumber = 1) {
//     if (!cookies.id) return;

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${BASE_URL}/api/order/provider-orders/${cookies.id}?page=${pageNumber}&limit=5`
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders(data.orders || []);
//         setPage(data.pagination.page);
//         setTotalPages(data.pagination.totalPages);
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // load orders when provider id comes
//   useEffect(() => {
//     if (cookies.id) {
//       fetchOrders(1);
//     }
//   }, [cookies.id]);

//   // =====================================================
//   // UPDATE ORDER STATUS
//   // =====================================================
//   async function updateOrderStatus(orderId, status) {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/order/update-status/${orderId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ orderStatus: status }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === orderId ? { ...o, orderStatus: status } : o
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
//   async function updatePaymentStatus(orderId, status) {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/order/update-payment/${orderId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ paymentStatus: status }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === orderId ? { ...o, paymentStatus: status } : o
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
//             Manage all incoming orders
//           </p>
//         </div>

//         {/* LOADING */}
//         {loading ? (
//           <div className="text-center py-20">
//             Loading orders...
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
//             No orders found
//           </div>
//         ) : (
//           <div className="space-y-6">

//             {/* ORDERS */}
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white rounded-2xl shadow p-5"
//               >

//                 {/* TOP */}
//                 <div className="flex flex-col md:flex-row md:justify-between gap-4 border-b pb-4">

//                   <div>
//                     <h2 className="text-2xl font-bold">
//                       Token #{order.tokenNumber}
//                     </h2>

//                     <p className="text-gray-500 text-sm">
//                       {new Date(order.createdAt).toLocaleString()}
//                     </p>

//                     <p className="text-gray-600 text-sm">
//                       Mobile: {order.customerMobile}
//                     </p>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-2xl font-bold">
//                       ₹{order.totalAmount}
//                     </p>

//                     <p className="text-sm text-gray-500">
//                       {order.paymentMethod === "online"
//                         ? "Online Payment"
//                         : "Pay At Counter"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* CONTROLS */}
//                 <div className="grid md:grid-cols-2 gap-4 mt-5">

//                   {/* ORDER STATUS */}
//                   <div>
//                     <label className="text-sm text-gray-500">
//                       Order Status
//                     </label>

//                     <select
//                       value={order.orderStatus}
//                       onChange={(e) =>
//                         updateOrderStatus(order._id, e.target.value)
//                       }
//                       className="w-full border p-3 rounded-lg mt-1"
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Preparing">Preparing</option>
//                       <option value="Ready">Ready</option>
//                       <option value="Completed">Completed</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>

//                   {/* PAYMENT STATUS */}
//                   <div>
//                     <label className="text-sm text-gray-500">
//                       Payment Status
//                     </label>

//                     <select
//                       value={order.paymentStatus}
//                       onChange={(e) =>
//                         updatePaymentStatus(order._id, e.target.value)
//                       }
//                       className="w-full border p-3 rounded-lg mt-1"
//                     >
//                       <option value="UnPaid">UnPaid</option>
//                       <option value="Paid">Paid</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* ITEMS */}
//                 <div className="mt-6">
//                   <h3 className="font-bold mb-3">
//                     Items
//                   </h3>

//                   <div className="space-y-2">
//                     {order.items.map((item) => (
//                       <div
//                         key={item._id}
//                         className="flex justify-between border p-3 rounded-lg"
//                       >
//                         <div>
//                           <p className="font-medium">
//                             {item.name}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             Qty: {item.quantity}
//                           </p>
//                         </div>

//                         <div className="font-bold">
//                           ₹{item.price * item.quantity}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* PAGINATION */}
//             <div className="flex justify-center items-center gap-4 mt-10">

//               <button
//                 disabled={page === 1}
//                 onClick={() => fetchOrders(page - 1)}
//                 className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>

//               <span className="font-medium">
//                 Page {page} of {totalPages}
//               </span>

//               <button
//                 disabled={page === totalPages}
//                 onClick={() => fetchOrders(page + 1)}
//                 className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



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