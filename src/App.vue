<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import type { Direction } from "./types";
import { useSnakeGame } from "./composables/useSnakeGame";
import GameBoard from "./components/GameBoard.vue";
import GameOverlay from "./components/GameOverlay.vue";
import ScoreBoard from "./components/ScoreBoard.vue";
import DifficultySelect from "./components/DifficultySelect.vue";
import TouchControls from "./components/TouchControls.vue";

const {
  snake,
  food,
  status,
  score,
  highScore,
  won,
  newRecord,
  difficulty,
  start,
  toggle,
  setDirection,
  setDifficulty,
} = useSnakeGame();

const KEY_TO_DIRECTION: Record<string, Direction> = {
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
};

function onKeyDown(e: KeyboardEvent) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  const key = e.key.toLowerCase();

  const direction = KEY_TO_DIRECTION[key];

  if (direction) {
    e.preventDefault();

    if (status.value === "idle") {
      start();
    }

    setDirection(direction);
    return;
  }

  if (key === " " || key === "p") {
    const el = e.target as HTMLElement | null;

    if (key === " " && el?.closest("button, select, input")) return;

    e.preventDefault();
    toggle();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <main class="device">
    <h1 class="title">Snake</h1>

    <section class="screen">
      <ScoreBoard :score="score" :best="highScore" />

      <GameBoard :snake="snake" :food="food" @swipe="setDirection">
        <GameOverlay
          v-if="status !== 'running'"
          :status="status"
          :score="score"
          :won="won"
          :new-record="newRecord"
          @action="toggle"
        />
      </GameBoard>
    </section>

    <DifficultySelect
      :model-value="difficulty"
      :disabled="status === 'running'"
      @update:model-value="setDifficulty"
    />

    <TouchControls @move="setDirection" />

    <p class="hint">Arrow keys or WASD to steer. Space to pause.</p>
  </main>
</template>
