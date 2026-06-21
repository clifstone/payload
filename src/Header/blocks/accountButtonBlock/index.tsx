import Button from '@/ui/buttons/simple'
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone'

const AccountButtonBlock = () => {
  return (
    <div className="">
      <Button
        size="small"
        variant="basic"
        startIcon={<AccountCircleTwoToneIcon />}
        drawer={'account'}
      />
    </div>
  )
}

export default AccountButtonBlock
