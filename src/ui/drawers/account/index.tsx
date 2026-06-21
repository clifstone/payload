'use client'
import { useDrawer } from '../../context/drawers'
import Wrapper from '../wrapper'

const Account = () => {
  const { drawers } = useDrawer()
  const drawerName = 'account'
  const theTitle = `Your Account`
  //console.log('MobileMenu')
  return (
    <Wrapper name={drawerName} title={theTitle} isOpen={drawers[drawerName]} direction={'right'}>
      <div className=""></div>
    </Wrapper>
  )
}

export default Account
