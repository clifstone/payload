import Button from '@/ui/buttons/simple'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

const MiniCartButtonBlock = () => {
  return (
    <div className="">
      <Button
        size="small"
        variant="basic"
        startIcon={<ShoppingCartOutlinedIcon />}
        //drawer={'loginRegister'}
      />
    </div>
  )
}

export default MiniCartButtonBlock
