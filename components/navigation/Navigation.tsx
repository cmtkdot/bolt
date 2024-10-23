import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "../../lib/utils"

const Navigation = () => {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/trips', label: 'Trips' },
    { href: '/trips/new', label: 'New Trip' },
    { href: '/itinerary', label: 'Itinerary' },
    { href: '/activity', label: 'Activities' },
    { href: '/activity-recommendations', label: 'Recommendations' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/currency', label: 'Currency' },
    { href: '/weather', label: 'Weather' },
    { href: '/profile', label: 'Profile' },
    { href: '/login', label: 'Login' },
    { href: '/signup', label: 'Sign Up' },
  ]

  return (
    <nav className="flex flex-wrap space-x-4 p-4 bg-background shadow-md">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export default Navigation
