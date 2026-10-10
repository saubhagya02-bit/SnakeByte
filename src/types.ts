export interface Point {
  x: number;
  y: number;
}

export type Direction = "up" | "down" | "left" | "right";
export type GameStatus = "idle" | "running" | "paused" | "over";
export type Difficulty = "easy" | "normal" | "hard";
