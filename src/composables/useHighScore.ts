import { computed, ref, type Ref } from "vue";
import type { Difficulty } from "../types";

const STORAGE_KEY = "snake-vue:high-scores";
type Scores = Record<Difficulty, number>;

const EMPTY: Scores = { easy: 0, normal: 0, hard: 0 };

function load(): Scores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

function save(scores: Scores) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {}
}

export function useHighScore(difficulty: Ref<Difficulty>) {
  const scores = ref<Scores>(load());
  const highScore = computed(() => scores.value[difficulty.value]);

  function submit(score: number): boolean {
    if (score <= highScore.value) return false;
    scores.value = { ...scores.value, [difficulty.value]: score };
    save(scores.value);
    return true;
  }

  return { highScore, submit };
}
