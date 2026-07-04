export const getDrawers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/drawers?depth=2`, {
    next: {
      tags: ['drawers'],
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch drawers')
  }

  const data = await res.json()

  return data.docs || []
}

export const getDrawer = async (slug: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/drawers?where[slug][equals]=${slug}&depth=2`,
    {
      next: {
        tags: [`drawer-${slug}`],
      },
    },
  )

  const data = await res.json()

  return data.docs?.[0] || null
}
