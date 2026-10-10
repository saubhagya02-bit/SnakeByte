<script setup lang="ts">
import type { Direction } from "../types";

defineEmits<{ move: [direction: Direction] }>();
</script>

<template>
  <div class="dpad" aria-label="Direction pad">
    <button
      type="button"
      class="up"
      aria-label="Up"
      @pointerdown.prevent="$emit('move', 'up')"
    >
      ▲
    </button>
    <button
      type="button"
      class="left"
      aria-label="Left"
      @pointerdown.prevent="$emit('move', 'left')"
    >
      ◀
    </button>
    <button
      type="button"
      class="right"
      aria-label="Right"
      @pointerdown.prevent="$emit('move', 'right')"
    >
      ▶
    </button>
    <button
      type="button"
      class="down"
      aria-label="Down"
      @pointerdown.prevent="$emit('move', 'down')"
    >
      ▼
    </button>
  </div>
</template>
