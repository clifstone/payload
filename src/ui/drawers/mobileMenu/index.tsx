'use client'
import { useDrawer } from '../../context/drawers'
import Wrapper from '../wrapper'

const MobileMenu = () => {
  const { drawers } = useDrawer()
  const drawerName = 'mobileMenu'
  const theTitle = `Your Cart`
  console.log('MobileMenu')
  return (
    <Wrapper name={drawerName} isOpen={drawers[drawerName]} direction={'left'}>
      <div className="derpenstein"></div>
    </Wrapper>
  )
}

export default MobileMenu
