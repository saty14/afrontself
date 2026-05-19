import  Footer from "@/app/component/web/footer"

export default function PrivacyPolicyPage() {
  return (<>
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-orange-500 mb-10">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-300 leading-8">

          <p>
            We respect your privacy and are committed to protecting
            your personal information.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Information We Collect
            </h2>

            <p>
              We may collect restaurant details, customer details,
              payment information, order information and analytics data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              How We Use Information
            </h2>

            <p>
              Information is used to process orders, improve services,
              manage payments and provide customer support.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Payment Security
            </h2>

            <p>
              All online payments are securely processed through
              trusted payment gateways.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Data Protection
            </h2>

            <p>
              We implement security measures to protect user data
              against unauthorized access.
            </p>
          </div>

        </div>

      </div>

    </main>
    <Footer />
    </>
  );
}