import { Blocks } from './blocks'

export type MenuBlockItem = {
  id: string
  blockType: keyof typeof Blocks
  items?: MenuBlockItem[]
  [key: string]: any
}

export function RenderMenuBlocks({ items = [] }: { items?: MenuBlockItem[] }) {
  return (
    <>
      {items.map((item) => {
        const Block = Blocks[item.blockType]
        if (!Block) return null
        return <Block key={item.id} {...item} />
      })}
    </>
  )
}
