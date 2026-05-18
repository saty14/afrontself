
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SettlementPage = () => {
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

    const [providers, setProviders] = useState([]);

    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({});
    const [acode, setAcode] = useState("");

    useEffect(() => {
        async function fetchCookies() {
            const res = await fetch("/api/admincookis", {
                cache: "no-store",
            });

            const data = await res.json();

            setAcode(data.admincode);
        }

        fetchCookies();
    }, []);


    const limit = 10;

    const API_URL =
        `${BASE_URL}/api/settel`;

    // =================================================
    // FETCH PROVIDERS
    // =================================================

    const fetchProviders = async () => {

        try {

            setLoading(true);

            // const adminCode =
            //     localStorage.getItem("adminCode");
            const adminCode = acode;

            const response = await fetch(
                `${API_URL}/provider-settlement-summary?page=${page}&limit=${limit}`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",

                        authorization: adminCode,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch providers"
                );
            }

            setProviders(data.providers);

            setPagination(data.pagination);

        } catch (error) {

            console.log(error);

            alert(error.message);

        } finally {

            setLoading(false);
        }
    };

    // =================================================
    // SETTLE PROVIDER
    // =================================================

    const handleSettle = async (
        sprovid
    ) => {

        try {

            const confirmSettle =
                window.confirm(
                    "Are you sure you want to settle all pending orders?"
                );

            if (!confirmSettle) return;

            // const adminCode =
            // localStorage.getItem("adminCode");
            const adminCode = acode;

            const response = await fetch(
                `${API_URL}/settle-provider/${sprovid}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        authorization: adminCode,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Settlement failed"
                );
            }

            alert(
                "Settlement completed successfully"
            );

            fetchProviders();

        } catch (error) {

            console.log(error);

            alert(error.message);
        }
    };

    // =================================================
    // USE EFFECT
    // =================================================

    // useEffect(() => {

    //     fetchProviders();

    // }, [page]);
    useEffect(() => {
        if (acode) {
            fetchProviders();
        }
    }, [acode, page]);

    // =================================================
    // UI
    // =================================================

    return (

        <div className="p-6">

            {/* ================================= */}
            {/* TITLE */}
            {/* ================================= */}

            <h1 className="text-3xl font-bold mb-6">
                Provider Settlement Dashboard
            </h1>

            {/* ================================= */}
            {/* TABLE */}
            {/* ================================= */}

            <div className="overflow-x-auto border rounded-lg">

                <table className="w-full border-collapse">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="border p-3 text-left">
                                Provider
                            </th>

                            <th className="border p-3 text-left">
                                Email
                            </th>

                            <th className="border p-3 text-left">
                                Mobile
                            </th>

                            <th className="border p-3 text-center">
                                Pending Orders
                            </th>

                            <th className="border p-3 text-center">
                                Pending Amount
                            </th>

                            <th className="border p-3 text-center">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="text-center p-6"
                                >
                                    Loading...
                                </td>

                            </tr>

                        ) : providers.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="text-center p-6"
                                >
                                    No Providers Found
                                </td>

                            </tr>

                        ) : (

                            providers.map(
                                (provider) => (

                                    <tr
                                        key={
                                            provider.providerId
                                        }
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="border p-3" >
                                            {
                                                provider.providerName
                                            }
                                        </td>


                                        <td className="border p-3">
                                            {
                                                provider.providerEmail
                                            }
                                        </td>

                                        <td className="border p-3">
                                            {
                                                provider.providerMobile
                                            }
                                        </td>

                                        <td className="border p-3 text-center">
                                            {
                                                provider.totalPendingOrders
                                            }
                                        </td>

                                        <td className="border p-3 text-center font-semibold">
                                            ₹
                                            {
                                                provider.totalPendingAmount
                                            }
                                        </td>

                                        <td className="border p-3 text-center">
                                            
                                            <button onClick={() => router.push(`/me-super-admin/all-providers/edit-provider-profile/${provider.providerId}`)} className={`px-4 py-2 mx-2 rounded text-white transition bg-green-600 hover:bg-green-700`}> Edit </button>


                                            <button onClick={() => router.push(`/me-super-admin/all-providers/${provider.providerId}`)} className={`px-4 py-2 mx-2 rounded text-white transition bg-green-600 hover:bg-green-700`}> Orders </button>


                                            <button className={`px-4 py-2 mx-2 rounded text-white transition bg-green-600 hover:bg-green-700`} onClick={() => router.push(`/me-super-admin/all-providers/analytics/${provider.providerId}`)} > Analytics </button>


                                            <button
                                                onClick={() =>
                                                    handleSettle(
                                                        provider.providerId
                                                    )
                                                }

                                                disabled={
                                                    provider.totalPendingOrders ===
                                                    0
                                                }

                                                className={`px-4 py-2 rounded text-white transition ${provider.totalPendingOrders ===
                                                    0
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-green-600 hover:bg-green-700"
                                                    }`}
                                            >
                                                Settle
                                            </button>

                                        </td>

                                    </tr>
                                )
                            )
                        )}

                    </tbody>

                </table>
            </div>

            {/* ================================= */}
            {/* PAGINATION */}
            {/* ================================= */}

            <div className="flex justify-center items-center gap-4 mt-6">

                <button
                    onClick={() =>
                        setPage(page - 1)
                    }

                    disabled={page === 1}

                    className={`px-4 py-2 rounded ${page === 1
                        ? "bg-gray-300"
                        : "bg-black text-white"
                        }`}
                >
                    Previous
                </button>

                <span className="font-semibold">
                    Page{" "}
                    {pagination.page || 1} of{" "}
                    {pagination.totalPages || 1}
                </span>

                <button
                    onClick={() =>
                        setPage(page + 1)
                    }

                    disabled={
                        page ===
                        pagination.totalPages
                    }

                    className={`px-4 py-2 rounded ${page ===
                        pagination.totalPages
                        ? "bg-gray-300"
                        : "bg-black text-white"
                        }`}
                >
                    Next
                </button>

            </div>

        </div>
    );
};

export default SettlementPage;

