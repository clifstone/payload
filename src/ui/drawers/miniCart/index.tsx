'use client'
import { useDrawer } from '../../context/drawers'
import Wrapper from '../wrapper'

const MiniCart = () => {
  const { drawers } = useDrawer()
  const drawerName = 'miniCart'
  const theTitle = `Your Cart`
  //console.log('MobileMenu')
  return (
    <Wrapper name={drawerName} title={theTitle} isOpen={drawers[drawerName]} direction={'right'}>
      <div className=""></div>
    </Wrapper>
  )
}

export default MiniCart
