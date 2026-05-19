"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EditProviderProfile() {
    const { sprovid } = useParams();

    const [loading, setLoading] = useState(false);

    const [providerId, setProviderId] = useState(null);
    const [provider, setProvider] = useState(null);

    // ADD TYPE / CATEGORY
    const [newType, setNewType] = useState("");
    const [newCategory, setNewCategory] = useState("");

    // DROPDOWN DATA
    const [cities, setCities] = useState([]);
    const [localAreas, setLocalAreas] = useState([]);
    const [services, setServices] = useState([]);

    // FORM
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        email: "",
        status: "active",

        cityId: "",
        localAreaId: "",
        serviceIds: [],

        additionalDetails: {
            productType: [],
            productCategory: [],
            gst: {
                accept: false,
                percent: 0,
            },
        },
    });

    // =========================================================
    // FETCH PROVIDER
    // =========================================================
    useEffect(() => {
        async function fetchProvider() {
            try {
                setProviderId(sprovid);

                const providerRes = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/provider/${sprovid}`,
                    {
                        cache: "no-store",
                    }
                );

                const providerData = await providerRes.json();

                if (providerData.success) {
                    setProvider(providerData.provider);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchProvider();
    }, [sprovid]);

    // =========================================================
    // FETCH CITIES + SERVICES
    // =========================================================
    useEffect(() => {
        async function fetchDropdowns() {
            try {
                // CITY
                const cityRes = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city`
                );

                const cityData = await cityRes.json();

                setCities(cityData.citys || []);

                // SERVICES
                const serviceRes = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/services`
                );

                const serviceData = await serviceRes.json();

                setServices(serviceData.services || []);
            } catch (error) {
                console.log(error);
            }
        }

        fetchDropdowns();
    }, []);

    // =========================================================
    // FETCH LOCAL AREAS
    // =========================================================
    useEffect(() => {
        if (!form.cityId) return;

        async function fetchLocalAreas() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/local-aria?cityId=${form.cityId}`
                );

                const data = await res.json();

                setLocalAreas(data.localAreas || []);
            } catch (error) {
                console.log(error);
            }
        }

        fetchLocalAreas();
    }, [form.cityId]);

    // =========================================================
    // SET FORM DATA
    // =========================================================
    useEffect(() => {
        if (!provider) return;

        setForm({
            name: provider.name || "",
            mobile: provider.mobile || "",
            email: provider.email || "",
            status: provider.status || "active",

            cityId: provider.cityId || "",
            localAreaId: provider.localAreaId || "",
            serviceIds: provider.serviceIds || [],

            additionalDetails: {
                productType:
                    provider.additionalDetails?.productType || [],

                productCategory:
                    provider.additionalDetails?.productCategory || [],

                gst: {
                    accept:
                        provider.additionalDetails?.gst?.accept || false,

                    percent:
                        provider.additionalDetails?.gst?.percent || 0,
                },
            },
        });
    }, [provider]);

    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================================================
    // HANDLE SERVICE CHANGE
    // =========================================================
    const handleServiceChange = (e) => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );

        setForm((prev) => ({
            ...prev,
            serviceIds: values,
        }));
    };

    // =========================================================
    // ADD PRODUCT TYPE
    // =========================================================
    const handleAddType = () => {
        if (!newType.trim()) return;

        setForm((prev) => ({
            ...prev,
            additionalDetails: {
                ...prev.additionalDetails,
                productType: [
                    ...prev.additionalDetails.productType,
                    newType,
                ],
            },
        }));

        setNewType("");
    };

    // =========================================================
    // REMOVE PRODUCT TYPE
    // =========================================================
    const handleRemoveType = (item) => {
        setForm((prev) => ({
            ...prev,
            additionalDetails: {
                ...prev.additionalDetails,
                productType:
                    prev.additionalDetails.productType.filter(
                        (t) => t !== item
                    ),
            },
        }));
    };

    // =========================================================
    // ADD CATEGORY
    // =========================================================
    const handleAddCategory = () => {
        if (!newCategory.trim()) return;

        setForm((prev) => ({
            ...prev,
            additionalDetails: {
                ...prev.additionalDetails,
                productCategory: [
                    ...prev.additionalDetails.productCategory,
                    newCategory,
                ],
            },
        }));

        setNewCategory("");
    };

    // =========================================================
    // REMOVE CATEGORY
    // =========================================================
    const handleRemoveCategory = (item) => {
        setForm((prev) => ({
            ...prev,
            additionalDetails: {
                ...prev.additionalDetails,
                productCategory:
                    prev.additionalDetails.productCategory.filter(
                        (c) => c !== item
                    ),
            },
        }));
    };

    // =========================================================
    // SUBMIT
    // =========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/update-profile/${providerId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            setLoading(false);

            if (!res.ok) {
                alert(data.message || "Update failed");
                return;
            }

            alert("Profile updated successfully");
        } catch (error) {
            setLoading(false);
            console.log(error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">

            <h2 className="text-2xl font-bold mb-5">
                Edit Provider Profile
            </h2>

            {/* NAME */}
            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="border p-2 w-full mb-3 rounded"
            />

            {/* EMAIL */}
            <input
                type="email"
                value={form.email}
                disabled
                className="border p-2 w-full mb-3 bg-gray-100 rounded"
            />

            {/* MOBILE */}
            <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                className="border p-2 w-full mb-3 rounded"
            />

            {/* STATUS */}
            <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border p-2 w-full mb-3 rounded"
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>

            {/* CITY */}
            <select
                name="cityId"
                value={form.cityId}
                onChange={handleChange}
                className="border p-2 w-full mb-3 rounded"
            >
                <option value="">Select City</option>

                {cities.map((city) => (
                    <option
                        key={city._id}
                        value={city.sctyid} 
                    >
                        {city.name}
                    </option>
                ))}
            </select>

            {/* LOCAL AREA */}
            <select
                name="localAreaId"
                value={form.localAreaId}
                onChange={handleChange}
                className="border p-2 w-full mb-3 rounded"
            >
                <option value="">Select Local Area</option>

                {localAreas.map((area) => (
                    <option
                        key={area._id}
                        value={area.sloctyid}
                    >
                        {area.name}
                    </option>
                ))}
            </select>

            {/* SERVICES */}
            <div className="mb-4">
                <label className="font-semibold block mb-2">
                    Select Services
                </label>

                <select
                    multiple
                    value={form.serviceIds}
                    onChange={handleServiceChange}
                    className="border p-2 w-full h-40 rounded"
                >
                    {services.map((service) => (
                        <option
                            key={service._id}
                            value={service.ssrvcid}
                        >
                            {service.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* GST */}
            <div className="mb-5 border p-4 rounded">

                <h3 className="font-semibold mb-3">
                    GST Details
                </h3>

                <label className="flex items-center gap-2 mb-3">
                    <input
                        type="checkbox"
                        checked={form.additionalDetails.gst.accept}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                additionalDetails: {
                                    ...prev.additionalDetails,
                                    gst: {
                                        ...prev.additionalDetails.gst,
                                        accept: e.target.checked,
                                    },
                                },
                            }))
                        }
                    />

                    GST Apply
                </label>

                <input
                    type="number"
                    placeholder="GST Percentage"
                    value={form.additionalDetails.gst.percent}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            additionalDetails: {
                                ...prev.additionalDetails,
                                gst: {
                                    ...prev.additionalDetails.gst,
                                    percent: e.target.value,
                                },
                            },
                        }))
                    }
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* PRODUCT TYPES */}
            <div className="mb-5 border p-4 rounded">

                <h3 className="font-semibold mb-3">
                    Product Types
                </h3>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        placeholder="Add Product Type"
                        className="border p-2 flex-1 rounded"
                    />

                    <button
                        type="button"
                        onClick={handleAddType}
                        className="bg-blue-500 text-white px-4 rounded"
                    >
                        Add
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    {form.additionalDetails.productType.map((type, i) => (
                        <div
                            key={i}
                            className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2"
                        >
                            {type}

                            <button
                                type="button"
                                onClick={() => handleRemoveType(type)}
                                className="text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* PRODUCT CATEGORY */}
            <div className="mb-5 border p-4 rounded">

                <h3 className="font-semibold mb-3">
                    Product Categories
                </h3>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) =>
                            setNewCategory(e.target.value)
                        }
                        placeholder="Add Product Category"
                        className="border p-2 flex-1 rounded"
                    />

                    <button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-green-500 text-white px-4 rounded"
                    >
                        Add
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    {form.additionalDetails.productCategory.map(
                        (cat, i) => (
                            <div
                                key={i}
                                className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2"
                            >
                                {cat}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveCategory(cat)
                                    }
                                    className="text-red-500"
                                >
                                    ✕
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* SUBMIT */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black text-white px-4 py-3 w-full rounded"
            >
                {loading ? "Updating..." : "Update Profile"}
            </button>
        </div>
    );
}


// =========================old working code ==============================
// "use client";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";

// export default function EditProviderProfile() {
//     const { sprovid } = useParams();

//     const [newType, setNewType] = useState("");
//     const [newCategory, setNewCategory] = useState("");
//     const [loading, setLoading] = useState(false);

//     const [providerId, setProviderId] = useState(null);
//     const [provider, setProvider] = useState(null);

//     // // GET PROVIDER ID FROM COOKIE
//     const [form, setForm] = useState({
//         name: "",
//         mobile: "",
//         status: "active",
//         email: "",
//         additionalDetails: {
//             productType: [],
//             productCategory: [],
//             gst: {
//                 accept: false,
//                 percent: 0,
//             },
//         },
//     });

//     // FETCH PROVIDER
//     useEffect(() => {
//         async function fetchProvider() {
//             try {
//                 // GET COOKIE DATA
//                 const res = await fetch("/api/cookies", {
//                     cache: "no-store",
//                 });

//                 const data = await res.json();

//                 // if (!data?.id) return;

//                 setProviderId(sprovid);

//                 // FETCH PROVIDER
//                 const providerRes = await fetch(
//                     `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/provider/${sprovid}`
//                 );

//                 const providerData = await providerRes.json();

//                 if (providerData.success) {
//                     setProvider(providerData.provider);
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }

