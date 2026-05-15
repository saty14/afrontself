"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {

  const { id } = useParams();

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  const [order, setOrder] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchOrder() {

      try {

        const res = await fetch(
          `${BASE_URL}/api/order/single/${id}`
        );

        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchOrder();
    }

  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">

        {/* HEADER */}

        <div className="border-b pb-4 mb-4">

          <h1 className="text-3xl font-bold">
            Token #{order.tokenNumber}
          </h1>

          <p className="text-gray-500">
            {new Date(
              order.createdAt
            ).toLocaleString()}
          </p>
        </div>

        {/* STATUS */}

        <div className="grid md:grid-cols-2 gap-4 mb-6">

          <div className="border rounded-lg p-4">
            <p className="text-gray-500 text-sm">
              Order Status
            </p>

            <p className="font-bold text-lg">
              {order.orderStatus}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-gray-500 text-sm">
              Payment Status
            </p>

            <p className="font-bold text-lg">
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* ITEMS */}

        <div>

          <h2 className="text-xl font-bold mb-4">
            Order Items
          </h2>

          <div className="space-y-3">

            {order.items.map((item) => (

              <div
                key={item._id}
                className="border rounded-lg p-4 flex justify-between"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="font-bold">
                  ₹
                  {item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOTAL */}

        <div className="border-t mt-6 pt-6 flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}