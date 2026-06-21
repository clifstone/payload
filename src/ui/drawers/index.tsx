import MobileMenu from './mobileMenu'
import Account from './account'
import MiniCart from './miniCart'

const Drawers = () => {
  console.log('drawers')
  return (
    <div className="relative z-[2]">
      <>
        <MobileMenu />
        <Account />
        <MiniCart />
      </>
    </div>
  )
}

export default Drawers
