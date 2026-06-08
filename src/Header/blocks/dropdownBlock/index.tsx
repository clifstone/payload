import Link from 'next/link'

const DropdownBlock = async ({ menus, buttonText }: any) => {
  //console.log(menus)
  return (
    <div className="flex-grow flex items-center">
      <button type="button" className="">
        {buttonText}
      </button>
      <nav className="">
        {menus.map((menu: any, idx: number) => (
          <ul key={idx} className="">
            {menu.links.map((link: any) => {
              console.log(link)
              return (
                <li key={link.id} className="">
                  <Link href="#">der</Link>
                </li>
              )
            })}
          </ul>
        ))}
      </nav>
    </div>
  )
}

export default DropdownBlock
