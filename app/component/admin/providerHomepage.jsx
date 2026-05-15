import Link from "next/link";

export default function ProviderDashboardHome() {
  return (
    <main className="min-h-screen bg-gray-100">

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* WELCOME */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">
            Welcome 👋 Admin Panel
          </h2>
          <p className="text-gray-600">
            Manage products, images, categories, and grow your catalog.
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Total Products</p>
            <h3 className="text-3xl font-bold mt-2 text-green-600">
              120
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Categories</p>
            <h3 className="text-3xl font-bold mt-2 text-blue-600">
              8
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Product Types</p>
            <h3 className="text-3xl font-bold mt-2 text-yellow-500">
              14
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h3 className="text-3xl font-bold mt-2 text-purple-600">
              320
            </h3>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <Link href="/admin/add-product">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition">
              <h3 className="text-xl font-semibold mb-2">➕ Add Product</h3>
              <p className="text-gray-500 text-sm">
                Create new product with image & category
              </p>
            </div>
          </Link>

          <Link href="/admin/provider-my-orders">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition">
              <h3 className="text-xl font-semibold mb-2">📂 Orders</h3>
              <p className="text-gray-500 text-sm">
                Manage product categories
              </p>
            </div>
          </Link>

          <Link href="/admin/provider-all-products">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition">
              <h3 className="text-xl font-semibold mb-2">🖼 Products</h3>
              <p className="text-gray-500 text-sm">
                Manage image gallery for products
              </p>
            </div>
          </Link>

        </div>

        {/* RECENT PRODUCTS */}
        <div className="bg-white rounded-2xl shadow mb-12">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Recent Products
            </h3>

            <Link href="/admin/products">
              <button className="text-blue-600 hover:underline text-sm font-medium">
                View All
              </button>
            </Link>
          </div>

          <div className="divide-y">

            {[
              { title: "iPhone 15 Cover", category: "Mobile Accessories", price: "₹499" },
              { title: "Nike Running Shoes", category: "Footwear", price: "₹2,999" },
              { title: "Wireless Headphones", category: "Electronics", price: "₹1,499" },
            ].map((product, index) => (
              <div
                key={index}
                className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >

                <div>
                  <h4 className="font-semibold">{product.title}</h4>
                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-green-600 font-bold">
                    {product.price}
                  </span>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
                    Edit
                  </button>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">
            System Status
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600 font-semibold">Healthy</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">API Server</span>
              <span className="text-green-600 font-semibold">Running</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Image Storage</span>
              <span className="text-green-600 font-semibold">Active</span>
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}