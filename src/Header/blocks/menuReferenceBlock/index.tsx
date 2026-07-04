'use client'

import { useId, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useScreens } from '@/hooks/screens'
import Button from '@/ui/buttons/simple'
import PanelMenu from '@/components/menus/panelMenu'

let activeMenuId: string | null = null
const listeners = new Set<(id: string | null) => void>()

const setActiveMenuId = (id: string | null) => {
  activeMenuId = id
  listeners.forEach((listener) => listener(id))
}

const BlocksMenu = ({ menu }: any) => {
  const id = useId()
  const buttonRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLButtonElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  const [openId, setOpenId] = useState<string | null>(activeMenuId)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [renderMenu, setRenderMenu] = useState(false)

  const { large } = useScreens()
  const menuOpen = openId === id

  useEffect(() => {
    listeners.add(setOpenId)

    return () => {
      listeners.delete(setOpenId)
    }
  }, [])

  useEffect(() => {
    if (large) setMounted(true)
  }, [large])

  useEffect(() => {
    if (menuOpen) {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()

      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })

      setRenderMenu(true)
      return
    }

    if (!tl.current) return

    tl.current.eventCallback('onReverseComplete', () => {
      setRenderMenu(false)
      tl.current?.kill()
      tl.current = null
    })

    tl.current.reverse()
  }, [menuOpen])

  useEffect(() => {
    if (!renderMenu || !menuRef.current || !backdropRef.current || !menuOpen) {
      return
    }

    tl.current?.kill()

    tl.current = gsap
      .timeline({ paused: true })
      .fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.15 })
      .fromTo(
        menuRef.current,
        {
          y: '-100%',
        },
        {
          y: 0,
          duration: 0.15,
          ease: 'power2.out',
        },
        '<',
      )

    tl.current.play()
  }, [renderMenu, menuOpen])

  useEffect(() => {
    return () => {
      tl.current?.kill()
    }
  }, [])

  const toggleMenu = () => {
    setActiveMenuId(menuOpen ? null : id)
  }

  const closeMenu = () => {
    setActiveMenuId(null)
  }

  if (!menu || typeof menu === 'number' || !mounted) return null

  const title = menu.title || 'Blocks Menu'

  return (
    <>
      <div ref={buttonRef}>
        <Button variant="basic" onClick={toggleMenu}>
          {title}
        </Button>
      </div>

      {renderMenu &&
        createPortal(
          <>
            <button
              ref={backdropRef}
              onClick={closeMenu}
              className="fixed top-[54px] left-0 bottom-0 right-0 bg-black/80"
            />

            <div
              ref={menuRef}
              className="absolute w-[375px] max-h-[calc(100dvh-16rem)] overflow-hidden bg-white border-x border-b rounded-b-xl z-[1]"
              style={{
                top: '54px',
                left: position.left,
              }}
            >
              <PanelMenu menu={menu} />
            </div>
          </>,
          document.body,
        )}
    </>
  )
}

export default BlocksMenu
