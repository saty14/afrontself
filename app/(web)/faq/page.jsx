import  Footer from "@/app/component/web/footer"

export default function FAQPage() {
  const faqs = [
    {
      q: "Can multiple restaurants use the platform?",
      a: "Yes, our platform supports unlimited restaurants.",
    },
    {
      q: "Do you support online payments?",
      a: "Yes, we support Razorpay  payment methods.",
    },
    {
      q: "Can customers order using QR code?",
      a: "Yes, QR ordering is fully supported.",
    },
  ];

  return (<>
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-orange-500 mb-12">
          Frequently Asked Questions
        </h1>

        <div className="space-y-6">

          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold">
                {faq.q}
              </h2>

              <p className="text-gray-300 mt-4">
                {faq.a}
              </p>
            </div>
          ))}

        </div>

      </div>

    </main>
      <Footer />
      </>
  );
}