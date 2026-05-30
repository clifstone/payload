'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@/ui/buttons/simple'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      <Button size="small" variant="basic" startIcon={<CloseIcon />} />
    </nav>
  )
}
