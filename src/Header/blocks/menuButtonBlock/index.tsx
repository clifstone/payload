import Button from '@/ui/buttons/simple'
import MenuIcon from '@mui/icons-material/Menu'

const MenuButtonBlock = () => {
  return (
    <div className="">
      <Button size="small" variant="basic" startIcon={<MenuIcon />} drawer={'mobileMenu'} />
    </div>
  )
}

export default MenuButtonBlock
