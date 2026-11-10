// The numbers behind the speaker-tracking demo in the Clipper case study.
//
// The camera rules are a port of app/reframe.py in the Clipper repository, with the
// same settings. Only the input is made up: one speaker who sways while talking,
// moves seat twice and leans away once. Two parts of the real planner are left out
// because this clip never needs them: choosing between several faces, and cutting
// when the source video itself cuts.

export const SOURCE_WIDTH = 1920;
export const SOURCE_HEIGHT = 1080;
export const CROP_WIDTH = 608;        // the 9:16 window: round(1080 * 9 / 16 / 2) * 2
export const DURATION = 24;           // seconds
export const SAMPLE_FPS = 4;          // faces are sampled four times a second
export const NAIVE_FPS = 2;           // the old output moved the frame twice a second
export const DEADBAND = 0.18;         // of crop width: how far the speaker roams free

const MIN_MOVE_GAP = 2.0;             // seconds between repositions
const SETTLE = 0.75;                  // seconds of lookahead: chase a move, not a lean
const PAN_SPEED = 320;                // px a second
const PAN_MIN = 0.35;
const PAN_MAX = 1.2;
const CUT_JUMP = 0.35;                // a reposition longer than this is a cut, not a pan
const SMOOTH_WINDOW = 5;              // samples in the median filter
const SMOOTH_ALPHA = 0.25;

const MAX_X = SOURCE_WIDTH - CROP_WIDTH;
const BAND_UNIT = SOURCE_WIDTH * (9 / 16) * (9 / 16); // reframe.py measures the band against this
const LOOKAHEAD = Math.max(1, Math.floor(SETTLE * SAMPLE_FPS));

const smoothstep = (u) => u * u * (3 - 2 * u);
const ramp = (t, from, to) => smoothstep(Math.min(Math.max((t - from) / (to - from), 0), 1));
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

/** Left edge of the crop for a subject centred at `centre`, kept inside the source. */
export const toX = (centre) => Math.min(Math.max(Math.round(centre - CROP_WIDTH / 2), 0), MAX_X);

// ---------------------------------------------------------------- the made-up clip
const SEAT = 1180;

/** Where the speaker's face really is at time `t`, in source pixels. */
export function speakerAt(t) {
    const sway = 26 * Math.sin((2 * Math.PI * t) / 6 + 0.4)
        + 12 * Math.sin((2 * Math.PI * t) / 2 + 1.1)
        + 6 * Math.sin((2 * Math.PI * t) / 0.8);
    const seat = 250 * (ramp(t, 6, 7.2) - ramp(t, 15, 16.4));        // moves over, later moves back
    const lean = -170 * Math.sin(Math.PI * ramp(t, 11.2, 11.9));      // a quick lean away and back
    return SEAT + sway + seat + lean;
}

// A small seeded generator, so every visitor sees the same clip.
function seeded(seed) {
    let state = seed;
    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let n = Math.imul(state ^ (state >>> 15), 1 | state);
        n = (n + Math.imul(n ^ (n >>> 7), 61 | n)) ^ n;
        return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
    };
}

const noise = seeded(7);

/** What the face detector reports: the true position plus a few pixels of error. */
export const detections = Array.from({ length: DURATION * SAMPLE_FPS + 1 }, (_, index) => {
    const t = index / SAMPLE_FPS;
    return { t, x: speakerAt(t) + (noise() - 0.5) * 14 };
});

// ---------------------------------------------------------------- naive tracking
// Jump to the detected face at every update and hold still in between.
const naiveSteps = Array.from({ length: DURATION * NAIVE_FPS + 1 }, (_, index) => (
    toX(detections[index * (SAMPLE_FPS / NAIVE_FPS)].x)
));

export const naiveAt = (t) => naiveSteps[Math.min(Math.floor(t * NAIVE_FPS), naiveSteps.length - 1)];

