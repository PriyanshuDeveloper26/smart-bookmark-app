"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function BookmarkForm({ user }: any) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const addBookmark = async (e: any) => {
    e.preventDefault()

    await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id }
    ])

    setTitle("")
    setUrl("")
  }

  return (
    <form onSubmit={addBookmark} className="mb-6 space-y-3">
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="url"
        placeholder="URL"
        className="w-full p-2 border rounded"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Bookmark
      </button>
    </form>
  )
}
