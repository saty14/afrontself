"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProviderKioskPage() {
  const { sprovid } = useParams();

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  const [provider, setProvider] = useState(null);
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pay_at_counter");
  const [paymentStatus, setPaymentStatus] = useState("UnPaid");
  const [successToken, setSuccessToken] = useState(null);
  const [gstTake, setGstTake] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [sprovname, setSprovname] = useState("");
  const [queOpen, setQueOpen] = useState(false);
  const [queueOrders, setQueueOrders] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);



  const LIMIT = 2;

  // =========================================================
  // FETCH PROVIDER
  // =========================================================

  useEffect(() => {
    async function fetchProvider() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/providers/provider/${sprovid}`
        );

        const data = await res.json();

        if (data.success) {
          setProvider(data.provider);

        }
      } catch (err) {
        console.log(err);
      }
    }

    if (sprovid) {
      fetchProvider();
    }
  }, [sprovid]);

  // =========================================================
  // FETCH CATEGORY + TYPE
  // =========================================================

  useEffect(() => {
    fetch(`${BASE_URL}/api/product-category`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.services || []);
      })
      .catch(console.log);

    fetch(`${BASE_URL}/api/product-type`)
      .then((res) => res.json())
      .then((data) => {
        setTypes(data.productType || []);
      })
      .catch(console.log);

  }, []);

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        let url = `${BASE_URL}/api/product?sprovid=${sprovid}&page=${page}&limit=${LIMIT}`;

        if (selectedCategory) {
          url += `&spcategoryid=${selectedCategory}`;
        }

        if (selectedType) {
          url += `&sptypeid=${selectedType}`;
        }

        if (search) {
          url += `&search=${search}`;
        }

        const res = await fetch(url);

        const data = await res.json();

        if (data.success) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setMsg(data.message);
        }

      } catch (err) {
        setMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (sprovid) {
      fetchProducts();
    }

  }, [
    sprovid,
    selectedCategory,
    selectedType,
    search,
    page,
  ]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  function addToCart(product) {
    const exists = cart.find((c) => c._id === product._id);
    setGstTake(provider?.additionalDetails?.gst?.accept)
    setSprovname(provider?.name);


    if (exists) {
      const updated = cart.map((c) =>
        c._id === product._id
          ? { ...c, quantity: c.quantity + 1 }
          : c
      );

      setCart(updated);

    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  }

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  function updateQuantity(id, type) {
    const updated = cart
      .map((item) => {

        if (item._id === id) {

          const qty =
            type === "inc"
              ? item.quantity + 1
              : item.quantity - 1;

          return {
            ...item,
            quantity: qty,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updated);
  }

  // =========================================================
  // TOTAL
  // =========================================================

  // const totalAmount = cart.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );
  // const totalAmount = cart.reduce(
  //   (acc, item) => acc + item.price * item.quantity + (acc + item.price * item.quantity * (provider?.additionalDetails?.gst.percent) / 100),
  //   0
  // );

  const gstPercent =
    provider?.additionalDetails?.gst?.percent || 0;

  const totalAmount = cart.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity +
      (item.price * item.quantity * gstPercent) / 100,
    0
  );
  // =========================================================
  // PLACE ORDER
  // =========================================================

  // async function placeOrder() {
  //   try {

  //     if (cart.length === 0) {
  //       return alert("Cart is empty");
  //     }

  //     const payload = {
  //       sprovid,

  //       products: cart.map((item) => ({
  //         productId: item._id,
  //         quantity: item.quantity,
  //         price: item.price,
  //       })),

  //       totalAmount,
  //     };

  //     console.log("payload", payload)

  //     const res = await fetch(
  //       `${BASE_URL}/api/order/create`,
  //       {
  //         method: "POST",

  //         headers: {
  //           "Content-Type": "application/json",
  //         },

  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const data = await res.json();

  //     if (data.success) {
  //       alert("Order placed successfully");
  //       setCart([]);
  //     } else {
  //       alert(data.message);
  //     }

  //   } catch (err) {
  //     console.log(err);
  //     alert("Order failed");
  //   }
  // }
  async function placeOrder() {
    try {

      if (cart.length === 0) {
        return alert("Cart is empty");
      }

      // MOBILE VALIDATION
      if (!customerMobile) {
        return alert("Customer mobile number required");
      }

      // SIMPLE INDIA MOBILE VALIDATION
      if (!/^[6-9]\d{9}$/.test(customerMobile)) {
        return alert("Enter valid mobile number");
      }

      const payload = {
        sprovid,
        sprovname,

        customerMobile,
        paymentMethod,

        items: cart.map((item) => ({
          productId: item._id,
          sproductid: item.sproductid,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),

        totalAmount,
        paymentStatus
      };
      // console.log("payload", payload)

      async function CreateOrder() {

        const res = await fetch(
          `${BASE_URL}/api/order/create`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();
        console.log("odrder data", data)

        if (data.success) {

          // alert("Order placed successfully");
          // alert(
          //   `Order placed successfully\nToken Number: ${data.order.tokenNumber}`
          // );

          // RESET
          setCart([]);
          setCustomerMobile("");
          setSuccessToken(data.order.tokenNumber);

        } else {
          alert(data.message);
        }
      }

      // ==================================================
      // PAY AT COUNTER
      // ==================================================

      if (paymentMethod === "pay_at_counter") {
        console.log("payload", payload)
        // alert(paymentMethod)
        CreateOrder();
        return;

      }

      // // ==================================================
      // // ONLINE PAYMENT
      // // ==================================================

      if (paymentMethod === "online") {
        console.log("payload", payload)
        alert(paymentMethod)
        return;

      }



    } catch (err) {
      console.log(err);
      alert("Order failed");
    }
  }

  async function fetchQueueOrders() {
    try {

      setQueueLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/order/queue/${sprovid}`
      );

      const data = await res.json();

      if (data.success) {
        setQueueOrders(data.orders || []);
      }

    } catch (err) {
      console.log(err);

    } finally {
      setQueueLoading(false);
    }
  }


  const allowedCategories =
    provider?.additionalDetails?.productCategory || [];
  const allowedTypes =
    provider?.additionalDetails?.productType || [];


  // =========================================================
  // UI
  // =========================================================

  // console.log("provider",provider)
  // if(provider?.status !="active"){
  //   return(
  //     <>
  //     <div>
  //       <h1>This provider is not active</h1>
  //     </div>
  //     </>
  //   )
  // }

  // return (
  //   <div className="min-h-screen bg-gray-100">

  //     {/* HEADER */}

  //     <div className="bg-white shadow sticky top-0 z-30">
  //       <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">

  //         <div>
  //           <h1 className="text-2xl font-bold">
  //             {provider?.name || "Provider"}
  //           </h1>

  //           <p className="text-gray-500 text-sm">
  //             Self Ordering Kiosk
  //           </p>
  //         </div>

  //         <div className="bg-blue-600 text-white px-4 py-2 rounded-full">
  //           Cart ({cart.length})
  //         </div>
  //       </div>
  //     </div>

  //     {/* BODY */}

  //     <div className="max-w-7xl mx-auto p-4 grid md:grid-cols-4 gap-4">

  //       {/* LEFT SIDE */}

  //       <div className="md:col-span-3">

  //         {/* FILTERS */}

  //         <div className="bg-white p-4 rounded-xl shadow mb-4 space-y-4">

  //           {/* SEARCH */}

  //           <input
  //             type="text"
  //             placeholder="Search products..."
  //             className="w-full border p-3 rounded"
  //             value={search}
  //             onChange={(e) => {
  //               setSearch(e.target.value);
  //               setPage(1);
  //             }}
  //           />

  //           {/* DROPDOWNS */}

  //           <div className="grid md:grid-cols-2 gap-4">

  //             {/* CATEGORY */}

  //             <select
  //               className="border p-3 rounded"
  //               value={selectedCategory}
  //               onChange={(e) => {
  //                 setSelectedCategory(e.target.value);
  //                 setPage(1);
  //               }}
  //             >
  //               <option value="">
  //                 All Categories
  //               </option>

  //               {/* {categories.map((c) => (
  //                 <option
  //                   key={c._id}
  //                   value={c.spcategoryid}
  //                 >
  //                   {c.name}
  //                 </option>
  //               ))}*/}


  //               {categories
  //                 .filter(
  //                   (c) =>
  //                     allowedCategories.length === 0 ||
  //                     allowedCategories.includes(c.name)
  //                 )
  //                 .map((c) => (
  //                   <option key={c._id} value={c.spcategoryid}>
  //                     {c.name}
  //                   </option>
  //                 ))}


  //             </select>

  //             {/* TYPE */}

  //             <select
  //               className="border p-3 rounded"
  //               value={selectedType}
  //               onChange={(e) => {
  //                 setSelectedType(e.target.value);
  //                 setPage(1);
  //               }}
  //             >
  //               <option value="">
  //                 All Types
  //               </option>

  //               {/* {types.map((t) => (
  //                 <option
  //                   key={t._id}
  //                   value={t.sptypeid}
  //                 >
  //                   {t.name}
  //                 </option>
  //               ))} */}
  //               {types
  //                 .filter(
  //                   (t) =>
  //                     allowedTypes.length === 0 ||
  //                     allowedTypes.includes(t.name)
  //                 )
  //                 .map((t) => (
  //                   <option
  //                     key={t._id}
  //                     value={t.sptypeid}
  //                   >
  //                     {t.name}
  //                   </option>
  //                 ))}
  //             </select>
  //           </div>
  //         </div>

  //         {/* PRODUCTS */}

  //         {loading ? (
  //           <div className="text-center py-20">
  //             Loading products...
  //           </div>

  //         ) : products.length === 0 ? (
  //           <div className="text-center py-20 text-gray-500">
  //             No products found
  //           </div>

  //         ) : (
  //           <>
  //             {/* GRID */}

  //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  //               {products.map((p) => (
  //                 <div
  //                   key={p._id}
  //                   className="bg-white rounded-xl shadow overflow-hidden"
  //                 >
  //                   {/* IMAGE */}

  //                   <img
  //                     src={
  //                       p.image
  //                         ? `${BASE_URL}${p.image}`
  //                         : p?.imagelink
  //                     }
  //                     alt={p.name}
  //                     className="w-full h-52 object-cover"
  //                   />

  //                   {/* CONTENT */}

  //                   <div className="p-4">

  //                     <h2 className="font-bold text-lg">
  //                       {p.name}
  //                     </h2>

  //                     <p className="text-sm text-gray-500 line-clamp-2">
  //                       {p.description}
  //                     </p>

  //                     <div className="mt-2 text-xs text-gray-400">
  //                       <p>{p.spcategoryname}</p>
  //                       <p>{p.sptypename}</p>
  //                     </div>

  //                     <div className="flex justify-between items-center mt-4">

  //                       <p className="font-bold text-xl">
  //                         ₹{p.price}
  //                       </p>

  //                       <button
  //                         onClick={() => addToCart(p)}
  //                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  //                       >
  //                         Add
  //                       </button>
  //                     </div>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>

  //             {/* PAGINATION */}

  //             <div className="flex justify-center items-center gap-3 mt-8">

  //               <button
  //                 disabled={page === 1}
  //                 onClick={() => setPage(page - 1)}
  //                 className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
  //               >
  //                 Prev
  //               </button>

  //               <div className="font-semibold">
  //                 Page {page} / {totalPages}
  //               </div>

  //               <button
  //                 disabled={page === totalPages}
  //                 onClick={() => setPage(page + 1)}
  //                 className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
  //               >
  //                 Next
  //               </button>
  //             </div>
  //           </>
  //         )}
  //       </div>

  //       {/* CART */}

  //       <div className="bg-white rounded-xl shadow p-4 h-fit sticky top-24">

  //         <h2 className="text-xl font-bold mb-4">
  //           Order Cart
  //         </h2>

  //         {cart.length === 0 ? (
  //           <p className="text-gray-500">
  //             No items added
  //           </p>

  //         ) : (
  //           <>
  //             <div className="space-y-3 max-h-[500px] overflow-y-auto">

  //               {cart.map((item) => (
  //                 <div
  //                   key={item._id}
  //                   className="border rounded p-3"
  //                 >
  //                   <h3 className="font-semibold">
  //                     {item.name}
  //                   </h3>

  //                   <p className="text-sm text-gray-500">
  //                     ₹{item.price}
  //                   </p>

  //                   <div className="flex items-center justify-between mt-3">

  //                     <div className="flex items-center gap-2">

  //                       <button
  //                         onClick={() =>
  //                           updateQuantity(item._id, "dec")
  //                         }
  //                         className="bg-red-500 text-white w-8 h-8 rounded"
  //                       >
  //                         -
  //                       </button>

  //                       <span className="font-bold">
  //                         {item.quantity}
  //                       </span>

  //                       <button
  //                         onClick={() =>
  //                           updateQuantity(item._id, "inc")
  //                         }
  //                         className="bg-green-500 text-white w-8 h-8 rounded"
  //                       >
  //                         +
  //                       </button>
  //                     </div>

  //                     <div className="font-bold">
  //                       ₹
  //                       {item.price * item.quantity}
  //                     </div>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>

  //             {/* TOTAL */}

  //             <div className="mt-4 border-t pt-4">

  //               {/* CUSTOMER MOBILE */}

  //               <div className="mb-4">

  //                 <label className="block text-sm font-medium mb-2">
  //                   Customer Mobile Number
  //                 </label>

  //                 <input
  //                   type="tel"
  //                   placeholder="Enter mobile number"
  //                   value={customerMobile}
  //                   onChange={(e) =>
  //                     setCustomerMobile(e.target.value)
  //                   }
  //                   className="w-full border p-3 rounded-lg"
  //                   required
  //                   maxLength={10}
  //                 />
  //               </div>

  //               {/* TOTAL */}
  //               <p>{gstTake ? (<>GST added :  {provider?.additionalDetails?.gst.percent}% </>) : (null)}</p>

  //               <div className="flex justify-between text-lg font-bold">
  //                 <span>Total</span>
  //                 <span>₹{totalAmount}</span>
  //               </div>

  //               {/* PAYMENT METHOD */}

  //               <div className="mb-4">

  //                 <label className="block text-sm font-medium mb-2">
  //                   Payment Method
  //                 </label>

  //                 <div className="space-y-2">

  //                   {/* PAY AT COUNTER */}

  //                   <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer">

  //                     <input
  //                       type="radio"
  //                       name="paymentMethod"
  //                       value="pay_at_counter"
  //                       checked={
  //                         paymentMethod === "pay_at_counter"
  //                       }
  //                       onChange={(e) =>
  //                         setPaymentMethod(e.target.value)
  //                       }
  //                     />

  //                     <span>Pay At Counter</span>
  //                   </label>

  //                   {/* ONLINE */}

  //                   <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer">

  //                     <input
  //                       type="radio"
  //                       name="paymentMethod"
  //                       value="online"
  //                       checked={paymentMethod === "online"}
  //                       onChange={(e) =>
  //                         setPaymentMethod(e.target.value)
  //                       }
  //                     />

  //                     <span>Pay Online</span>
  //                   </label>
  //                 </div>
  //               </div>

  //               {/* BUTTON */}

  //               <button
  //                 onClick={placeOrder}
  //                 className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
  //               >
  //                 Place Order
  //               </button>
  //             </div>
  //           </>
  //         )}
  //       </div>
  //     </div>


  //     {successToken && (
  //       <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

  //         <div className="bg-white p-10 rounded-2xl text-center">

  //           <h2 className="text-2xl font-bold mb-4">
  //             Order Placed
  //           </h2>

  //           <p className="text-gray-500 mb-2">
  //             Your Token Number
  //           </p>

  //           <div className="text-6xl font-bold text-blue-600">
  //             #{successToken}
  //           </div>

  //           <button
  //             onClick={() => setSuccessToken(null)}
  //             className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
  //           >
  //             Close
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {provider?.name || "Provider"}
            </h1>

            <p className="text-xs md:text-sm text-gray-500">
              Self Ordering Kiosk
            </p>
          </div>
          <div>

            <div onClick={() => setCartOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm md:text-base font-semibold shadow inline">
              🛒 {cart.length}
            </div>
            <div
              // onClick={() => setQueOpen(true)}
              onClick={() => {
                setQueOpen(true);
                fetchQueueOrders();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm md:text-base font-semibold shadow inline mx-2">
              Queue
            </div>
          </div>

          {/* <div className="fixed bottom-4 right-4 xl:hidden z-40">
            <button
              onClick={() => setCartOpen(true)}
              className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg font-bold"
            >
              🛒 Cart ({cart.length})
            </button>
          </div> */}
        </div>
      </header>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto p-3 md:p-4 grid grid-cols-1 xl:grid-cols-4 gap-4">

        {/* LEFT SIDE */}

        <div className="xl:col-span-3">

          {/* FILTERS */}

          <div className="bg-white rounded-2xl shadow-sm border p-4 mb-4 space-y-4">

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-xl text-sm md:text-base"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            {/* FILTERS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {/* CATEGORY */}

              <select
                className="border border-gray-200 p-3 rounded-xl bg-white text-sm md:text-base"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Categories</option>

                {categories
                  .filter(
                    (c) =>
                      allowedCategories.length === 0 ||
                      allowedCategories.includes(c.name)
                  )
                  .map((c) => (
                    <option key={c._id} value={c.spcategoryid}>
                      {c.name}
                    </option>
                  ))}
              </select>

              {/* TYPE */}

              <select
                className="border border-gray-200 p-3 rounded-xl bg-white text-sm md:text-base"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Types</option>

                {types
                  .filter(
                    (t) =>
                      allowedTypes.length === 0 ||
                      allowedTypes.includes(t.name)
                  )
                  .map((t) => (
                    <option key={t._id} value={t.sptypeid}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* PRODUCTS */}

          {loading ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-sm">
              No products found
            </div>
          ) : (
            <>
              {/* PRODUCT GRID */}

              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">

                {products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition-all duration-200"
                  >

                    {/* IMAGE */}

                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={
                          p.image
                            ? `${BASE_URL}${p.image}`
                            : p?.imagelink
                        }
                        alt={p.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* CONTENT */}

                    <div className="p-3 md:p-4">

                      <h2 className="font-semibold text-sm md:text-lg line-clamp-1">
                        {p.name}
                      </h2>

                      <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mt-1">
                        {p.description}
                      </p>

                      <div className="mt-2 text-[11px] md:text-xs text-gray-400">
                        <p>{p.spcategoryname}</p>
                        <p>{p.sptypename}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4 gap-2">

                        <p className="font-bold text-base md:text-xl text-gray-900">
                          ₹{p.price}
                        </p>

                        <button
                          onClick={() => addToCart(p)}
                          className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white px-3 md:px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}

              <div className="flex justify-center items-center gap-3 mt-8">

                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 rounded-xl bg-white border shadow-sm disabled:opacity-50"
                >
                  Prev
                </button>

                <div className="font-semibold text-sm md:text-base">
                  {page} / {totalPages}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 rounded-xl bg-white border shadow-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* CART */}

        <div className="xl:sticky xl:top-24 h-fit">

          <div className="bg-white rounded-2xl shadow-sm border p-4">

            <h2 className="text-lg md:text-xl font-bold mb-4">
              Order Cart
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No items added
              </div>
            ) : (
              <>
                {/* CART ITEMS */}

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">

                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="border rounded-2xl p-3"
                    >

                      <div className="flex justify-between gap-2">

                        <div>
                          <h3 className="font-semibold text-sm md:text-base">
                            {item.name}
                          </h3>

                          <p className="text-xs md:text-sm text-gray-500">
                            ₹{item.price}
                          </p>
                        </div>

                        <div className="font-bold text-sm md:text-base">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>

                      {/* QUANTITY */}

                      <div className="flex items-center justify-center gap-3 mt-4">

                        <button
                          onClick={() =>
                            updateQuantity(item._id, "dec")
                          }
                          className="w-10 h-10 rounded-xl bg-red-500 text-white text-lg font-bold active:scale-95"
                        >
                          −
                        </button>

                        <span className="font-bold text-lg w-8 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item._id, "inc")
                          }
                          className="w-10 h-10 rounded-xl bg-green-500 text-white text-lg font-bold active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FORM */}

                <div className="border-t mt-4 pt-4 space-y-4">

                  {/* MOBILE */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mobile Number
                    </label>

                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={customerMobile}
                      onChange={(e) =>
                        setCustomerMobile(e.target.value)
                      }
                      className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-xl"
                      maxLength={10}
                    />
                  </div>

                  {/* GST */}

                  {gstTake && (
                    <div className="text-sm text-gray-500">
                      GST Added:{" "}
                      <span className="font-semibold">
                        {provider?.additionalDetails?.gst.percent}%
                      </span>
                    </div>
                  )}

                  {/* TOTAL */}

                  <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">

                    <span className="text-lg font-semibold">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-green-600">
                      ₹{totalAmount}
                    </span>
                  </div>

                  {/* PAYMENT */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment Method
                    </label>

                    <div className="grid grid-cols-1 gap-3">

                      <label className="border rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500">

                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay_at_counter"
                          checked={
                            paymentMethod === "pay_at_counter"
                          }
                          onChange={(e) =>
                            setPaymentMethod(e.target.value)
                          }
                        />

                        <span className="font-medium">
                          Pay At Counter
                        </span>
                      </label>

                      <label className="border rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500">

                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === "online"}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value)
                          }
                        />

                        <span className="font-medium">
                          Pay Online
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* BUTTON */}

                  <button
                    onClick={placeOrder}
                    className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] transition text-white py-4 rounded-2xl text-lg font-bold shadow"
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {cartOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end xl:items-center">

            <div className="bg-white w-full xl:max-w-md xl:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto p-4">

              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">
                  Order Cart
                </h2>

                <button
                  onClick={() => setCartOpen(false)}
                  className="text-gray-500 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* ===== YOUR ORIGINAL CART CONTENT START ===== */}

              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No items added
                </div>
              ) : (
                <>
                  {/* CART ITEMS */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">

                    {cart.map((item) => (
                      <div key={item._id} className="border rounded-2xl p-3">

                        <div className="flex justify-between gap-2">

                          <div>
                            <h3 className="font-semibold text-sm md:text-base">
                              {item.name}
                            </h3>

                            <p className="text-xs text-gray-500">
                              ₹{item.price}
                            </p>
                          </div>

                          <div className="font-bold">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>

                        {/* QUANTITY */}
                        <div className="flex items-center justify-center gap-3 mt-3">

                          <button
                            onClick={() => updateQuantity(item._id, "dec")}
                            className="w-10 h-10 rounded-xl bg-red-500 text-white font-bold"
                          >
                            −
                          </button>

                          <span className="font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item._id, "inc")}
                            className="w-10 h-10 rounded-xl bg-green-500 text-white font-bold"
                          >
                            +
                          </button>

                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FORM */}
                  <div className="border-t mt-4 pt-4 space-y-4">

                    {/* MOBILE */}
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value)}
                      className="w-full border p-3 rounded-xl"
                      maxLength={10}
                    />

                    {/* GST */}
                    {gstTake && (
                      <div className="text-sm text-gray-500">
                        GST Added: {provider?.additionalDetails?.gst.percent}%
                      </div>
                    )}

                    {/* TOTAL */}
                    <div className="flex justify-between bg-gray-50 p-3 rounded-xl font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        ₹{totalAmount}
                      </span>
                    </div>

                    {/* PAYMENT */}
                    <div className="space-y-2">

                      <label className="flex gap-2 items-center border p-3 rounded-xl">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay_at_counter"
                          checked={paymentMethod === "pay_at_counter"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Pay At Counter
                      </label>

                      <label className="flex gap-2 items-center border p-3 rounded-xl">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === "online"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Pay Online
                      </label>

                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={() => {
                        placeOrder();
                        setCartOpen(false);
                      }}
                      className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold"
                    >
                      Place Order
                    </button>

                  </div>

                  {/* ===== YOUR ORIGINAL CART CONTENT END ===== */}
                </>
              )}

            </div>
          </div>
        )}

        {queOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end xl:items-center">

            <div className="bg-white w-full xl:max-w-md xl:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto p-4">

              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">
                  Orders in Queue
                </h2>

                <button
                  onClick={() => setQueOpen(false)}
                  className="text-gray-500 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* ===== YOUR ORIGINAL Orders in Queue CONTENT START ===== */}

              {queueLoading ? (

                <div className="text-center py-10">
                  Loading queue...
                </div>

              ) : queueOrders.length === 0 ? (

                <div className="text-center py-10 text-gray-500">
                  No active orders
                </div>

              ) : (

                <div className="space-y-3">

                  {queueOrders.map((order, index) => (

                    <div
                      key={order._id}
                      className="border rounded-2xl p-4"
                    >

                      {/* TOP */}

                      <div className="flex justify-between items-center">

                        <div>

                          <p className="text-xs text-gray-500">
                            Token
                          </p>

                          <h2 className="text-3xl font-black text-blue-600">
                            #{order.tokenNumber}
                          </h2>
                        </div>

                        <div className="text-right">

                          <span
                            className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${order.orderStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : ""}
                ${order.orderStatus === "Accepted"
                                ? "bg-blue-100 text-blue-700"
                                : ""}
                ${order.orderStatus === "Preparing"
                                ? "bg-orange-100 text-orange-700"
                                : ""}
                ${order.orderStatus === "Ready"
                                ? "bg-green-100 text-green-700"
                                : ""}
              `}
                          >
                            {order.orderStatus}
                          </span>

                          <p className="text-xs text-gray-400 mt-2">
                            Queue #{queueOrders.length - index}
                          </p>
                        </div>
                      </div>

                      {/* ITEMS */}

                      {/* <div className="mt-3 space-y-1">

                        {order.items?.slice(0, 3).map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>

                            <span>
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}

                        {order.items?.length > 3 && (
                          <p className="text-xs text-gray-400">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div> */}
                      <div className="mt-3 space-y-1">

                        {order.items?.slice(0, 10).map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>

                            {/* <span>
                              ₹{item.price * item.quantity}
                            </span> */}
                          </div>
                        ))}

                        {/* {order.items?.length > 3 && (
                          <p className="text-xs text-gray-400">
                            +{order.items.length - 3} more items
                          </p>
                        )} */}
                      </div>

                      {/* FOOTER */}

                      <div className="mt-3 pt-3 border-t flex justify-between items-center">

                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>

                        {/* <div className="font-bold text-green-600">
                          ₹{order.totalAmount}
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}



            </div>
          </div>
        )}



      </div>

      {/* SUCCESS MODAL */}

      {successToken && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">

          <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl">

            <div className="text-5xl mb-4">🎉</div>

            <h2 className="text-2xl font-bold mb-2">
              Order Placed
            </h2>

            <p className="text-gray-500 mb-6">
              Your Token Number
            </p>

            <div className="text-6xl font-black text-blue-600">
              #{successToken}
            </div>

            <button
              onClick={() => setSuccessToken(null)}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================================================
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "next/navigation";

// export default function ProviderKioskPage() {
//   const { sprovid } = useParams();

//   const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

//   const [provider, setProvider] = useState(null);
//   const [products, setProducts] = useState([]);

//   const [categories, setCategories] = useState([]);
//   const [types, setTypes] = useState([]);

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedType, setSelectedType] = useState("");

//   const [cart, setCart] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState(null);

//   // FETCH PROVIDER
//   useEffect(() => {
//     async function fetchProvider() {
//       try {
//         const res = await fetch(
//           `${BASE_URL}/api/providers/provider/${sprovid}`
//         );

//         const data = await res.json();

//         if (data.success) {
//           setProvider(data.provider);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }

//     if (sprovid) {
//       fetchProvider();
//     }
//   }, [sprovid]);

//   // FETCH PRODUCTS
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `${BASE_URL}/api/product/provider-products?spprovid=${sprovid}`
//         );

//         const data = await res.json();

//         if (data.success) {
//           setProducts(data.products || []);
//         } else {
//           setMsg(data.message);
//         }
//       } catch (err) {
//         setMsg(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (sprovid) {
//       fetchProducts();
//     }
//   }, [sprovid]);

//   // FETCH CATEGORY
//   useEffect(() => {
//     fetch(`${BASE_URL}/api/product-category`)
//       .then((res) => res.json())
//       .then((data) => {
//         setCategories(data.services || []);
//       })
//       .catch(console.log);

//     fetch(`${BASE_URL}/api/product-type`)
//       .then((res) => res.json())
//       .then((data) => {
//         setTypes(data.productType || []);
//       })
//       .catch(console.log);
//   }, []);

//   // FILTER PRODUCTS
//   const filteredProducts = useMemo(() => {
//     return products.filter((p) => {
//       const categoryMatch = selectedCategory
//         ? p.spcategoryid === selectedCategory
//         : true;

//       const typeMatch = selectedType
//         ? p.sptypeid === selectedType
//         : true;

//       return categoryMatch && typeMatch;
//     });
//   }, [products, selectedCategory, selectedType]);

//   // ADD TO CART
//   function addToCart(product) {
//     const exists = cart.find((c) => c._id === product._id);

//     if (exists) {
//       const updated = cart.map((c) =>
//         c._id === product._id
//           ? { ...c, quantity: c.quantity + 1 }
//           : c
//       );

//       setCart(updated);
//     } else {
//       setCart([
//         ...cart,
//         {
//           ...product,
//           quantity: 1,
//         },
//       ]);
//     }
//   }

//   // UPDATE QUANTITY
//   function updateQuantity(id, type) {
//     const updated = cart
//       .map((item) => {
//         if (item._id === id) {
//           const qty =
//             type === "inc"
//               ? item.quantity + 1
//               : item.quantity - 1;

//           return {
//             ...item,
//             quantity: qty,
//           };
//         }

//         return item;
//       })
//       .filter((item) => item.quantity > 0);

//     setCart(updated);
//   }

//   // TOTAL
//   const totalAmount = cart.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   // PLACE ORDER
//   async function placeOrder() {
//     try {
//       const payload = {
//         sprovid,
//         products: cart.map((item) => ({
//           productId: item._id,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//         totalAmount,
//       };

//       const res = await fetch(
//         `${BASE_URL}/api/order/create`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         alert("Order placed successfully");
//         setCart([]);
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.log(err);
//       alert("Order failed");
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">

//       {/* HEADER */}
//       <div className="bg-white shadow sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">

//           <div>
//             <h1 className="text-2xl font-bold">
//               {provider?.name || "Provider"}
//             </h1>

//             <p className="text-gray-500 text-sm">
//               Self Ordering Kiosk
//             </p>
//           </div>

//           {/* CART COUNT */}
//           <div className="bg-blue-600 text-white px-4 py-2 rounded-full">
//             Cart ({cart.length})
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-4 grid md:grid-cols-4 gap-4">

//         {/* LEFT SIDE */}
//         <div className="md:col-span-3">

//           {/* FILTERS */}
//           <div className="bg-white p-4 rounded-xl shadow mb-4 grid md:grid-cols-2 gap-4">

//             <select
//               className="border p-2 rounded"
//               value={selectedCategory}
//               onChange={(e) =>
//                 setSelectedCategory(e.target.value)
//               }
//             >
//               <option value="">All Categories</option>

//               {categories.map((c) => (
//                 <option
//                   key={c._id}
//                   value={c.spcategoryid}
//                 >
//                   {c.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="border p-2 rounded"
//               value={selectedType}
//               onChange={(e) =>
//                 setSelectedType(e.target.value)
//               }
//             >
//               <option value="">All Types</option>

//               {types.map((t) => (
//                 <option
//                   key={t._id}
//                   value={t.sptypeid}
//                 >
//                   {t.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* PRODUCTS */}
//           {loading ? (
//             <div className="text-center py-10">
//               Loading products...
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//               {filteredProducts.map((p) => (
//                 <div
//                   key={p._id}
//                   className="bg-white rounded-xl shadow overflow-hidden"
//                 >
//                   <img
//                     src={
//                       p.image
//                         ? `${BASE_URL}${p.image}`
//                         : "/no-image.png"
//                     }
//                     alt={p.name}
//                     className="w-full h-48 object-cover"
//                   />

//                   <div className="p-4">
//                     <h2 className="font-bold text-lg">
//                       {p.name}
//                     </h2>

//                     <p className="text-sm text-gray-500">
//                       {p.description}
//                     </p>

//                     <div className="flex justify-between items-center mt-3">
//                       <p className="font-bold text-xl">
//                         ₹{p.price}
//                       </p>

//                       <button
//                         onClick={() => addToCart(p)}
//                         className="bg-blue-600 text-white px-4 py-2 rounded"
//                       >
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* CART */}
//         <div className="bg-white rounded-xl shadow p-4 h-fit sticky top-24">

//           <h2 className="text-xl font-bold mb-4">
//             Order Cart
//           </h2>

//           {cart.length === 0 ? (
//             <p className="text-gray-500">
//               No items added
//             </p>
//           ) : (
//             <>
//               <div className="space-y-3">

//                 {cart.map((item) => (
//                   <div
//                     key={item._id}
//                     className="border rounded p-2"
//                   >
//                     <h3 className="font-semibold">
//                       {item.name}
//                     </h3>

//                     <p className="text-sm text-gray-500">
//                       ₹{item.price}
//                     </p>

//                     <div className="flex items-center gap-2 mt-2">

//                       <button
//                         onClick={() =>
//                           updateQuantity(item._id, "dec")
//                         }
//                         className="bg-red-500 text-white w-8 h-8 rounded"
//                       >
//                         -
//                       </button>

//                       <span>{item.quantity}</span>

//                       <button
//                         onClick={() =>
//                           updateQuantity(item._id, "inc")
//                         }
//                         className="bg-green-500 text-white w-8 h-8 rounded"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* TOTAL */}
//               <div className="mt-4 border-t pt-4">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span>₹{totalAmount}</span>
//                 </div>

//                 <button
//                   onClick={placeOrder}
//                   className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
//                 >
//                   Place Order
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ==================================================================

// // "use client";

// // import { useEffect, useState } from "react";
// // import { useParams } from "next/navigation";

// // export default function ProviderDetails({ params }) {
// //   // const { sprovid } = params;
// //    const { sprovid } = useParams();

// //   const [provider, setProvider] = useState(null);
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [msg, setMsg] = useState("");

// //   const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

// //   // FETCH PROVIDER
// //   useEffect(() => {
// //     async function fetchProvider() {
// //       try {
// //         const res = await fetch(
// //           `${BASE_URL}/api/providers/provider/${sprovid}`
// //         );
// //         const data = await res.json();

// //         if (data.success) {
// //           setProvider(data.provider);
// //         } else {
// //           setMsg(data.message);
// //         }
// //       } catch (err) {
// //         setMsg(err.message);
// //       }
// //     }

// //     fetchProvider();
// //   }, [sprovid]);

// //   // FETCH PRODUCTS
// //   useEffect(() => {
// //     if (!sprovid) return;

// //     async function fetchProducts() {
// //       try {
// //         setLoading(true);

// //         const res = await fetch(
// //           `${BASE_URL}/api/product/provider-products?spprovid=${sprovid}`
// //         );

// //         const data = await res.json();

// //         if (data.success) {
// //           setProducts(data.products || []);
// //         } else {
// //           setMsg(data.message);
// //         }
// //       } catch (err) {
// //         setMsg(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchProducts();
// //   }, [sprovid]);

// //   if (!provider) {
// //     return (
// //       <div className="p-6 text-center text-gray-500">
// //         Loading provider details...
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-6">
// //       <div className="max-w-6xl mx-auto space-y-6">

// //         {/* PROVIDER CARD */}
// //         <div className="bg-white rounded-2xl shadow p-6">
// //           <h1 className="text-2xl font-bold mb-4">
// //             Provider Details
// //           </h1>

// //           <div className="grid md:grid-cols-2 gap-3 text-gray-700">
// //             <p><b>Name:</b> {provider.name}</p>
// //             <p><b>Email:</b> {provider.email}</p>
// //             <p><b>Mobile:</b> {provider.mobile}</p>
// //             <p><b>Provider ID:</b> {provider.sprovid}</p>
// //             <p>
// //               <b>Email Verified:</b>{" "}
// //               {provider.emailVerify ? "Yes" : "No"}
// //             </p>
// //           </div>
// //         </div>

// //         {/* ERROR MESSAGE */}
// //         {msg && (
// //           <p className="bg-red-100 text-red-600 p-2 rounded text-center">
// //             {msg}
// //           </p>
// //         )}

// //         {/* PRODUCTS SECTION */}
// //         <div>
// //           <h2 className="text-xl font-bold mb-4">
// //             My Products ({products.length})
// //           </h2>

// //           {loading ? (
// //             <p className="text-center text-gray-500">
// //               Loading products...
// //             </p>
// //           ) : products.length === 0 ? (
// //             <p className="text-center text-gray-500">
// //               No products found
// //             </p>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               {products.map((p) => (
// //                 <div
// //                   key={p._id}
// //                   className="bg-white shadow rounded-xl p-4"
// //                 >
// //                   <img
// //                     src={
// //                       p.image
// //                         ? `${BASE_URL}${p.image}`
// //                         : "/no-image.png"
// //                     }
// //                     alt={p.name}
// //                     className="w-full h-40 object-cover rounded"
// //                   />

// //                   <h2 className="text-lg font-semibold mt-2">
// //                     {p.name}
// //                   </h2>

// //                   <p className="text-sm text-gray-600">
// //                     {p.description}
// //                   </p>

// //                   <p className="font-bold mt-1">
// //                     ₹{p.price}
// //                   </p>

// //                   <div className="text-xs text-gray-500 mt-2">
// //                     <p>Category: {p.spcategoryname}</p>
// //                     <p>Type: {p.sptypename}</p>
// //                   </div>

// //                   <p
// //                     className={`mt-2 text-sm font-medium ${
// //                       p.isAvailable
// //                         ? "text-green-600"
// //                         : "text-red-600"
// //                     }`}
// //                   >
// //                     {p.isAvailable
// //                       ? "Available"
// //                       : "Not Available"}
// //                   </p>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }