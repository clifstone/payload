'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useDrawer } from '@/ui/context/drawers'
import Header from './header'
import clsx from 'clsx'

interface WrapperProps {
  name: string
  title?: string | null
  isOpen?: boolean
  maxWidth?: string
  direction?: string
  children?: React.ReactNode
}

const Wrapper = ({
  name,
  isOpen,
  title,
  maxWidth = 'small:max-w-[375px]',
  direction = 'left',
  children,
}: WrapperProps) => {
  const { toggleDrawer } = useDrawer()

  const drawerRef = useRef<HTMLElement | null>(null)
  const foreWrapperRef = useRef<HTMLElement | null>(null)
  const backdropRef = useRef<HTMLDivElement | null>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  const [shouldRender, setShouldRender] = useState(isOpen)
  const [maxW, setMaxWidth] = useState(maxWidth)

  const xPos = direction === 'left' ? '-100%' : '100%'

  useEffect(() => {
    if (!shouldRender) return

    if (!foreWrapperRef.current || !backdropRef.current) return

    gsap.set(foreWrapperRef.current, { x: xPos })
    gsap.set(backdropRef.current, { opacity: 0 })

    tl.current = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        setShouldRender(false)
      },
    })

    tl.current.to(foreWrapperRef.current, { x: '0%', duration: 0.25, ease: 'power2.out' }, 0.15)

    tl.current.to(backdropRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' }, 0)
  }, [shouldRender])

  useEffect(() => {
    if (isOpen) {
      if (!shouldRender) {
        setShouldRender(true)
      } else if (tl.current) {
        tl.current.play()
      }
    } else if (shouldRender && tl.current) {
      tl.current.reverse()
    }
  }, [isOpen, shouldRender])

  const handleToggle = () => {
    toggleDrawer(name)
  }

  if (!shouldRender) return null

  return (
    <aside
      ref={drawerRef}
      id={`drawer-${name}`}
      className={clsx(`fixed inset-0 w-full h-full isolate z-[1001]`, {
        'flex justify-end': direction !== 'left',
      })}
    >
      <section ref={foreWrapperRef} className={clsx('flex flex-col w-full h-full bg-white', maxW)}>
        <Header toggleDrawer={toggleDrawer} name={name} title={title} />
        <div className="flex-grow flex overflow-y-auto">
          <div className="flex-grow flex">{children}</div>
        </div>
      </section>

      <div
        ref={backdropRef}
        className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur-lg z-[-1]"
        onClick={handleToggle}
      />
    </aside>
  )
}

export default Wrapper
