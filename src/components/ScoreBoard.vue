<script setup lang="ts">
defineProps<{ score: number; best: number }>();
</script>

<template>
  <div class="scoreboard" aria-live="polite">
    <span>Score {{ score }}</span>
    <span>Best {{ best }}</span>
  </div>
</template>
