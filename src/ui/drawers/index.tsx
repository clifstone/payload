import MobileMenu from './mobileMenu'
import Account from './account'
import MiniCart from './miniCart'

const Drawers = () => {
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
