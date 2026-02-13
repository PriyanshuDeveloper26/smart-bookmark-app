import LoginButton from "@/components/LoginButton"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Smart Bookmark App
        </h1>

        <p className="text-gray-500">
          Save and manage your favorite links securely.
        </p>

        <LoginButton />
      </div>
    </main>
  )
}
