import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZTN Store & Marketplace',
  description: 'Buy, sell, discover and grow with ZTN.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
