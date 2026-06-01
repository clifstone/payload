import { CMSLink } from '@/components/Link'

const NavItemsBlock = ({ items }: any) => {
  if (!items?.length) return null

  return (
    <nav className="flex gap-3 items-center">
      {items.map((item: any) => (
        <CMSLink key={item.id} {...item.link} />
      ))}
    </nav>
  )
}

export default NavItemsBlock
