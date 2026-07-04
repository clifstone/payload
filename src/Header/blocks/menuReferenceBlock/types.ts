export type MenuBlockItem = {
  id: string
  blockType: 'menuLink' | 'submenu'
  label?: string
  url?: string
  link?: {
    type?: string
    newTab?: boolean | null
    url?: string
    label?: string
  }
  items?: MenuBlockItem[]
}
