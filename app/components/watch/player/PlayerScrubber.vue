<script setup lang="ts">
/**
 * The seek bar. Vidstack owns dragging, keyboard stepping and the ARIA
 * slider role; the three stacked tracks below are ours, driven by the
 * `--slider-progress` (buffered) and `--slider-fill` (played) variables it
 * sets on the host element.
 *
 * `media-slider-preview` is positioned by Vidstack from `--slider-pointer`,
 * so the hover timestamp follows the cursor without any JS here.
 */
</script>

<template>
  <media-time-slider class="player-scrubber">
    <div class="player-track" />
    <div class="player-track player-track-progress" />
    <div class="player-track player-track-fill" />
    <div class="player-thumb" />
    <media-slider-preview class="player-preview" no-clamp>
      <media-slider-value class="player-preview-value" />
    </media-slider-preview>
  </media-time-slider>
</template>
