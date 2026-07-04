type DrawerProps = {
  drawer: {
    title: string
    slug: string
    items?: any[]
  }
}

const Drawer = ({ drawer }: DrawerProps) => {
  console.log(drawer)
  return <div className="flex flex-col"></div>
}

export default Drawer
