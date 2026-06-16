import Link from 'next/link'

const MenuLink = ({ link }: any) => {
  const { type: TYPE = null, newTab: NEWTAB = null, url: URL = null, label: LABEL } = link || {}

  return (
    <>
      {TYPE === 'custom' ? (
        <Link href={URL && URL} className="" target={NEWTAB ? '_blank' : undefined}>
          {LABEL ? LABEL : 'MENU LINK'}
        </Link>
      ) : undefined}
    </>
  )
}

export default MenuLink
