import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Difficulty, Direction, GameStatus, Point } from "../types";
import {
  GRID_SIZE,
  OPPOSITE,
  POINTS_PER_FOOD,
  createSnake,
  getInterval,
  hitsWall,
  nextHead,
  randomFood,
  samePoint,
} from "../utils/game";
import { useHighScore } from "./useHighScore";

const DIFFICULTY_KEY = "snake-vue:difficulty";
const MAX_QUEUED_TURNS = 2;

function loadDifficulty(): Difficulty {
  try {
    const saved = localStorage.getItem(DIFFICULTY_KEY);
    if (saved === "easy" || saved === "normal" || saved === "hard")
      return saved;
  } catch {
    /* ignore */
  }
  return "normal";
}

export function useSnakeGame() {
  const snake = ref<Point[]>(createSnake());
  const food = ref<Point | null>(randomFood(snake.value));
  const direction = ref<Direction>("right");
  const status = ref<GameStatus>("idle");
  const score = ref(0);
  const foodEaten = ref(0);
  const won = ref(false);
  const newRecord = ref(false);
  const difficulty = ref<Difficulty>(loadDifficulty());

  const { highScore, submit } = useHighScore(difficulty);

  // Buffered turns so quick key presses between ticks are not lost, and so
  // two fast presses (e.g. up then left) can't reverse the snake into itself.
  let turnQueue: Direction[] = [];
  let timer: number | undefined;

  const interval = computed(() =>
    getInterval(difficulty.value, foodEaten.value),
  );

  function clearTimer() {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  }

  function schedule() {
    clearTimer();
    timer = window.setTimeout(tick, interval.value);
  }

  function reset() {
    clearTimer();
    snake.value = createSnake();
    food.value = randomFood(snake.value);
    direction.value = "right";
    turnQueue = [];
    score.value = 0;
    foodEaten.value = 0;
    won.value = false;
    newRecord.value = false;
  }

  function finish(didWin: boolean) {
    clearTimer();
    status.value = "over";
    won.value = didWin;
    newRecord.value = submit(score.value);
  }

  function tick() {
    const turn = turnQueue.shift();
    if (turn) direction.value = turn;

    const head = nextHead(snake.value[0], direction.value);
    const eating = food.value !== null && samePoint(head, food.value);

    // When not eating, the tail moves out of the way, so it is safe to enter it.
    const body = eating ? snake.value : snake.value.slice(0, -1);

    if (hitsWall(head) || body.some((p) => samePoint(p, head))) {
      finish(false);
      return;
    }

    snake.value = [head, ...body];

    if (eating) {
      score.value += POINTS_PER_FOOD;
      foodEaten.value += 1;
      food.value = randomFood(snake.value);
      if (food.value === null) {
        finish(true); // board is full
        return;
      }
    }

    schedule();
  }

  function start() {
    reset();
    status.value = "running";
    schedule();
  }

  function pause() {
    if (status.value !== "running") return;
    clearTimer();
    status.value = "paused";
  }

  function resume() {
    if (status.value !== "paused") return;
    status.value = "running";
    schedule();
  }

  /** Space bar behaviour: start / pause / resume / play again. */
  function toggle() {
    if (status.value === "running") pause();
    else if (status.value === "paused") resume();
    else start();
  }

  function setDirection(next: Direction) {
    if (status.value !== "running") return;
    const last = turnQueue.length
      ? turnQueue[turnQueue.length - 1]
      : direction.value;
    if (next === last || next === OPPOSITE[last]) return;
    if (turnQueue.length < MAX_QUEUED_TURNS) turnQueue.push(next);
  }

  function setDifficulty(next: Difficulty) {
    if (status.value === "running") return;
    difficulty.value = next;
    try {
      localStorage.setItem(DIFFICULTY_KEY, next);
    } catch {
      /* ignore */
    }
    reset();
    status.value = "idle";
  }

  function onVisibilityChange() {
    if (document.hidden) pause();
  }

  onMounted(() =>
    document.addEventListener("visibilitychange", onVisibilityChange),
  );
  onBeforeUnmount(() => {
    clearTimer();
    document.removeEventListener("visibilitychange", onVisibilityChange);
  });

  return {
    // state
    snake,
    food,
    status,
    score,
    highScore,
    won,
    newRecord,
    difficulty,
    gridSize: GRID_SIZE,
    // actions
    start,
    pause,
    resume,
    toggle,
    setDirection,
    setDifficulty,
  };
}
