export type MenuBlockItem = {
  id: string
  blockType: 'menuLink' | 'submenu'
  title?: string
  link?: {
    type?: string
    newTab?: boolean | null
    url?: string
    label?: string
  }
  items?: MenuBlockItem[]
}
