import './globals.css'

export const metadata = {
  title: 'Smart Bookmark App',
  description: 'Private realtime bookmark manager'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 text-gray-800">
        {children}
      </body>
    </html>
  )
}
