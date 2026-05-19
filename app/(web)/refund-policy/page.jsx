import  Footer from "@/app/component/web/footer"

export default function RefundPolicyPage() {
  return (<>
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-orange-500 mb-10">
          Refund & Cancellation Policy
        </h1>

        <div className="space-y-8 text-gray-300 leading-8">

          <p>
            Subscription payments made for our SaaS platform are generally
            non-refundable unless otherwise stated.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Cancellation
            </h2>

            <p>
              Users may cancel subscriptions anytime from their dashboard.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Refund Eligibility
            </h2>

            <p>
              Refunds may be issued in cases of duplicate payments
              or technical billing issues.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Processing Time
            </h2>

            <p>
              Approved refunds are processed within 7-10 business days.
            </p>
          </div>

        </div>

      </div>

    </main>

    <Footer />
    </>
  );
}