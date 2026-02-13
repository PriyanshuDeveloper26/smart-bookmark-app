"use client"

import { supabase } from "@/lib/supabaseClient"

export default function LoginButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
    >
      Sign in with Google
    </button>
  )
}
