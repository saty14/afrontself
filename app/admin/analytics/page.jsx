"use client";

import { useEffect, useState } from "react";

export default function ProviderAnalyticsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  const [cookies, setCookies] = useState({ id: null });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET PROVIDER ID
  // =====================================================
  useEffect(() => {
    async function fetchCookies() {
      const res = await fetch("/api/cookies", { cache: "no-store" });
      const data = await res.json();
      setCookies(data);
    }

    fetchCookies();
  }, []);

  // =====================================================
  // FETCH ALL ORDERS (no pagination for analytics)
  // =====================================================
  useEffect(() => {
    if (!cookies.id) return;

    async function fetchOrders() {
      try {
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/api/order/provider-orders/${cookies.id}?page=1&limit=1000`
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

    fetchOrders();
  }, [cookies.id]);

  // =====================================================
  // DATE HELPERS
  // =====================================================
  const today = new Date().toDateString();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const isToday = (date) => new Date(date).toDateString() === today;

  const isThisMonth = (date) => {
    const d = new Date(date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  };

  // =====================================================
  // CALCULATIONS
  // =====================================================
  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");

  const totalEarnings = paidOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  const todayEarnings = paidOrders
    .filter((o) => isToday(o.createdAt))
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const monthEarnings = paidOrders
    .filter((o) => isThisMonth(o.createdAt))
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const todayOrders = orders.filter((o) => isToday(o.createdAt)).length;

  const monthOrders = orders.filter((o) =>
    isThisMonth(o.createdAt)
  ).length;

  const unpaidAmount = orders
    .filter((o) => o.paymentStatus !== "Paid")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // =====================================================
  // UI CARD
  // =====================================================
  const Card = ({ title, value, color }) => (
    <div className="bg-white shadow rounded-2xl p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        ₹{value}
      </h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Earnings Dashboard
          </h1>
          <p className="text-gray-500">
            Track your business performance
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            Loading analytics...
          </div>
        ) : (
          <>
            {/* STATS GRID */}
            <div className="grid md:grid-cols-4 gap-4">

              <Card
                title="Today Earnings"
                value={todayEarnings}
                color="text-green-600"
              />

              <Card
                title="This Month"
                value={monthEarnings}
                color="text-blue-600"
              />

              <Card
                title="Total Earnings"
                value={totalEarnings}
                color="text-purple-600"
              />

              <Card
                title="Unpaid Amount"
                value={unpaidAmount}
                color="text-red-500"
              />
            </div>

            {/* SECOND ROW */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">

              <div className="bg-white p-5 rounded-2xl shadow">
                <h3 className="font-bold mb-3">
                  Orders Summary
                </h3>

                <p>Today Orders: {todayOrders}</p>
                <p>This Month Orders: {monthOrders}</p>
                <p>Total Orders: {orders.length}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow">
                <h3 className="font-bold mb-3">
                  Payment Breakdown
                </h3>

                <p>Paid Orders: {paidOrders.length}</p>
                <p>
                  Unpaid Orders:{" "}
                  {orders.length - paidOrders.length}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}