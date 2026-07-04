import Button from '@/ui/buttons/simple'
import CloseIcon from '@mui/icons-material/Close'

interface HeaderProps {
  name: string
  title?: string | null
  toggleDrawer: any
}

const Header = ({ name, title = null }: HeaderProps) => {
  return (
    <header className="flex flex-col border-b pt-4 px-4 pb-1">
      <div className="self-end">
        <Button size="small" variant="basic" startIcon={<CloseIcon />} drawer={name} />
      </div>
      {title && <span className="text-[0.625rem] uppercase">{title}</span>}
    </header>
  )
}

export default Header
