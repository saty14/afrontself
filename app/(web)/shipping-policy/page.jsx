import  Footer from "@/app/component/web/footer"

export default function ShippingPolicyPage() {
  return (<>
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-orange-500 mb-10">
          Shipping & Delivery Policy
        </h1>

        <div className="space-y-8 text-gray-300 leading-8">

          <p>
            KioskCloud is a digital SaaS platform and does not deliver
            physical products.
          </p>

          <p>
            After successful payment and registration, restaurants receive
            instant access to the platform dashboard and services.
          </p>

          <p>
            Any software updates or digital services are delivered online.
          </p>

        </div>

      </div>

    </main>
    <Footer />
    </>
  );
}