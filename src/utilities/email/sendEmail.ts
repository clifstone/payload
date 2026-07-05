import config from '@payload-config'
import { getPayload } from 'payload'

type TemplateData = Record<string, unknown>

export type SendEmailArgs = {
  data?: TemplateData
  subject: string
  template: string
  to: string
}

const sanitizeData = (data: TemplateData = {}): TemplateData => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => {
      if (typeof value !== 'string') return true
      return value.length <= 500
    }),
  )
}

export const sendEmail = async ({ data, subject, template, to }: SendEmailArgs): Promise<void> => {
  const payload = await getPayload({ config })

  payload.logger.info(
    {
      data: sanitizeData(data),
      mode: process.env.NODE_ENV || 'development',
      subject,
      template,
      to,
    },
    'Placeholder email',
  )
}
