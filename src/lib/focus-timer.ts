export const TIMER_KEY = "cloud-board.focus.v1";
export const modes = ["focus", "short", "long"] as const;
export type Mode = (typeof modes)[number];
export const modeLabels: Record<Mode, string> = { focus: "Focus", short: "Short break", long: "Long break" };
export const defaults: Record<Mode, number> = { focus: 25, short: 5, long: 15 };
export type TimerState = {
  version: 1;
  mode: Mode;
  durations: Record<Mode, number>;
  remaining: number;
  endAt: number | null;
  status: "idle" | "running" | "paused" | "complete";
  sound: boolean;
};
export function initialState(): TimerState {
  return { version: 1, mode: "focus", durations: { ...defaults }, remaining: defaults.focus * 60_000, endAt: null, status: "idle", sound: false };
}
export function remainingAt(state: TimerState, now: number) {
  return Math.max(0, state.status === "running" && state.endAt !== null ? state.endAt - now : state.remaining);
}
export function settled(state: TimerState, now: number): TimerState {
  return state.status === "running" && remainingAt(state, now) === 0 ? { ...state, status: "complete", remaining: 0, endAt: null } : state;
}
export function parseState(raw: string | null): TimerState | null {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || value.version !== 1 || !modes.includes(value.mode) || !["idle", "running", "paused", "complete"].includes(value.status) || typeof value.sound !== "boolean") return null;
    for (const mode of modes) if (!Number.isInteger(value.durations?.[mode]) || value.durations[mode] < 1 || value.durations[mode] > 180) return null;
    if (!Number.isFinite(value.remaining) || value.remaining < 0 || value.remaining > 180 * 60_000) return null;
    if (value.status === "running" ? !Number.isFinite(value.endAt) || value.endAt <= 0 : value.endAt !== null) return null;
    return value as TimerState;
  } catch { return null; }
}
export function formatTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
