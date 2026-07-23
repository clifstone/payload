import type { Field, UploadFieldSingleValidation } from 'payload'

const folderDescription = 'Store this asset in Site Settings / Favicons in the Media library.'

const validateICO: UploadFieldSingleValidation = async (value, { req }) => {
  if (!value) return 'The site favicon is required.'

  const media =
    typeof value === 'object' && value !== null
      ? value
      : await req.payload.findByID({
          collection: 'media',
          id: value as number,
          depth: 0,
          req,
        })

  const filename = 'filename' in media && typeof media.filename === 'string' ? media.filename : ''

  return filename.toLowerCase().endsWith('.ico')
    ? true
    : 'The required site favicon must be an .ico file.'
}

const favicon = (
  name: string,
  label: string,
  dimensions: string,
  options: {
    required?: boolean
    description?: string
    validate?: UploadFieldSingleValidation
  } = {},
): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
  label,
  required: options.required,
  validate: options.validate,
  admin: {
    description: [
      options.description,
      dimensions ? `Expected size: ${dimensions}.` : undefined,
      folderDescription,
    ]
      .filter(Boolean)
      .join(' '),
  },
})

export const faviconFields: Field[] = [
  favicon('favicon', 'Site Favicon', '16 × 16 px', {
    required: true,
    validate: validateICO,
    description: 'Required. Upload an .ico file.',
  }),
  favicon('favicon32', 'Site Favicon 32 × 32', '32 × 32 px'),
  favicon('favicon96', 'Site Favicon 96 × 96', '96 × 96 px'),
  favicon('faviconApple57', 'Apple Touch Icon 57 × 57', '57 × 57 px'),
  favicon('faviconApple60', 'Apple Touch Icon 60 × 60', '60 × 60 px'),
  favicon('faviconApple72', 'Apple Touch Icon 72 × 72', '72 × 72 px'),
  favicon('faviconApple76', 'Apple Touch Icon 76 × 76', '76 × 76 px'),
  favicon('faviconApple114', 'Apple Touch Icon 114 × 114', '114 × 114 px'),
  favicon('faviconApple120', 'Apple Touch Icon 120 × 120', '120 × 120 px'),
  favicon('faviconApple144', 'Apple Touch Icon 144 × 144', '144 × 144 px'),
  favicon('faviconApple152', 'Apple Touch Icon 152 × 152', '152 × 152 px'),
  favicon('faviconApple180', 'Apple Touch Icon 180 × 180', '180 × 180 px'),
  favicon('faviconAndroid', 'Android Icon 192 × 192', '192 × 192 px'),
  favicon('siteMicrosoftTileImage', 'Microsoft Tile Icon', '144 × 144 px', {
    description:
      'Used when the website is pinned to the Start menu or Start screen on Microsoft devices.',
  }),
]
