import type { Field } from 'payload'

const thumbnail = (name: string, label: string, dimensions: string): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
  label,
  admin: {
    description: `Expected size: ${dimensions}. Store this asset in Site Settings / Thumbnails in the Media library.`,
  },
})

export const thumbnailFields: Field[] = [
  thumbnail('siteThumbnailGoogle', 'Google Search Thumbnail', '1200 × 1200 px'),
  thumbnail('siteThumbnailOpenGraph', 'Open Graph Thumbnail', '1200 × 630 px'),
  thumbnail('siteThumbnailTwitterLarge', 'Twitter Large Thumbnail', '1200 × 630 px'),
  thumbnail('siteThumbnailTwitterSmall', 'Twitter Small Thumbnail', '120 × 120 px'),
  thumbnail('siteThumbnailLinkedIn', 'LinkedIn Thumbnail', '1200 × 627 px'),
]
