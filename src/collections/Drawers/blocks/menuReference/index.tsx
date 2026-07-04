import PanelMenu from '@/components/menus/panelMenu'

const MenuReference = ({ menu }: any) => {
  if (!menu || typeof menu === 'number') return null

  const title = menu.title || 'Menu Reference'

  return (
    <div className="w-full max-w-[375px] border-b">
      <PanelMenu menu={menu} />
    </div>
  )
}

export default MenuReference
