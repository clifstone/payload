'use client'
import { useDrawer } from '@/ui/context/drawers'
import Wrapper from '@/ui/drawers/wrapper'
import { Blocks } from '@/collections/Drawers/blocks'

const MobileMenu = () => {
  const { drawers, getDrawerBySlug } = useDrawer()
  const drawerName = 'mobileMenu'
  const theTitle = `Main Menu`

  const getBlocks = getDrawerBySlug('main-menu')
  const blocks = getBlocks?.items

  type BlockType = keyof typeof Blocks

  return (
    <Wrapper name={drawerName} title={theTitle} isOpen={drawers[drawerName]} direction={'left'}>
      <div className="w-full">
        {blocks?.map((block: any) => {
          const blockType = block.blockType as BlockType
          const Block = Blocks[blockType]
          if (!Block) return null
          return <Block key={block.id} {...block} />
        })}
      </div>
    </Wrapper>
  )
}

export default MobileMenu
