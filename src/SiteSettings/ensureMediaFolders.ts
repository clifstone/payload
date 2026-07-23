import type { Payload } from 'payload'

const childFolderNames = ['Logos', 'Thumbnails', 'Favicons'] as const

export const ensureSiteSettingsMediaFolders = async (payload: Payload): Promise<void> => {
  const existingParents = await payload.find({
    collection: 'payload-folders',
    depth: 0,
    limit: 1,
    where: {
      and: [
        { name: { equals: 'Site Settings' } },
        { folder: { exists: false } },
        { folderType: { contains: 'media' } },
      ],
    },
  })

  const parent =
    existingParents.docs[0] ??
    (await payload.create({
      collection: 'payload-folders',
      data: {
        name: 'Site Settings',
        folderType: ['media'],
      },
    }))

  for (const name of childFolderNames) {
    const existing = await payload.find({
      collection: 'payload-folders',
      depth: 0,
      limit: 1,
      where: {
        and: [
          { name: { equals: name } },
          { folder: { equals: parent.id } },
          { folderType: { contains: 'media' } },
        ],
      },
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'payload-folders',
        data: {
          name,
          folder: parent.id,
          folderType: ['media'],
        },
      })
    }
  }
}
