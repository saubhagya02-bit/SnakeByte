<script setup lang="ts">
import type { Direction, Point } from "../types";
import { GRID_SIZE } from "../utils/game";

defineProps<{
  snake: Point[];
  food: Point | null;
}>();

const emit = defineEmits<{ swipe: [direction: Direction] }>();

const SWIPE_THRESHOLD = 24;
let startX = 0;
let startY = 0;

function onTouchStart(e: TouchEvent) {
  const t = e.changedTouches[0];
  startX = t.clientX;
  startY = t.clientY;
}

function onTouchEnd(e: TouchEvent) {
  const t = e.changedTouches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;
  if (Math.abs(dx) > Math.abs(dy)) emit("swipe", dx > 0 ? "right" : "left");
  else emit("swipe", dy > 0 ? "down" : "up");
}

const cell = (p: Point) => ({ gridColumn: p.x + 1, gridRow: p.y + 1 });
</script>

<template>
  <div
    class="board"
    :style="{ '--cols': GRID_SIZE }"
    role="img"
    :aria-label="`Snake board, snake length ${snake.length}`"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div
      v-for="(segment, i) in snake"
      :key="i"
      class="segment"
      :class="{ head: i === 0 }"
      :style="cell(segment)"
    />
    <div v-if="food" class="food" :style="cell(food)" />
    <slot />
  </div>
</template>
