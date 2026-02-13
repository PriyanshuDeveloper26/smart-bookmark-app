"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function BookmarkForm({ user, onBookmarkAdded }: any) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const addBookmark = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Adding bookmark:', { title, url, user_id: user.id })
      
      const { data, error } = await supabase.from("bookmarks").insert([
        { title, url, user_id: user.id }
      ]).select()

      if (error) {
        console.error('Error adding bookmark:', error)
        alert('Error adding bookmark: ' + error.message)
        return
      }

      console.log('Bookmark added successfully:', data)
      setTitle("")
      setUrl("")
      
      // Call parent callback if provided
      if (onBookmarkAdded) {
        onBookmarkAdded()
      }
      
      // Force a refresh as backup
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('bookmark-added', { detail: data }))
      }, 100)
      
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={addBookmark} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Title
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 placeholder-white/60 text-white"
          placeholder="Enter bookmark title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          URL
        </label>
        <input
          type="url"
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 placeholder-white/60 text-white"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <button
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-soft hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Bookmark
          </span>
        )}
      </button>
    </form>
  )
}
