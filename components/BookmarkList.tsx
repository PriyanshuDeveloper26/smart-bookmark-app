"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function BookmarkList({ user, onBookmarkDeleted }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchBookmarks()

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time update received:', payload)
          fetchBookmarks()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time subscription active!')
        } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
          console.log('Real-time subscription lost, retrying...')
        }
      })

    // Backup event listeners
    const handleBookmarkAdded = () => {
      console.log('Backup event listener triggered for add')
      fetchBookmarks()
    }
    
    const handleBookmarkDeleted = () => {
      console.log('Backup event listener triggered for delete')
      fetchBookmarks()
    }
    
    window.addEventListener('bookmark-added', handleBookmarkAdded)
    window.addEventListener('bookmark-deleted', handleBookmarkDeleted)

    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener('bookmark-added', handleBookmarkAdded)
      window.removeEventListener('bookmark-deleted', handleBookmarkDeleted)
    }
  }, [user])

  const deleteBookmark = async (id: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`)
    if (!confirmed) return
    
    try {
      console.log('Deleting bookmark:', { id, title })
      
      const { error } = await supabase.from("bookmarks").delete().eq("id", id)

      if (error) {
        console.error('Error deleting bookmark:', error)
        alert('Error deleting bookmark: ' + error.message)
        return
      }

      console.log('Bookmark deleted successfully')
      
      // Call parent callback if provided
      if (onBookmarkDeleted) {
        onBookmarkDeleted()
      }
      
      // Force a refresh as backup
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('bookmark-deleted', { detail: { id, title } }))
      }, 100)
      
    } catch (err) {
      console.error('Unexpected error during delete:', err)
      alert('Unexpected error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm font-medium">Loading bookmarks...</p>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium mb-2">No bookmarks yet</p>
        <p className="text-gray-400 text-sm">Add your first bookmark to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark, index) => (
        <div
          key={bookmark.id}
          className="group bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 hover:shadow-medium transition-all duration-200 animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate group-hover:text-blue-600"
              >
                {bookmark.title}
              </a>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors truncate block mt-1"
              >
                {bookmark.url}
              </a>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">
                  {new Date(bookmark.created_at).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-300">•</span>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit
                </a>
              </div>
            </div>
            
            <button
              onClick={() => deleteBookmark(bookmark.id, bookmark.title)}
              className="flex-shrink-0 w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center justify-center group"
              title="Delete bookmark"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
