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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl transform transition-all duration-500 hover:rotate-12 hover:scale-110">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent transform transition-all duration-500 hover:scale-110">
              Smart Bookmark
            </h1>
            <p className="text-xl text-gray-300 font-medium">
              Secure. Private. Realtime.
            </p>
          </div>

          {/* Main Glass Card */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up transform transition-all duration-700 hover:scale-105 hover:bg-white/15">
            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center group">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-blue-500/30">
                  <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-300 font-medium group-hover:text-white transition-colors">Secure</span>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-indigo-500/30">
                  <svg className="w-7 h-7 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-300 font-medium group-hover:text-white transition-colors">Private</span>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-purple-500/30">
                  <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7m0 0v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-300 font-medium group-hover:text-white transition-colors">Realtime</span>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={login}
              disabled={loading}
              className="w-full group relative overflow-hidden bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-4 transition-all duration-500 hover:bg-white/20 hover:border-white/50 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full overflow-hidden transform transition-all duration-300 group-hover:rotate-180">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-full h-full object-cover"
                    alt="Google"
                  />
                </div>
                <span className="font-bold text-white text-lg group-hover:text-gray-200 transition-colors">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in with Google"
                  )}
                </span>
              </div>
            </button>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                No credit card required • Free forever • Your data stays private
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
