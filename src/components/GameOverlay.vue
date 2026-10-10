<script setup lang="ts">
import { computed } from "vue";
import type { GameStatus } from "../types";

const props = defineProps<{
  status: GameStatus;
  score: number;
  won: boolean;
  newRecord: boolean;
}>();

defineEmits<{ action: [] }>();

const content = computed(() => {
  switch (props.status) {
    case "paused":
      return {
        title: "Paused",
        body: "Press Space to keep going.",
        button: "Resume",
      };
    case "over":
      return {
        title: props.won ? "You filled the board" : "Game over",
        body: props.newRecord
          ? `New best: ${props.score} points.`
          : `You scored ${props.score} points.`,
        button: "Play again",
      };
    default:
      return {
        title: "Ready?",
        body: "Eat the food. Avoid the wallls and your own tail.",
        button: "Start game",
      };
  }
});
</script>

<template>
  <div class="overlay" role="status">
    <h2>{{ content.title }}</h2>
    <p>{{ content.body }}</p>
    <button type="button" class="btn" @click="$emit('action')">
      {{ content.button }}
    </button>
  </div>
</template>
