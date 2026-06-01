import Button from '@/ui/buttons/simple'
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone'

const AccountButtonBlock = () => {
  return (
    <div className="">
      <Button
        size="small"
        variant="basic"
        startIcon={<AccountCircleTwoToneIcon />}
        //drawer={'loginRegister'}
      />
    </div>
  )
}

export default AccountButtonBlock
