import  Footer from "@/app/component/web/footer"

export default function Pricing() {
    const pricing = [
        {
            name: "Only offline",
            price: "free",
        },
        {
            name: "Online with offline",
            price: "4% of total order amount",
        },]
    return (<>
        <section className="py-28 px-6">

            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-20">
                    <h2 className="text-5xl font-bold">
                        Pricing Plans
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {pricing.map((plan, i) => (

                        <div
                            key={i}
                            className={`rounded-3xl p-10 border ${i === 1
                                ? "bg-orange-500 border-orange-400 scale-105"
                                : "bg-white/5 border-white/10"
                                }`}
                        >

                            <h3 className="text-3xl font-bold">
                                {plan.name}
                            </h3>

                            <div className="mt-8 text-6xl font-black">
                                {plan.price}
                            </div>

                            <ul className="space-y-4 mt-10 text-lg">
                                <li>✔ Unlimited Orders</li>
                                <li>✔ QR Ordering</li>
                                <li>✔ Analytics Dashboard</li>
                                {/* <li>✔ Online Payments</li> */}
                                <li>✔  Payments</li>
                            </ul>

                            <button className="mt-10 w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition">
                                Choose Plan
                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </section>
        <Footer />
    </>)
}