import  Footer from "@/app/component/web/footer"

export default function TermsPage() {
  return (<>
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-orange-500 mb-10">
          Terms & Conditions
        </h1>

        <div className="space-y-8 text-gray-300 leading-8">

          <p>
            By using our platform, you agree to comply with our terms
            and conditions.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Platform Usage
            </h2>

            <p>
              Restaurants are responsible for managing their products,
              pricing, taxes and customer orders.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Payment Terms
            </h2>

            <p>
              Subscription fees and payment gateway charges may apply
              depending on selected plans.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Account Suspension
            </h2>

            <p>
              We reserve the right to suspend accounts involved in
              fraudulent or illegal activities.
            </p>
          </div>

        </div>

      </div>

    </main>
    <Footer />
    </>
  );
}