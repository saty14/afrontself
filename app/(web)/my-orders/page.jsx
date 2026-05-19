"use client";

import { useState } from "react";
import Link from "next/link";

export default function MyOrdersPage() {

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  const [mobile, setMobile] = useState("");

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(false);

  async function fetchOrders() {

    if (!mobile) {
      return alert("Enter mobile number");
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/order/customer-orders/${mobile}`
      );

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h1 className="text-2xl font-bold mb-4">
            My Orders
          </h1>

          <div className="flex gap-2">

            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value)
              }
              className="flex-1 border p-3 rounded-lg"
            />

            <button
              onClick={fetchOrders}
              className="bg-blue-600 text-white px-6 rounded-lg"
            >
              Search
            </button>
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-center py-10">
            Loading...
          </div>
        )}

        {/* NO ORDERS */}

        {!loading && orders.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            No orders found
          </div>
        )}

        {/* ORDERS */}

        <div className="space-y-4">

          {orders.map((order) => (

            <Link
              key={order._id}
              href={`/my-orders/${order._id}`}
            >
              <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition">

                <div className="flex justify-between items-center">

                  <div>
                    <h2 className="text-xl font-bold">
                      Token #{order.tokenNumber}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Provider :  {order.sprovname}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="font-bold text-lg">
                      ₹{order.totalAmount}
                    </p>

                    <p
                      className={`text-sm font-medium ${
                        order.orderStatus === "Ready"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}