//         fetchProvider();
//     }, []);

//     // SET FORM WHEN PROVIDER LOADS
//     useEffect(() => {
//         if (!provider) return;

//         setForm({
//             name: provider.name || "",
//             mobile: provider.mobile || "",
//             status: provider.status || "active",
//             email: provider.email || "",

//             additionalDetails: {
//                 productType:
//                     provider.additionalDetails?.productType || [],

//                 productCategory:
//                     provider.additionalDetails?.productCategory || [],

//                 gst: {
//                     accept:
//                         provider.additionalDetails?.gst?.accept || false,

//                     percent:
//                         provider.additionalDetails?.gst?.percent || 0,
//                 },
//             },
//         });
//     }, [provider]);

//     console.log(form);


//     const handleAddType = () => {
//         if (!newType) return;
//         setForm((prev) => ({
//             ...prev,
//             additionalDetails: {
//                 ...prev.additionalDetails,
//                 productType: [...(prev.additionalDetails.productType || []), newType],
//             },
//         }));
//         setNewType("");
//     };

//     const handleAddCategory = () => {
//         if (!newCategory) return;
//         setForm((prev) => ({
//             ...prev,
//             additionalDetails: {
//                 ...prev.additionalDetails,
//                 productCategory: [
//                     ...(prev.additionalDetails.productCategory || []),
//                     newCategory,
//                 ],
//             },
//         }));
//         setNewCategory("");
//     };

