import { z } from 'zod'

/** One schema for both modes; the name is only required when creating an account (see LoginPage). */
export const authSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Use at least 6 characters'),
  name: z.string().trim().max(60, 'Keep it under 60 characters'),
})

export type AuthValues = z.infer<typeof authSchema>
