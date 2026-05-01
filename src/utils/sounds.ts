let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
}

function tone(freq: number, startSec: number, duration: number, volume: number, type: OscillatorType = 'sine') {
    const context = getCtx();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, context.currentTime + startSec);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + startSec + duration);
    osc.start(context.currentTime + startSec);
    osc.stop(context.currentTime + startSec + duration + 0.01);
}

export function playCorrect() {
    tone(523, 0, 0.12, 0.28); // C5
    tone(784, 0.07, 0.18, 0.22); // G5
}

export function playWrong() {
    tone(180, 0, 0.14, 0.18, 'sawtooth');
}

export function playCountryChange() {
    tone(1047, 0, 0.07, 0.12); // C6 — subtle high ping
    tone(1319, 0.06, 0.1, 0.08); // E6
}

export function playGameOver() {
    tone(440, 0, 0.22, 0.25); // A4
    tone(330, 0.18, 0.22, 0.25); // E4
    tone(262, 0.36, 0.4, 0.28); // C4
}

export function playTick() {
    tone(880, 0, 0.035, 0.2, 'square');
}
