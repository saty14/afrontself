import  Footer from "@/app/component/web/footer"

export default function AboutPage() {
  return (<>
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-orange-500 mb-10">
          About Us
        </h1>

        <div className="space-y-6 text-gray-300 leading-8 text-lg">

          <p>
            KioskCloud is a modern restaurant self-ordering SaaS platform
            designed for restaurants, cafés, hotels and food courts.
          </p>

          <p>
            Our platform helps businesses manage self-ordering kiosks,
            QR ordering, dine-in orders, takeaway orders, packaging orders,
            online payments and restaurant analytics from one dashboard.
          </p>

          <p>
            Restaurants can register, create menus, manage tables,
            track earnings and process customer orders in real-time.
          </p>

          <p>
            Our mission is to simplify restaurant operations using smart
            digital ordering technology.
          </p>

        </div>

      </div>
    </main>
      <Footer />
      </>
  );
}