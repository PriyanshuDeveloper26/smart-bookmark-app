"use client"

export default function Navbar({ logout }: any) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold tracking-tight">
        📌 Smart Bookmark
      </h1>

      <button
        onClick={logout}
        className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  )
}
