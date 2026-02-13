"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"
import Toast from "@/components/Toast"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, recentActivity: 0 })
  const [refreshKey, setRefreshKey] = useState(0)
  const [showWelcomeToast, setShowWelcomeToast] = useState(false)
  const [showAddToast, setShowAddToast] = useState(false)
  const [showDeleteToast, setShowDeleteToast] = useState(false)
  const router = useRouter()

  const fetchStats = async () => {
    if (!user) return
    
    const { count: totalCount } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: thisWeekCount } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString())

    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    const { count: recentActivityCount } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .gte("created_at", twentyFourHoursAgo.toISOString())

    setStats({
      total: totalCount || 0,
      thisWeek: thisWeekCount || 0,
      recentActivity: recentActivityCount || 0,
    })
  }

  const handleBookmarkAdded = () => {
    console.log("Bookmark added, triggering refresh")
    setRefreshKey(prev => prev + 1)
    setShowAddToast(true)
    setTimeout(() => setShowAddToast(false), 3000)
    fetchStats()
  }

  const handleBookmarkDeleted = () => {
    console.log("Bookmark deleted, triggering refresh")
    setRefreshKey(prev => prev + 1)
    setShowDeleteToast(true)
    setTimeout(() => setShowDeleteToast(false), 3000)
    fetchStats()
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/")
      else {
        setUser(data.user)
        
        // Check if welcome toast has been shown in this session
        const welcomeShownKey = `welcome-shown-${data.user.id}`
        const hasSeenWelcome = localStorage.getItem(welcomeShownKey)
        
        if (!hasSeenWelcome) {
          setShowWelcomeToast(true)
          localStorage.setItem(welcomeShownKey, 'true')
        }
      }
    })
  }, [])

  useEffect(() => {
    if (!user) return

    fetchStats()

    const channel = supabase
      .channel("dashboard-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Dashboard stats update received:", payload)
          fetchStats()
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Dashboard real-time subscription active!")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Welcome Toast */}
      {showWelcomeToast && user && (
        <Toast
          message={`Welcome back, ${user.email?.split("@")[0]}! 👋`}
          type="info"
          duration={4000}
        />
      )}

      {/* Add Bookmark Toast */}
      {showAddToast && (
        <Toast
          message="Bookmark added successfully! 🎉"
          type="success"
          duration={3000}
        />
      )}

      {/* Delete Bookmark Toast */}
      {showDeleteToast && (
        <Toast
          message="Bookmark deleted successfully! 🗑️"
          type="error"
          duration={3000}
        />
      )}

      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-soft transform transition-all duration-300 hover:rotate-12 hover:scale-110">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">📌 Smart Bookmark</h1>
                    <p className="text-sm text-gray-300">
                      Welcome back,{" "}
                      <span className="text-blue-300 font-semibold">
                        {user.email?.split("@")[0]}
                      </span>
                      !
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 hover:text-red-200 transition-all duration-300 font-medium text-sm border border-red-500/30 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total Bookmarks</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-300 text-sm font-medium">This Week</p>
                  <p className="text-3xl font-bold text-white">{stats.thisWeek}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Recent Activity</p>
                  <p className="text-3xl font-bold text-white">{stats.recentActivity}</p>
                  <p className="text-xs text-purple-400 mt-1">Last 24 hours</p>
                </div>
                <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7m0 0v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Bookmark
                </h2>
                <BookmarkForm user={user} onBookmarkAdded={handleBookmarkAdded} />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Your Bookmarks
                  <span className="ml-2 px-2 py-1 bg-blue-500/30 text-blue-200 text-xs font-medium rounded-full">
                    {stats.total}
                  </span>
                </h2>
                <BookmarkList
                  key={refreshKey}
                  user={user}
                  onBookmarkDeleted={handleBookmarkDeleted}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
