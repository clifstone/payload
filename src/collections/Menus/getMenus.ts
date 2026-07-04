export const getMenus = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/menus?depth=2`, {
    next: {
      tags: ['menus'],
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch menus')
  }

  const data = await res.json()

  return data.docs || []
}

export const getMenu = async (slug: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/menus?where[slug][equals]=${slug}&depth=2`,
    {
      next: {
        tags: [`menu-${slug}`],
      },
    },
  )

  const data = await res.json()

  return data.docs?.[0] || null
}
