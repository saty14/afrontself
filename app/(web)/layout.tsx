import  Header from "@/app/component/web/header"

export default function WebLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-gray-100 ">
      <Header />
      {children}
      </main>
  )
}