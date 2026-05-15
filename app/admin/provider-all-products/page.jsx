"use client";

import { useEffect, useState } from "react";

export default function ProviderProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [providerId, setProviderId] = useState(null);

  // GET PROVIDER ID FROM COOKIE
  useEffect(() => {
    async function fetchCookies() {
      const res = await fetch("/api/cookies", { cache: "no-store" });
      const data = await res.json();
      setProviderId(data.id);
      console.log(data.id)
    }
    fetchCookies();
  }, []);

  // FETCH PRODUCTS
  useEffect(() => {
    if (!providerId) return;

    async function fetchProducts() {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product/provider-products?spprovid=${providerId}`
        );

        const data = await res.json();

        if (data.success) {
          setProducts(data.products || []);
        } else {
          setMsg(data.message);
        }
      } catch (err) {
        setMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [providerId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-center">
          My Products
        </h1>

        {msg && (
          <p className="bg-red-200 p-2 text-center rounded mb-4">
            {msg}
          </p>
        )}

        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">
            No products found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {products.map((p) => (
              <div
                // key={p._id}
                className="bg-white shadow rounded-lg p-4"
              >

                {/* IMAGE */}
                <img
                  src={
                    p.image
                      ? `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}${p.image}`
                      : p.imagelink
                  }
                  alt={p.name}
                  className="w-full h-40 object-cover rounded"
                />

                {/* INFO */}
                <h2 className="text-lg font-semibold mt-2">
                  {p.name}
                </h2>

                <p className="text-sm text-gray-600">
                  {p.description}
                </p>

                <p className="font-bold mt-1">
                  ₹{p.price}
                </p>

                {/* CATEGORY + TYPE */}
                <div className="text-xs text-gray-500 mt-2">
                  <p>Category: {p.spcategoryname}</p>
                  <p>Type: {p.sptypename}</p>
                </div>

                {/* STATUS */}
                <p
                  className={`mt-2 text-sm font-medium ${
                    p.isAvailable
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {p.isAvailable
                    ? "Available"
                    : "Not Available"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}













// ==============================extra =====================================

// "use client";

// import { useEffect, useState } from "react";

// export default function ProviderProductsPage() {
//     const [products, setProducts] = useState([]);
//     const [provider, setProvider] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [msg, setMsg] = useState("");

//     useEffect(() => {
//         async function init() {
//             try {
//                 setLoading(true);

//                 // 1. Get providerId from cookie
//                 const cookieRes = await fetch("/api/cookies", { cache: "no-store" });
//                 const cookieData = await cookieRes.json();

//                 if (!cookieData?.id) {
//                     setMsg("Provider not found");
//                     return;
//                 }

//                 const providerId = cookieData.id;

//                 // 2. Fetch provider profile
//                 const providerRes = await fetch(
//                     `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/provider/${providerId}`
//                 );
//                 const providerData = await providerRes.json();

//                 if (providerData.success) {
//                     setProvider(providerData.provider);
//                 }

//                 // 3. Fetch products
//                 const productRes = await fetch(
//                     `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product/provider-products?spprovid=${providerId}`
//                 );
//                 const productData = await productRes.json();

//                 if (productData.success) {
//                     setProducts(productData.products || []);
//                 } else {
//                     setMsg(productData.message);
//                 }
//             } catch (err) {
//                 setMsg(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         init();
//     }, []);

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             <div className="max-w-6xl mx-auto">

//                 <h1 className="text-2xl font-bold text-center mb-4">
//                     My Products Dashboard
//                 </h1>

//                 {/* PROVIDER INFO */}
//                 {provider && (
//                     <div className="bg-white p-4 rounded shadow mb-6">
//                         <h2 className="text-lg font-semibold">
//                             {provider.name}
//                         </h2>

//                         <p className="text-sm text-gray-600">
//                             Email: {provider.email}
//                         </p>

//                         <p className="text-sm text-gray-600">
//                             Mobile: {provider.mobile}
//                         </p>

//                         {/* GST INFO */}
//                         <p className="text-sm mt-2">
//                             GST:{" "}
//                             {provider.additionalDetails?.gst?.accept
//                                 ? `${provider.additionalDetails.gst.percent}%`
//                                 : "Not Applied"}
//                         </p>

//                         {/* PRODUCT TYPES */}
//                         <div className="mt-2 text-xs text-gray-600">
//                             Types:{" "}
//                             {provider.additionalDetails?.productType?.join(", ")}
//                         </div>

//                         {/* CATEGORY */}
//                         <div className="text-xs text-gray-600">
//                             Categories:{" "}
//                             {provider.additionalDetails?.productCategory?.join(", ")}
//                         </div>
//                     </div>
//                 )}

//                 {/* ERROR */}
//                 {msg && (
//                     <p className="bg-red-200 p-2 text-center rounded mb-4">
//                         {msg}
//                     </p>
//                 )}

//                 {/* LOADING */}
//                 {loading ? (
//                     <p className="text-center">Loading...</p>
//                 ) : products.length === 0 ? (
//                     <p className="text-center text-gray-500">
//                         No products found
//                     </p>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         {products.map((p) => (
//                             <div key={p._id} className="bg-white shadow rounded-lg p-4">

//                                 <img
//                                     src={
//                                         p.image
//                                             ? `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}${p.image}`
//                                             : p.imagelink
//                                     }
//                                     className="w-full h-40 object-cover rounded"
//                                 />

//                                 <h2 className="text-lg font-semibold mt-2">
//                                     {p.name}
//                                 </h2>

//                                 <p className="text-sm text-gray-600">
//                                     {p.description}
//                                 </p>

//                                 <p className="font-bold mt-1">₹{p.price}</p>

//                                 <div className="text-xs text-gray-500 mt-2">
//                                     <p>Category: {p.spcategoryname}</p>
//                                     <p>Type: {p.sptypename}</p>
//                                 </div>

//                                 <p
//                                     className={`mt-2 text-sm font-medium ${p.isAvailable ? "text-green-600" : "text-red-600"
//                                         }`}
//                                 >
//                                     {p.isAvailable ? "Available" : "Not Available"}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

