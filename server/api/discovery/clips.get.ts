import { discoveryClips, featuredClip } from '../../utils/fixtures/discovery'

export default defineEventHandler(() => ({
  featured: featuredClip,
  clips: discoveryClips
}))
