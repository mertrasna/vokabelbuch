"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link 
          href={session ? "/dashboard" : "/"} 
          className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">📚</span>
          <span className="hidden sm:inline gradient-text">Vokabelbuch</span>
          <span className="sm:hidden gradient-text">VB</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <Link href="/quiz">
                <Button variant="ghost" className="font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Quiz</span>
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <svg className="w-4 h-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-medium">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="shadow-md hover:shadow-lg transition-shadow">
                  Get Started Free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

