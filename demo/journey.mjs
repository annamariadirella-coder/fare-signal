// A pretend clock and bot. Nothing here talks to Telegram or starts a real timer.
export class JourneyDemo {
  constructor() { this.reset(); }
  reset() { this.bot = 'missing'; this.watch = 'off'; this.ticks = 0; }
  makeBot() { if (this.bot === 'missing') this.bot = 'created'; }
  pressStart() {
    if (this.bot !== 'created') return false;
    this.bot = 'started'; return true;
  }
  startWatch() {
    if (this.bot !== 'started' || this.watch === 'stopped') return false;
    this.watch = 'running'; return true;
  }
  tick() {
    if (this.watch !== 'running') return false;
    this.ticks++; return true;
  }
  stop() { if (this.watch === 'running') this.watch = 'stopped'; }
  get clock() {
    const hours = 8 + this.ticks * 2;
    return `Day ${Math.floor(hours / 24) + 1} · ${String(hours % 24).padStart(2, '0')}:00`;
  }
}
