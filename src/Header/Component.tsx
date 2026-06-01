import clsx from 'clsx'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Blocks } from './blocks'

const Header = async () => {
  const headerData = await getCachedGlobal('header', 1)()

  const { sections = [] } = headerData || {}

  return (
    <header className="flex flex-row items-center justify-between w-full h-[53px] border-b bg-white/30 backdrop-blur-lg sticky top-0 py-2 px-4 z-[1]">
      <div className="flex items-center justify-between gap-8 w-full h-full">
        {sections?.map((section) => {
          const { fullWidth = false, alignment = 'left', components = [] } = section

          return (
            <div
              key={section.id}
              className={clsx(
                'flex gap-2 h-full',
                fullWidth && 'w-full',
                alignment === 'left' && 'justify-start',
                alignment === 'right' && 'justify-end',
                alignment === 'center' && 'justify-center',
              )}
            >
              {components?.map((component) => {
                const Block = Blocks[component.blockType]

                if (!Block) return null

                return <Block key={component.id} {...component} />
              })}
            </div>
          )
        })}
      </div>
    </header>
  )
}

export default Header
