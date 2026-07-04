'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@/ui/buttons/simple'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems =
    data.sections
      ?.flatMap((section) => section.components || [])
      .filter((component) => component.blockType === 'navItems')
      .flatMap((component) => component.items || []) || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} />
      })}

      <Button size="small" variant="basic" startIcon={<CloseIcon />} />
    </nav>
  )
}
