"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Provider() {

    const router = useRouter();

    const [providers, setProviders] = useState([]);

    // FILTER DATA
    const [cities, setCities] = useState([]);
    const [localAreas, setLocalAreas] = useState([]);
    const [services, setServices] = useState([]);

    // FILTERS
    const [filters, setFilters] = useState({
        cityId: "",
        localAreaId: "",
        serviceId: "",
    });

    // PAGINATION
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        limit: 9,
    });

    // ================= FETCH FILTER DATA =================
    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city`)
            .then(res => res.json())
            .then(data => setCities(data.citys || []));

        fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/services`)
            .then(res => res.json())
            .then(data => setServices(data.services || []));

    }, []);

    // ================= FETCH LOCAL AREAS =================
    useEffect(() => {

        if (!filters.cityId) {
            setLocalAreas([]);
            return;
        }

        fetch(
            `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/local-aria?cityId=${filters.cityId}`
        )
            .then(res => res.json())
            .then(data => setLocalAreas(data.localAreas || []));

    }, [filters.cityId]);

    // ================= FETCH PROVIDERS =================
    useEffect(() => {

        fetchProviders();

    }, [filters, page]);

    const fetchProviders = async () => {

        try {

            const query = new URLSearchParams();

            // FILTERS
            if (filters.cityId) {
                query.append("cityId", filters.cityId);
            }

            if (filters.localAreaId) {
                query.append("localAreaId", filters.localAreaId);
            }

            if (filters.serviceId) {
                query.append("serviceId", filters.serviceId);
            }

            // PAGINATION
            query.append("page", page);
            query.append("limit", 9);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/providers?${query.toString()}`
            );

            const data = await res.json();

            if (data.success) {

                setProviders(data.providers);

                setPagination(data.pagination);
            }

        } catch (error) {
            console.log(error);
        }
    };

    // ================= HANDLE FILTER =================
    const handleFilterChange = (e) => {

        const { name, value } = e.target;

        setPage(1);

        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ================= HEADER ================= */}

                <div className="mb-8">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                Service Providers
                            </h1>

                            <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                Discover trusted providers in your area
                            </p>
                        </div>

                        <div className="bg-white shadow-md border border-gray-100 rounded-2xl px-5 py-4">
                            <p className="text-sm text-gray-500">
                                Total Providers
                            </p>

                            <h2 className="text-2xl font-bold text-blue-600">
                                {pagination.total || 0}
                            </h2>
                        </div>

                    </div>

                </div>

                {/* ================= FILTERS ================= */}

                <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-3xl p-5 sm:p-6 mb-8">

                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Filter Providers
                        </h2>

                        <button
                            onClick={() => {
                                setFilters({
                                    cityId: "",
                                    localAreaId: "",
                                    serviceId: "",
                                });

                                setPage(1);
                            }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                        >
                            Clear Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                        {/* CITY */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select City
                            </label>

                            <select
                                name="cityId"
                                value={filters.cityId}
                                onChange={handleFilterChange}
                                className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 p-3 rounded-xl outline-none"
                            >
                                <option value="">All Cities</option>

                                {cities.map(city => (
                                    <option
                                        key={city._id}
                                        value={city.sctyid}
                                    >
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* LOCAL AREA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Local Area
                            </label>

                            <select
                                name="localAreaId"
                                value={filters.localAreaId}
                                onChange={handleFilterChange}
                                className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 p-3 rounded-xl outline-none"
                            >
                                <option value="">All Local Areas</option>

                                {localAreas.map(area => (
                                    <option
                                        key={area._id}
                                        value={area.sloctyid}
                                    >
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SERVICE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Service
                            </label>

                            <select
                                name="serviceId"
                                value={filters.serviceId}
                                onChange={handleFilterChange}
                                className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 p-3 rounded-xl outline-none"
                            >
                                <option value="">All Services</option>

                                {services.map(service => (
                                    <option
                                        key={service._id}
                                        value={service.ssrvcid}
                                    >
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                </div>

                {/* ================= PROVIDERS ================= */}

                {providers.length > 0 ? (

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                        {providers.map((provider) => (

                            <div
                                key={provider._id}
                                onClick={() =>
                                    router.push(`/provider-res/${provider.sprovid}`)
                                }
                                className="group cursor-pointer bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                            >

                                {/* TOP GLOW */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                                {/* AVATAR */}
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold mb-5 shadow-lg">
                                    {provider?.name?.charAt(0)?.toUpperCase()}
                                </div>

                                {/* PROVIDER INFO */}
                                <div className="space-y-2">

                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                                        {provider.name}
                                    </h2>

                                    <div className="space-y-1">

                                        <p className="text-sm text-gray-600 break-all">
                                            📧 {provider.email}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            📱 {provider.mobile}
                                        </p>

                                    </div>

                                </div>

                                {/* BUTTON */}
                                <div className="mt-6 flex items-center justify-between">

                                    <span className="text-sm font-medium text-blue-600 group-hover:translate-x-1 transition">
                                        View Details
                                    </span>

                                    <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                                        →
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                ) : (

                    /* EMPTY STATE */

                    <div className="bg-white rounded-3xl shadow-md border border-gray-100 py-20 px-6 text-center">

                        <div className="text-6xl mb-5">
                            🔍
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            No Providers Found
                        </h2>

                        <p className="text-gray-500 max-w-md mx-auto">
                            Try changing your filters or search criteria to find providers.
                        </p>

                    </div>

                )}

                {/* ================= PAGINATION ================= */}

                {providers.length > 0 && (

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">

                        {/* PREV */}
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}
                            className="px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                            ← Previous
                        </button>

                        {/* PAGE INFO */}
                        <div className="bg-white border border-gray-100 shadow-sm px-6 py-3 rounded-xl font-semibold text-gray-700">
                            Page {pagination.page} of {pagination.totalPages}
                        </div>

                        {/* NEXT */}
                        <button
                            disabled={page === pagination.totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                            Next →
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}
// ===============full working updte ui==============================

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Provider() {

//     const router = useRouter();

//     const [providers, setProviders] = useState([]);

//     // FILTER DATA
//     const [cities, setCities] = useState([]);
//     const [localAreas, setLocalAreas] = useState([]);
//     const [services, setServices] = useState([]);

//     // FILTERS
//     const [filters, setFilters] = useState({
//         cityId: "",
//         localAreaId: "",
//         serviceId: "",
//     });

//     // PAGINATION
//     const [page, setPage] = useState(1);
//     const [pagination, setPagination] = useState({
//         total: 0,
//         totalPages: 1,
//         limit: 9,
//     });

//     // ================= FETCH FILTER DATA =================
//     useEffect(() => {

//         fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city`)
//             .then(res => res.json())
//             .then(data => setCities(data.citys || []));

//         fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/services`)
//             .then(res => res.json())
//             .then(data => setServices(data.services || []));

//     }, []);

//     // ================= FETCH LOCAL AREAS =================
//     useEffect(() => {

//         if (!filters.cityId) {
//             setLocalAreas([]);
//             return;
//         }

//         fetch(
//             `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/local-aria?cityId=${filters.cityId}`
//         )
//             .then(res => res.json())
//             .then(data => setLocalAreas(data.localAreas || []));

//     }, [filters.cityId]);

//     // ================= FETCH PROVIDERS =================
//     useEffect(() => {

//         fetchProviders();

//     }, [filters, page]);

//     const fetchProviders = async () => {

//         try {

//             const query = new URLSearchParams();

//             // FILTERS
//             if (filters.cityId) {
//                 query.append("cityId", filters.cityId);
//             }

//             if (filters.localAreaId) {
//                 query.append("localAreaId", filters.localAreaId);
//             }

//             if (filters.serviceId) {
//                 query.append("serviceId", filters.serviceId);
//             }

//             // PAGINATION
//             query.append("page", page);
//             query.append("limit", 9);

//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/providers?${query.toString()}`
//             );

//             const data = await res.json();

//             if (data.success) {

//                 setProviders(data.providers);

//                 setPagination(data.pagination);
//             }

//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // ================= HANDLE FILTER =================
//     const handleFilterChange = (e) => {

//         const { name, value } = e.target;

//         setPage(1);

//         setFilters(prev => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">

//             <h1 className="text-2xl font-bold mb-6">
//                 All Providers
//             </h1>

//             {/* ================= FILTERS ================= */}

//             <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-3 gap-4">

//                 {/* CITY */}
//                 <select
//                     name="cityId"
//                     value={filters.cityId}
//                     onChange={handleFilterChange}
//                     className="border p-2 rounded"
//                 >
//                     <option value="">All Cities</option>

//                     {cities.map(city => (
//                         <option
//                             key={city._id}
//                             value={city.sctyid}
//                         >
//                             {city.name}
//                         </option>
//                     ))}
//                 </select>

//                 {/* LOCAL AREA */}
//                 <select
//                     name="localAreaId"
//                     value={filters.localAreaId}
//                     onChange={handleFilterChange}
//                     className="border p-2 rounded"
//                 >
//                     <option value="">All Local Areas</option>

//                     {localAreas.map(area => (
//                         <option
//                             key={area._id}
//                             value={area.sloctyid}
//                         >
//                             {area.name}
//                         </option>
//                     ))}
//                 </select>

//                 {/* SERVICE */}
//                 <select
//                     name="serviceId"
//                     value={filters.serviceId}
//                     onChange={handleFilterChange}
//                     className="border p-2 rounded"
//                 >
//                     <option value="">All Services</option>

//                     {services.map(service => (
//                         <option
//                             key={service._id}
//                             value={service.ssrvcid}
//                         >
//                             {service.name}
//                         </option>
//                     ))}
//                 </select>

//             </div>

//             {/* ================= PROVIDERS ================= */}

//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

//                 {providers.map((provider) => (

//                     <div
//                         key={provider._id}
//                         onClick={() =>
//                             router.push(`/provider-res/${provider.sprovid}`)
//                         }
//                         className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
//                     >

//                         <h2 className="text-lg font-semibold text-gray-800">
//                             {provider.name}
//                         </h2>

//                         <p className="text-sm text-gray-500">
//                             {provider.email}
//                         </p>

//                         <p className="text-sm text-gray-500">
//                             {provider.mobile}
//                         </p>

//                         <span className="text-xs text-blue-600 mt-2 inline-block">
//                             View Details →
//                         </span>

//                     </div>
//                 ))}

//             </div>

//             {/* EMPTY */}
//             {providers.length === 0 && (
//                 <div className="text-center text-gray-500 mt-10">
//                     No providers found
//                 </div>
//             )}

//             {/* ================= PAGINATION ================= */}

//             <div className="flex justify-center items-center gap-3 mt-10">

//                 {/* PREV */}
//                 <button
//                     disabled={page === 1}
//                     onClick={() => setPage(prev => prev - 1)}
//                     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//                 >
//                     Prev
//                 </button>

//                 {/* PAGE INFO */}
//                 <div className="font-semibold">
//                     Page {pagination.page} of {pagination.totalPages}
//                 </div>

//                 {/* NEXT */}
//                 <button
//                     disabled={page === pagination.totalPages}
//                     onClick={() => setPage(prev => prev + 1)}
//                     className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
//                 >
//                     Next
//                 </button>

//             </div>

//         </div>
//     );
// }

// ==========full working without filter =============================
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Provider() {

//     const router = useRouter();

//     const [providers, setProviders] = useState([]);

//     // ✅ DROPDOWNS
//     const [cities, setCities] = useState([]);
//     const [localAreas, setLocalAreas] = useState([]);
//     const [services, setServices] = useState([]);

//     // ✅ FILTERS
//     const [filters, setFilters] = useState({
//         cityId: "",
//         localAreaId: "",
//         serviceId: "",
//     });

//     // ================= FETCH FILTER DATA =================
//     useEffect(() => {

//         fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city`)
//             .then(res => res.json())
//             .then(data => setCities(data.citys || []));

//         fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/services`)
//             .then(res => res.json())
//             .then(data => setServices(data.services || []));

//     }, []);

//     // ================= FETCH LOCAL AREAS =================
//     useEffect(() => {

//         if (!filters.cityId) {
//             setLocalAreas([]);
//             return;
//         }

//         fetch(
//             `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/local-aria?cityId=${filters.cityId}`
//         )
//             .then(res => res.json())
//             .then(data => setLocalAreas(data.localAreas || []));

//     }, [filters.cityId]);

//     // ================= FETCH PROVIDERS =================
//     useEffect(() => {

//         fetchProviders();

//     }, [filters]);

//     const fetchProviders = async () => {

//         try {

//             const query = new URLSearchParams();

//             if (filters.cityId) {
//                 query.append("cityId", filters.cityId);
//             }

//             if (filters.localAreaId) {
//                 query.append("localAreaId", filters.localAreaId);
//             }

//             if (filters.serviceId) {
//                 query.append("serviceId", filters.serviceId);
//             }

//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/providers?${query.toString()}`
//             );

//             const data = await res.json();

//             if (data.success) {
//                 setProviders(data.providers);
//             }

//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // ================= HANDLE FILTER =================
//     const handleFilterChange = (e) => {

//         const { name, value } = e.target;

//         setFilters(prev => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">

//             <h1 className="text-2xl font-bold mb-6">
//                 All Providers
//             </h1>

//             {/* ================= FILTERS ================= */}

//             <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-3 gap-4">

//                 {/* CITY */}
//                 <select
//                     name="cityId"
//                     value={filters.cityId}
//                     onChange={handleFilterChange}
//                     className="border p-2 rounded"
//                 >
//                     <option value="">All Cities</option>

//                     {cities.map(city => (
//                         <option
//                             key={city._id}
//                             value={city.sctyid}
//                         >
//                             {city.name}
//                         </option>
//                     ))}
//                 </select>

//                 {/* LOCAL AREA */}
//                 <select
//                     name="localAreaId"
//                     value={filters.localAreaId}
//                     onChange={handleFilterChange}
//                     className="border p-2 rounded"
//                 >
//                     <option value="">All Local Areas</option>

//                     {localAreas.map(area => (
//                         <option
//                             key={area._id}
//                             value={area.sloctyid}
//                         >
//                             {area.name}
//                         </option>
//                     ))}
//                 </select>

//                 {/* SERVICE */}
//                 <select
//                     name="serviceId"
//                     value={filters.serviceId}
//                     onChange={handleFilterChange}
//                     className="border p-2 rounded"
//                 >
//                     <option value="">All Services</option>

//                     {services.map(service => (
//                         <option
//                             key={service._id}
//                             value={service.svcid}
//                         >
//                             {service.name}
//                         </option>
//                     ))}
//                 </select>

//             </div>

//             {/* ================= PROVIDERS ================= */}

//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

//                 {providers.map((provider) => (

//                     <div
//                         key={provider._id}
//                         onClick={() =>
//                             router.push(`/provider-res/${provider.sprovid}`)
//                         }
//                         className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
//                     >

//                         <h2 className="text-lg font-semibold text-gray-800">
//                             {provider.name}
//                         </h2>

//                         <p className="text-sm text-gray-500">
//                             {provider.email}
//                         </p>

//                         <p className="text-sm text-gray-500">
//                             {provider.mobile}
//                         </p>

//                         <span className="text-xs text-blue-600 mt-2 inline-block">
//                             View Details →
//                         </span>

//                     </div>
//                 ))}

//             </div>

//             {/* EMPTY */}
//             {providers.length === 0 && (
//                 <div className="text-center text-gray-500 mt-10">
//                     No providers found
//                 </div>
//             )}

//         </div>
//     );
// }

// ===================================================

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Provider() {
//   const [providers, setProviders] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProviders = async () => {
//       const res = await fetch("http://localhost:8000/api/providers/providers");
//       const data = await res.json();

//       if (data.success) {
//         setProviders(data.providers);
//       }
//     };

//     fetchProviders();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">All Providers</h1>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {providers.map((provider) => (
//           <div
//             key={provider._id}
//             onClick={() => router.push(`/provider-res/${provider.sprovid}`)}
//             className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
//           >
//             <h2 className="text-lg font-semibold text-gray-800">
//               {provider.name}
//             </h2>

//             <p className="text-sm text-gray-500">{provider.email}</p>
//             <p className="text-sm text-gray-500">{provider.mobile}</p>

//             <span className="text-xs text-blue-600 mt-2 inline-block">
//               View Details →
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }