import { z } from 'zod'

export const onboardingSchema = z.object({
  cuisines: z.array(z.string()).min(1, 'Pick at least one cuisine you love'),
  budgetTier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  dietaryNeeds: z.array(z.string()),
  homeCity: z.enum(['Tampa', 'Nashville'], { message: 'Choose your home city' }),
})

export type OnboardingValues = z.infer<typeof onboardingSchema>

/** Which fields each step is responsible for (used to validate one step at a time). */
export const STEP_FIELDS: (keyof OnboardingValues)[][] = [
  ['cuisines'],
  ['budgetTier', 'dietaryNeeds'],
  ['homeCity'],
]
