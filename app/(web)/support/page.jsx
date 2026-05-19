import  Footer from "@/app/component/web/footer"

export default function SupportPage() {
  return (<>
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-4xl mx-auto text-center">

        <h1 className="text-5xl font-bold text-orange-500 mb-8">
          Support Center
        </h1>

        <p className="text-gray-300 text-xl">
          Need help? Contact our support team anytime.
        </p>

        <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-10">

          <p className="text-2xl">
            📧 support@kioskcloud.com
          </p>

          <p className="text-2xl mt-6">
            📞 +91 9876543210
          </p>

        </div>

      </div>
    </main>
    <Footer />
    </>
  );
}