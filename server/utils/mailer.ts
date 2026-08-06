import { logger } from './logger'

interface Mail {
  to: string
  subject: string
  text: string
}

/**
 * Transactional email. No provider is wired yet (none has been chosen — see
 * PROGRESS.md), so in development the message is logged and the flow stays
 * usable end-to-end. In production an unconfigured mailer throws rather than
 * silently dropping a password-reset mail, which would look like success to
 * the user while locking them out.
 */
export async function sendMail({ to, subject, text }: Mail): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('No email provider configured — cannot send transactional mail.')
  }
  logger.info({ to, subject, text }, 'DEV MAIL (not delivered — no provider configured)')
}
