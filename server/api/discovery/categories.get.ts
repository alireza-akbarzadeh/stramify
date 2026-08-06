import { selectCategorySummaries } from '../../utils/discovery'
import type { CategorySummary } from '#shared/types/discovery'

/** Category index — a derived view over `clips`, not a `categories` table. */
export default defineEventHandler(async (): Promise<CategorySummary[]> => {
  return await selectCategorySummaries()
})
