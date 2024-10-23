import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ResponsiveNav from "../components/navigation/ResponsiveNav"
import { ThemeProvider } from 'next-themes'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AuthProvider } from '@/context/auth-context'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TravelApp",
  description: "Plan and manage your trips with ease",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <ResponsiveNav session={session} />
            <main className="container mx-auto px-4 py-8 flex-grow">
              <AuthProvider>
                {children}
              </AuthProvider>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