/** How many times the naive frame has jumped by time `t`. */
export function naiveSnapsAt(t) {
    let snaps = 0;
    for (let index = 1; index <= Math.floor(t * NAIVE_FPS) && index < naiveSteps.length; index += 1) {
        if (naiveSteps[index] !== naiveSteps[index - 1]) snaps += 1;
    }
    return snaps;
}

// ---------------------------------------------------------------- dead-band follow
// A median filter removes single-sample outliers; an average run forwards and then
// backwards removes the rest without adding lag.
function smooth(values) {
    const half = Math.floor(SMOOTH_WINDOW / 2);
    const out = values.map((_, index) => median(values.slice(Math.max(0, index - half), index + half + 1)));
    for (let index = 1; index < out.length; index += 1) out[index] = SMOOTH_ALPHA * out[index] + (1 - SMOOTH_ALPHA) * out[index - 1];
    for (let index = out.length - 2; index >= 0; index -= 1) out[index] = SMOOTH_ALPHA * out[index] + (1 - SMOOTH_ALPHA) * out[index + 1];
    return out;
}

/** Seconds to travel between two crop positions, or 0 for a cut. */
function transition(from, to) {
    const distance = Math.abs(to - from);
    if (distance > CUT_JUMP * SOURCE_WIDTH * (9 / 16)) return 0;
    return Math.min(Math.max(distance / PAN_SPEED, PAN_MIN), PAN_MAX);
}

const smoothed = smooth(detections.map((sample) => sample.x));

/**
 * Plan the camera for the whole clip. `deadband` is a share of the crop width.
 * Returns keys: { t, x, move } means "be at x by time t, taking `move` seconds".
 * The frame holds while the speaker stays inside the band and re-centres only once
 * they have left it and stayed out.
 */
export function planCamera(deadband = DEADBAND) {
    const band = deadband * BAND_UNIT;
    let centre = median(smoothed.slice(0, LOOKAHEAD));
    let lastMove = -MIN_MOVE_GAP;
    const keys = [{ t: 0, x: toX(centre), move: 0 }];

    for (let index = 0; index < smoothed.length; index += 1) {
        const { t } = detections[index];
        if (Math.abs(smoothed[index] - centre) <= band || t - lastMove < MIN_MOVE_GAP) continue;
        const target = median(smoothed.slice(index, index + LOOKAHEAD));
        if (Math.abs(target - centre) <= band) continue;
        const move = transition(toX(centre), toX(target));
        const arrive = Math.round((t + Math.max(move, 0.05)) * 100) / 100;
        if (arrive <= keys[keys.length - 1].t + 0.2) continue;
        if (arrive > DURATION - 0.3) break;             // no time left to land the move
        keys.push({ t: arrive, x: toX(target), move });
        centre = target;
        lastMove = t;
    }
    return keys;
}

// The stretch of time in which key `index` is being travelled to.
function travel(keys, index) {
    const start = Math.max(keys[index].t - keys[index].move, keys[index - 1].t);
    return { start, length: Math.max(keys[index].t - start, 0.1) };
}

/** Crop position at time `t`: holds are constant and moves ease in and out. */
export function cameraAt(keys, t) {
    for (let index = keys.length - 1; index > 0; index -= 1) {
        const { start, length } = travel(keys, index);
        if (t >= keys[index].t) return keys[index].x;
        if (t >= start) return keys[index - 1].x + (keys[index].x - keys[index - 1].x) * smoothstep((t - start) / length);
    }
    return keys[0].x;
}

/** Whether the frame is in the middle of a move at time `t`. */
export function isMoving(keys, t) {
    return keys.some((key, index) => index > 0 && t >= travel(keys, index).start && t < key.t);
}

/** How many moves have started by time `t`. */
export function movesAt(keys, t) {
    return keys.filter((key, index) => index > 0 && t >= travel(keys, index).start).length;
}

/** Half-width of the dead band in source pixels. */
export const bandWidth = (deadband) => deadband * BAND_UNIT;
