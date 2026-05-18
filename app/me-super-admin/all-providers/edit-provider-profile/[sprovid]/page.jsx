




"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EditProviderProfile() {
    const { sprovid } = useParams();

    const [newType, setNewType] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const [providerId, setProviderId] = useState(null);
    const [provider, setProvider] = useState(null);

    // // GET PROVIDER ID FROM COOKIE
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        status: "active",
        email: "",
        additionalDetails: {
            productType: [],
            productCategory: [],
            gst: {
                accept: false,
                percent: 0,
            },
        },
    });

    // FETCH PROVIDER
    useEffect(() => {
        async function fetchProvider() {
            try {
                // GET COOKIE DATA
                const res = await fetch("/api/cookies", {
                    cache: "no-store",
                });

                const data = await res.json();

                // if (!data?.id) return;

                setProviderId(sprovid);

                // FETCH PROVIDER
                const providerRes = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/provider/${sprovid}`
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
    }, []);

    // SET FORM WHEN PROVIDER LOADS
    useEffect(() => {
        if (!provider) return;

        setForm({
            name: provider.name || "",
            mobile: provider.mobile || "",
            status: provider.status || "active",
            email: provider.email || "",

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

    console.log(form);


    const handleAddType = () => {
        if (!newType) return;
        setForm((prev) => ({
            ...prev,
            additionalDetails: {
                ...prev.additionalDetails,
                productType: [...(prev.additionalDetails.productType || []), newType],
            },
        }));
        setNewType("");
    };

    const handleAddCategory = () => {
        if (!newCategory) return;
        setForm((prev) => ({
            ...prev,
            additionalDetails: {
                ...prev.additionalDetails,
                productCategory: [
                    ...(prev.additionalDetails.productCategory || []),
                    newCategory,
                ],
            },
        }));
        setNewCategory("");
    };

    const handleRemoveType = (item) => {
        setForm((prev) => ({
            ...prev,
            additionalDetails: {
                ...prev.additionalDetails,
                productType: prev.additionalDetails.productType.filter(
                    (t) => t !== item
                ),
            },
        }));
    };

    const handleRemoveCategory = (item) => {
        setForm((prev) => ({
            ...prev,
            additionalDetails: {
                ...prev.additionalDetails,
                productCategory: prev.additionalDetails.productCategory.filter(
                    (c) => c !== item
                ),
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/update-profile/${providerId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">

            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            {/* NAME */}
            <input
                className="border p-2 w-full mb-3"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
            />

            {/* EMAIL (READONLY) */}
            <input
                className="border p-2 w-full mb-3 bg-gray-100"
                value={form.email}
                disabled
            />

            {/* MOBILE */}
            <input
                className="border p-2 w-full mb-3"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="Mobile"
            />

            {/* STATUS */}
            <input
                className="border p-2 w-full mb-3"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                placeholder="Status"
            />

            {/* GST */}
            <div className="mb-3">
                <label>
                    <input
                        type="checkbox"
                        checked={form.additionalDetails.gst.accept}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                additionalDetails: {
                                    ...form.additionalDetails,
                                    gst: {
                                        ...form.additionalDetails.gst,
                                        accept: e.target.checked,
                                    },
                                },
                            })
                        }
                    />
                    GST Apply
                </label>

                <input
                    type="number"
                    className="border p-2 w-full mt-2"
                    value={form.additionalDetails.gst.percent}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            additionalDetails: {
                                ...form.additionalDetails,
                                gst: {
                                    ...form.additionalDetails.gst,
                                    percent: e.target.value,
                                },
                            },
                        })
                    }
                    placeholder="GST %"
                />
            </div>

            {/* PRODUCT TYPES */}
            <div className="mb-3">
                <h3 className="font-semibold">Product Types</h3>

                <div className="flex gap-2">
                    <input
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="border p-2 flex-1"
                        placeholder="Add type"
                    />
                    <button onClick={handleAddType} className="bg-blue-500 text-white px-3">
                        Add
                    </button>
                </div>

                <div className="flex gap-2 flex-wrap mt-2">
                    {form.additionalDetails.productType?.map((t, i) => (
                        <span key={i} className="bg-gray-200 px-2 py-1">
                            {t}
                            <button onClick={() => handleRemoveType(t)}> ❌</button>
                        </span>
                    ))}
                </div>
            </div>

            {/* PRODUCT CATEGORY */}
            <div className="mb-3">
                <h3 className="font-semibold">Product Categories</h3>

                <div className="flex gap-2">
                    <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="border p-2 flex-1"
                        placeholder="Add category"
                    />
                    <button onClick={handleAddCategory} className="bg-green-500 text-white px-3">
                        Add
                    </button>
                </div>

                <div className="flex gap-2 flex-wrap mt-2">
                    {form.additionalDetails.productCategory?.map((c, i) => (
                        <span key={i} className="bg-gray-200 px-2 py-1">
                            {c}
                            <button onClick={() => handleRemoveCategory(c)}> ❌</button>
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black text-white px-4 py-2 w-full"
            >
                {loading ? "Updating..." : "Update Profile"}
            </button>
        </div>
    );
}