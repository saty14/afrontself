import Link from "next/link";

export default function UserDashboardHome() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}
      {/* <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">
            User Dashboard
          </h1>
          <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
            Logout
          </button>
        </div>
      </header> */}

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* WELCOME */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back 👋
          </h2>
          <p className="text-gray-600">
            Manage your posted work and track progress easily.
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Total Jobs Posted</p>
            <h3 className="text-3xl font-bold mt-2">12</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Active Jobs</p>
            <h3 className="text-3xl font-bold mt-2 text-blue-600">4</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Completed Jobs</p>
            <h3 className="text-3xl font-bold mt-2 text-green-600">8</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Pending Approval</p>
            <h3 className="text-3xl font-bold mt-2 text-yellow-500">2</h3>
          </div>
        </div>

        {/* ACTION */}
        <div className="bg-blue-600 text-white p-10 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Need something done?
            </h3>
            <p className="opacity-90">
              Post a new job and find skilled providers instantly.
            </p>
          </div>
         <Link href={'/admin/add-work'} ><button className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition">
            Post New Job
          </button> </Link> 
        </div>

        {/* RECENT JOBS */}
        <div className="bg-white rounded-2xl shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">
              Recent Jobs
            </h3>
          </div>

          <div className="divide-y">
            {[
              { title: "Website Design", status: "Active" },
              { title: "Logo Creation", status: "Completed" },
              { title: "Content Writing", status: "Pending" },
            ].map((job, index) => (
              <div
                key={index}
                className="p-6 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-gray-500">
                    Posted 2 days ago
                  </p>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    job.status === "Active"
                      ? "bg-blue-100 text-blue-600"
                      : job.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