//     const handleRemoveType = (item) => {
//         setForm((prev) => ({
//             ...prev,
//             additionalDetails: {
//                 ...prev.additionalDetails,
//                 productType: prev.additionalDetails.productType.filter(
//                     (t) => t !== item
//                 ),
//             },
//         }));
//     };

//     const handleRemoveCategory = (item) => {
//         setForm((prev) => ({
//             ...prev,
//             additionalDetails: {
//                 ...prev.additionalDetails,
//                 productCategory: prev.additionalDetails.productCategory.filter(
//                     (c) => c !== item
//                 ),
//             },
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const res = await fetch(
//             `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/update-profile/${providerId}`,
//             {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(form),
//             }
//         );

//         const data = await res.json();
//         setLoading(false);

//         if (!res.ok) {
//             alert(data.message || "Update failed");
//             return;
//         }

//         alert("Profile updated successfully");
//     };

//     return (
//         <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">

//             <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

//             {/* NAME */}
//             <input
//                 className="border p-2 w-full mb-3"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 placeholder="Name"
//             />

//             {/* EMAIL (READONLY) */}
//             <input
//                 className="border p-2 w-full mb-3 bg-gray-100"
//                 value={form.email}
//                 disabled
//             />

//             {/* MOBILE */}
//             <input
//                 className="border p-2 w-full mb-3"
//                 value={form.mobile}
//                 onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//                 placeholder="Mobile"
//             />

//             {/* STATUS */}
//             <input
//                 className="border p-2 w-full mb-3"
//                 value={form.status}
//                 onChange={(e) => setForm({ ...form, status: e.target.value })}
//                 placeholder="Status"
//             />

//             {/* GST */}
//             <div className="mb-3">
//                 <label>
//                     <input
//                         type="checkbox"
//                         checked={form.additionalDetails.gst.accept}
//                         onChange={(e) =>
//                             setForm({
//                                 ...form,
//                                 additionalDetails: {
//                                     ...form.additionalDetails,
//                                     gst: {
//                                         ...form.additionalDetails.gst,
//                                         accept: e.target.checked,
//                                     },
//                                 },
//                             })
//                         }
//                     />
//                     GST Apply
//                 </label>

//                 <input
//                     type="number"
//                     className="border p-2 w-full mt-2"
//                     value={form.additionalDetails.gst.percent}
//                     onChange={(e) =>
//                         setForm({
//                             ...form,
//                             additionalDetails: {
//                                 ...form.additionalDetails,
//                                 gst: {
//                                     ...form.additionalDetails.gst,
//                                     percent: e.target.value,
//                                 },
//                             },
//                         })
//                     }
//                     placeholder="GST %"
//                 />
//             </div>

//             {/* PRODUCT TYPES */}
//             <div className="mb-3">
//                 <h3 className="font-semibold">Product Types</h3>

//                 <div className="flex gap-2">
//                     <input
//                         value={newType}
//                         onChange={(e) => setNewType(e.target.value)}
//                         className="border p-2 flex-1"
//                         placeholder="Add type"
//                     />
//                     <button onClick={handleAddType} className="bg-blue-500 text-white px-3">
//                         Add
//                     </button>
//                 </div>

//                 <div className="flex gap-2 flex-wrap mt-2">
//                     {form.additionalDetails.productType?.map((t, i) => (
//                         <span key={i} className="bg-gray-200 px-2 py-1">
//                             {t}
//                             <button onClick={() => handleRemoveType(t)}> ❌</button>
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             {/* PRODUCT CATEGORY */}
//             <div className="mb-3">
//                 <h3 className="font-semibold">Product Categories</h3>

//                 <div className="flex gap-2">
//                     <input
//                         value={newCategory}
//                         onChange={(e) => setNewCategory(e.target.value)}
//                         className="border p-2 flex-1"
//                         placeholder="Add category"
//                     />
//                     <button onClick={handleAddCategory} className="bg-green-500 text-white px-3">
//                         Add
//                     </button>
//                 </div>

//                 <div className="flex gap-2 flex-wrap mt-2">
//                     {form.additionalDetails.productCategory?.map((c, i) => (
//                         <span key={i} className="bg-gray-200 px-2 py-1">
//                             {c}
//                             <button onClick={() => handleRemoveCategory(c)}> ❌</button>
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="bg-black text-white px-4 py-2 w-full"
//             >
//                 {loading ? "Updating..." : "Update Profile"}
//             </button>
//         </div>
//     );
// }