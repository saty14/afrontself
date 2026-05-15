// export default function WebAbout(){
//     return<>
//     WebAbout
//     </>
// }
export default function AboutPage() {
  return (
    <main className="w-full">

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            About Our Platform
          </h1>
          <p className="text-lg max-w-3xl mx-auto opacity-90">
            We connect people who need work done with skilled providers who are
            ready to work and earn.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-2 items-center">
          
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our platform is a modern online marketplace designed to make work
              simple, fast, and accessible for everyone. Whether you are an
              individual, a business, or a skilled professional, we provide a
              trusted space to connect, collaborate, and grow.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that finding work or hiring the right person should not
              be complicated. That’s why we focus on simplicity, transparency,
              and reliability.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6">
              What We Offer
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li>✔ Easy registration as User or Provider</li>
              <li>✔ Post and accept work in minutes</li>
              <li>✔ Secure and transparent process</li>
              <li>✔ Opportunity to earn and grow</li>
            </ul>
          </div>

        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-14">
            Our Mission & Vision
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white p-10 rounded-2xl shadow-md">
              <h3 className="text-2xl font-semibold mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To empower users and providers by creating a trusted platform
                where work opportunities are accessible, fair, and rewarding
                for everyone.
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-md">
              <h3 className="text-2xl font-semibold mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To become a leading global work marketplace that enables people
                to connect, work, and earn without boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-14">
            Why Choose Us
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Simple & Fast
              </h3>
              <p className="text-gray-600">
                Post work or accept jobs in just a few clicks.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Trusted Platform
              </h3>
              <p className="text-gray-600">
                Transparency and trust are at the core of everything we do.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Earn with Freedom
              </h3>
              <p className="text-gray-600">
                Providers work on their own terms and earn confidently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10">
            Be part of a growing platform where opportunities meet talent.
          </p>
          <button className="bg-green-500 hover:bg-green-600 px-10 py-4 rounded-full text-lg font-semibold transition">
            Get Started Today
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-gray-400 text-center py-5">
        © {new Date().getFullYear()} Work Platform. All rights reserved.
      </footer>

    </main>
  );
}
