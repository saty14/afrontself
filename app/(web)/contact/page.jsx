import  Footer from "@/app/component/web/footer"

export default function ContactPage() {
  return (<>
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold text-orange-500 mb-10">
          Contact Us
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10">

          <div className="space-y-6 text-lg">

            <div>
              <h3 className="font-bold text-orange-400">Business Name</h3>
              <p className="text-gray-300">KioskCloud Technologies</p>
            </div>

            <div>
              <h3 className="font-bold text-orange-400">Email</h3>
              <p className="text-gray-300">
                support@kioskcloud.com
              </p>
            </div>

            <div>
              <h3 className="font-bold text-orange-400">Phone</h3>
              <p className="text-gray-300">
                +91 9876543210
              </p>
            </div>

            <div>
              <h3 className="font-bold text-orange-400">Address</h3>
              <p className="text-gray-300">
                Your Office Address Here, India
              </p>
            </div>

            <div>
              <h3 className="font-bold text-orange-400">
                Working Hours
              </h3>

              <p className="text-gray-300">
                Monday - Saturday : 10 AM - 7 PM
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
      <Footer />
      </>
  );
}