import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Sanctum',
  description: 'A mystical realm of AI development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} gradient-dark antialiased`}>
        <div className="relative min-h-screen">
          {/* Mystical Background Elements */}
          <div className="fixed inset-0 z-0">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-500/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/5 blur-[100px] rounded-full" />
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Floating Runes */}
          <div className="fixed top-10 right-10 w-20 h-20 rotating-rune opacity-20">
            {/* We'll add SVG runes here */}
          </div>
          <div className="fixed bottom-10 left-10 w-16 h-16 rotating-rune opacity-20" style={{ animationDirection: 'reverse' }}>
            {/* We'll add SVG runes here */}
          </div>
        </div>
      </body>
    </html>
  )
}
