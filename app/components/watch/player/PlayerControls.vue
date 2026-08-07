<script setup lang="ts">
import {
  Captions,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw
} from '@lucide/vue'
import PlayerScrubber from './PlayerScrubber.vue'
import PlayerSettings from './PlayerSettings.vue'
import PlayerTooltip from './PlayerTooltip.vue'
import PlayerVolume from './PlayerVolume.vue'

/**
 * The control bar. Two rows: the scrubber spans the full width, then the
 * buttons — the arrangement viewers already know from YouTube.
 *
 * A live stream has no meaningful duration or seekable range, so the scrubber
 * and skip buttons are dropped there and the elapsed time is replaced by the
 * live indicator.
 */
defineProps<{ live: boolean }>()
</script>

<template>
  <media-controls class="player-controls">
    <PlayerScrubber v-if="!live" />

    <div class="player-row">
      <PlayerTooltip label="Play (k)">
        <media-play-button class="player-button">
          <Play data-when-on aria-hidden="true" />
          <Pause data-when-off aria-hidden="true" />
        </media-play-button>
      </PlayerTooltip>

      <template v-if="!live">
        <PlayerTooltip label="Back 10s (j)">
          <media-seek-button class="player-button" seconds="-10">
            <RotateCcw aria-hidden="true" />
          </media-seek-button>
        </PlayerTooltip>
        <PlayerTooltip label="Forward 10s (l)">
          <media-seek-button class="player-button" seconds="10">
            <RotateCw aria-hidden="true" />
          </media-seek-button>
        </PlayerTooltip>
      </template>

      <PlayerVolume />

      <div v-if="live" class="player-time">
        <media-live-button class="player-button" style="width: auto; padding-inline: 0.5rem">
          LIVE
        </media-live-button>
      </div>
      <div v-else class="player-time">
        <media-time type="current" />
        <span class="player-time-divider"> / </span>
        <media-time type="duration" />
      </div>

      <div class="player-spacer" />

      <PlayerTooltip label="Captions (c)">
        <media-caption-button class="player-button">
          <Captions aria-hidden="true" />
        </media-caption-button>
      </PlayerTooltip>

      <PlayerSettings />

      <PlayerTooltip label="Miniplayer (i)">
        <media-pip-button class="player-button">
          <PictureInPicture2 aria-hidden="true" />
        </media-pip-button>
      </PlayerTooltip>

      <PlayerTooltip label="Fullscreen (f)" placement="top end">
        <media-fullscreen-button class="player-button">
          <Minimize data-when-on aria-hidden="true" />
          <Maximize data-when-off aria-hidden="true" />
        </media-fullscreen-button>
      </PlayerTooltip>
    </div>
  </media-controls>
</template>
