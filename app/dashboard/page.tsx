"use client"

import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/dashboard")
    })
  }, [])

  const login = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
    setLoading(false)
  }

  return (
    <div className="flex h-screen items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-10 w-full max-w-md text-center">

        <h1 className="text-3xl font-bold mb-3">Smart Bookmark</h1>
        <p className="text-gray-600 mb-8">
          Secure. Private. Realtime.
        </p>

        <button
          onClick={login}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:shadow-md transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

      </div>
    </div>
  )
}
