"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { defaults, formatTime, initialState, modeLabels, modes, parseState, remainingAt, settled, TIMER_KEY, type Mode, type TimerState } from "@/lib/focus-timer";

export function FocusTimer({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<TimerState>(initialState);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);
  const [settings, setSettings] = useState(false);
  const [draft, setDraft] = useState({ ...defaults });
  const [message, setMessage] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const current = useRef(state);
  const audio = useRef<AudioContext | null>(null);
  const settingsTrigger = useRef<HTMLButtonElement>(null);
  const settingsField = useRef<HTMLInputElement>(null);

  const save = useCallback((next: TimerState) => {
    current.current = next;
    setState(next);
    setNow(Date.now());
    try { localStorage.setItem(TIMER_KEY, JSON.stringify(next)); }
    catch { setStorageWarning(true); }
  }, []);

  function unlockAudio() {
    try {
      audio.current ??= new AudioContext();
      void audio.current.resume().catch(() => {});
    } catch { /* Sound is optional; timing works without an audio device. */ }
  }

  const chime = useCallback(() => {
    const context = audio.current;
    if (!context || context.state !== "running") return;
    for (const [index, frequency] of [660, 880].entries()) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + index * .25;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(.12, start + .02);
      gain.gain.exponentialRampToValueAtTime(.001, start + .65);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + .7);
    }
  }, []);

  useEffect(() => {
    let loaded = initialState();
    try { loaded = parseState(localStorage.getItem(TIMER_KEY)) ?? loaded; }
    catch { setStorageWarning(true); }
    loaded = settled(loaded, Date.now());
    current.current = loaded;
    setState(loaded);
    setNow(Date.now());
    setReady(true);
    function receive(event: StorageEvent) {
      if (event.key !== TIMER_KEY && event.key !== null) return;
      const next = settled(parseState(event.newValue) ?? initialState(), Date.now());
      current.current = next;
      setState(next);
      setNow(Date.now());
      setMessage(next.status === "complete" ? "Session complete. Take a breath." : "");
    }
    window.addEventListener("storage", receive);
    return () => { window.removeEventListener("storage", receive); void audio.current?.close().catch(() => {}); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    function tick() {
      const time = Date.now();
      const previous = current.current;
      setNow(time);
      if (previous.status === "running" && remainingAt(previous, time) === 0) {
        // A focused window owns the audible signal. Other windows just update.
        if (previous.sound && document.hasFocus()) chime();
        save(settled(previous, time));
        setMessage(previous.mode === "focus" ? "Focus session complete. You’ve earned a breather." : "Break complete. Ready when you are.");
      }
    }
    const interval = window.setInterval(tick, 250);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    tick();
    return () => { clearInterval(interval); window.removeEventListener("focus", tick); document.removeEventListener("visibilitychange", tick); };
  }, [ready, save, chime]);

  const remaining = remainingAt(state, now);
  const display = formatTime(remaining);
  useEffect(() => {
    if (!ready) return;
    document.title = `${display} · ${modeLabels[state.mode]} | Cloud Board`;
    return () => { document.title = "Focus timer | Cloud Board"; };
  }, [display, state.mode, ready]);
  useEffect(() => { if (settings) settingsField.current?.focus(); }, [settings]);

  function toggleRunning() {
    const latest = settled(current.current, Date.now());
    if (latest.sound) unlockAudio();
    if (latest.status === "running") {
      save({ ...latest, remaining: remainingAt(latest, Date.now()), endAt: null, status: "paused" });
      setMessage("Paused. Pick up when you’re ready.");
    } else {
      const duration = latest.status === "complete" ? latest.durations[latest.mode] * 60_000 : latest.remaining;
      save({ ...latest, remaining: duration, endAt: Date.now() + duration, status: "running" });
      setMessage(`${modeLabels[latest.mode]} session started.`);
    }
  }
  function reset(mode: Mode = current.current.mode) {
    const latest = current.current;
    save({ ...latest, mode, remaining: latest.durations[mode] * 60_000, endAt: null, status: "idle" });
    setMessage(`${modeLabels[mode]} ready. Start when you’re ready.`);
  }
  function closeSettings() { setSettings(false); settingsTrigger.current?.focus(); }
  function popOut() {
    const popup = window.open("/focus/mini/", "cloud-board-focus", "popup=yes,width=390,height=490,resizable=yes,scrollbars=yes");
    setPopupBlocked(!popup);
    popup?.focus();
  }

  return <div className={`focus-tool${compact ? " focus-compact" : ""}`}>
    <div className="timer-window">
      <div className="window-bar" aria-hidden="true"><span className="window-dots"><i/><i/><i/></span><span>focus_room</span></div>
      <div className="timer-body">
        <div className="timer-modes" role="group" aria-label="Session type">{modes.map(mode => <button key={mode} className="timer-pill" aria-pressed={state.mode === mode} disabled={!ready} onClick={() => reset(mode)}>{modeLabels[mode]}</button>)}</div>
        <div className="timer-digits" role="timer" aria-label={`${modeLabels[state.mode]} time remaining`} aria-live="off" aria-atomic="true">{display}</div>
        <p className="timer-whisper">{state.status === "complete" ? "A little closer. Nicely done." : state.mode === "focus" ? "One thing at a time." : "A little pause goes a long way."}</p>
        <div className="timer-actions"><button className="button button-yellow" disabled={!ready} onClick={toggleRunning}>{state.status === "running" ? "Pause" : state.status === "paused" ? "Resume" : state.status === "complete" ? "Start again" : "Start"}</button><button className="button" disabled={!ready} onClick={() => reset()}>Reset</button></div>
        <p className="timer-status" role="status">{message || (state.status === "complete" ? "Session complete. Take a breath." : " ")}</p>
      </div>
    </div>
    <div className="timer-toolbar">
      <button className="timer-pill" disabled={!ready} aria-pressed={state.sound} onClick={() => { const next = !current.current.sound; if (next) unlockAudio(); save({ ...current.current, sound: next }); }}>Sound {state.sound ? "on" : "off"}</button>
      <button ref={settingsTrigger} className="timer-pill" disabled={!ready} aria-expanded={settings} aria-controls="timer-settings" onClick={() => { setDraft({ ...current.current.durations }); setSettings(!settings); }}>Settings</button>
      {!compact && <button className="timer-pill" onClick={popOut}>Pop out <span aria-hidden="true">↗</span></button>}
      {compact && <a className="timer-pill" href="/focus/" target="_blank" rel="noopener noreferrer">Full timer ↗<span className="sr-only"> (opens in a new tab)</span></a>}
    </div>
    {settings && <form className="timer-settings" id="timer-settings" onKeyDown={event => { if (event.key === "Escape") closeSettings(); }} onSubmit={event => {
      event.preventDefault();
      if (modes.some(mode => !Number.isInteger(draft[mode]) || draft[mode] < 1 || draft[mode] > 180)) return;
      const latest = current.current;
      save({ ...latest, durations: { ...draft }, remaining: draft[latest.mode] * 60_000, endAt: null, status: "idle" });
      setMessage("Durations saved. Current session reset.");
      closeSettings();
    }}>
      <h2>Your rhythm.</h2><p>Minutes per session. Saving resets the current timer.</p>
      <div className="duration-fields">{modes.map((mode, index) => <label key={mode}>{modeLabels[mode]}<input ref={index === 0 ? settingsField : undefined} type="number" min="1" max="180" step="1" required value={Number.isNaN(draft[mode]) ? "" : draft[mode]} onChange={event => setDraft({ ...draft, [mode]: event.target.valueAsNumber })}/></label>)}</div>
      <div className="settings-actions"><button className="button button-yellow" type="submit">Save durations</button><button className="button" type="button" onClick={closeSettings}>Cancel</button></div>
    </form>}
    {popupBlocked && <p className="timer-note" role="status">Your browser blocked the pop-out. <a href="/focus/mini/" target="_blank" rel="noopener noreferrer">Open the compact timer in a new tab ↗</a></p>}
    {storageWarning && <p className="timer-note" role="status">Browser storage is unavailable. This timer works here, but won’t save or sync with other windows.</p>}
    {!compact && <p className="focus-footnote">No account. Just your next {state.durations.focus} minutes.<span>Saved in this browser. Changing session type resets the timer.<br/>Keep a timer window open for alerts. Sound is optional and plays in the focused window; sleep can delay it.</span></p>}
  </div>;
}
