const threatMusic = {
  enterDist: 1200,    // start music when a mob is this close
  exitDist: 1600,     // only stop when everything is farther than this
  cooldown: 180,      // frames (~3s at 60fps) to wait before fading out
  fadeSpeed: 0.02,    // volume change per frame
  maxVolume: 0.5,
  timer: 0,
  active: false,
  vol: 0,
  audio: null,

  init() {
    this.audio = new Audio("music/threat.mp3");
    this.audio.loop = true;
    this.audio.volume = 0;
  },

  nearestThreat() {
    let best = Infinity;
    for (let i = 0; i < mob.length; i++) {
      const b = mob[i];
      if (!b.alive || b.isInvulnerable) continue; // skip dead/harmless things
      const dx = b.position.x - m.pos.x;
      const dy = b.position.y - m.pos.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < best) best = d;
    }
    return best;
  },

  update() {
    // run detection every 10 frames to save CPU
    if (simulation.cycle % 10 === 0) {
      const d = this.nearestThreat();
      if (d < this.enterDist) {
        this.active = true;
        this.timer = this.cooldown;
      } else if (d > this.exitDist && this.timer > 0) {
        this.timer -= 10;
        if (this.timer <= 0) this.active = false;
      }
    }

    // fade toward target volume
    const target = this.active ? this.maxVolume : 0;
    if (this.vol < target) this.vol = Math.min(target, this.vol + this.fadeSpeed);
    else if (this.vol > target) this.vol = Math.max(target, this.vol - this.fadeSpeed);

    this.audio.volume = this.vol;
    if (this.vol > 0 && this.audio.paused) this.audio.play().catch(() => {});
    if (this.vol === 0 && !this.audio.paused) this.audio.pause();
  }
};

threatMusic.init();
