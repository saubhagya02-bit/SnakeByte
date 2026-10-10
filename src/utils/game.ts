import type { Difficulty, Direction, Point } from "../types";

export const GRID_SIZE = 20;
export const POINTS_PER_FOOD = 10;

export const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export const BASE_INTERVAL: Record<Difficulty, number> = {
  easy: 160,
  normal: 120,
  hard: 85,
};

export const MIN_INTERVAL = 50;
/** The snake speeds up every N foods eaten, by this many ms.*/
export const SPEEDUP_EVERY = 5;
export const SPEEDUP_STEP = 8;

export function getInterval(difficulty: Difficulty, foodEaten: number): number {
  const faster = Math.floor(foodEaten / SPEEDUP_EVERY) * SPEEDUP_STEP;
  return Math.max(MIN_INTERVAL, BASE_INTERVAL[difficulty] - faster);
}

export function createSnake(): Point[] {
  const y = Math.floor(GRID_SIZE / 2);
  return [
    { x: 4, y },
    { x: 3, y },
    { x: 2, y },
  ];
}

export function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function nextHead(head: Point, direction: Direction): Point {
  const v = VECTORS[direction];
  return { x: head.x + v.x, y: head.y + v.y };
}

export function hitsWall(p: Point): boolean {
  return p.x < 0 || p.y < 0 || p.x >= GRID_SIZE || p.y >= GRID_SIZE;
}

export function randomFood(snake: Point[]): Point | null {
  const taken = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free: Point[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)];
}
