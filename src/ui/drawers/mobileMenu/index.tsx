'use client'
import { useDrawer } from '@/ui/context/drawers'
import Wrapper from '@/ui/drawers/wrapper'

const MobileMenu = () => {
  const { drawers } = useDrawer()
  const drawerName = 'mobileMenu'
  const theTitle = `Main Menu`
  console.log('MobileMenu')
  return (
    <Wrapper name={drawerName} title={theTitle} isOpen={drawers[drawerName]} direction={'left'}>
      <div className=""></div>
    </Wrapper>
  )
}

export default MobileMenu
