export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatCount(count: number): string {
  if (count < 1000) return String(count)
  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
}

/**
 * How long a live session has been running, e.g. `"9m"`, `"3h 17m"`.
 * Unlike `formatAge` this never says "ago" — it's an uptime, and it stays
 * minute-precise past the hour because live viewers read it as "how much
 * have I missed".
 */
export function formatUptime(startedAt: Date): string {
  const minutes = Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 60_000))
  if (minutes < 60) return `${minutes}m`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export function formatAge(createdAt: Date): string {
  const diffMs = Date.now() - createdAt.getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'Now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
