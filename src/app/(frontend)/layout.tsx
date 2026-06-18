import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import { cn } from '@/utilities/ui'
import { Footer } from '@/Footer/Component'
import Header from '@/Header/Component'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { getServerSideURL } from '@/utilities/getURL'
import Contexts from '@/ui/context'
import Drawers from '@/ui/drawers'
// import { Providers } from '@/providers'
// import { InitTheme } from '@/providers/Theme/InitTheme'
//import { AdminBar } from '@/components/AdminBar'

const baseFont = Urbanist({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { isEnabled } = await draftMode()

  return (
    <html lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body
        className={`${baseFont.className} antialiased text-neutral-700  text-pretty border-neutral-200`}
      >
        <Contexts>
          <div className="flex flex-col min-h-[100dvh]">
            <Header />
            <div className="flex-grow">{children}</div>
            <Footer />
          </div>
          <Drawers />
        </Contexts>
      </body>
    </html>
  )
}

export default RootLayout
