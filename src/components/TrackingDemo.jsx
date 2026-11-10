import { useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import {
    CROP_WIDTH, DEADBAND, DURATION, SAMPLE_FPS, SOURCE_HEIGHT, SOURCE_WIDTH,
    bandWidth, cameraAt, detections, isMoving, movesAt, naiveAt, naiveSnapsAt, planCamera, speakerAt,
} from '../lib/tracking';

// The interactive figure in the Clipper case study: the same clip framed two ways.
// src/lib/tracking.js holds the numbers; this file only draws them. Everything that
// changes on each frame is written straight to the SVG, so React re-renders only when
// a counter changes or the visitor moves a control.

const CLIPPER_BAND = Math.round(DEADBAND * 100);
const MAX_BAND = 40;
const FACE_Y = 455;
const HALF_CROP = CROP_WIDTH / 2;

const percent = (sourceX) => (sourceX / SOURCE_WIDTH) * 100;
const faceAt = (t) => detections[Math.min(Math.max(Math.floor(t * SAMPLE_FPS), 0), detections.length - 1)].x;

function verdict(moves) {
    if (moves === 0) return 'Too wide: the speaker changes seat and the frame never follows.';
    if (moves <= 2) return 'The frame holds still and makes one smooth move for each seat change.';
    if (moves <= 4) return 'A little narrow: the frame needs a second move to settle after each seat change.';
    return `Too narrow: the frame re-centres ${moves} times in this clip, so the picture keeps drifting.`;
}

// A simple podcast set, drawn once and shown in all three views. The evenly spaced
// wall panels are there so that any movement of the frame is easy to see.
function Scene({ id, speakerRef }) {
    return (
        <g id={id}>
            <rect className="sc-wall" width={SOURCE_WIDTH} height={SOURCE_HEIGHT} />
            {Array.from({ length: 17 }, (_, index) => (
                <line key={index} className="sc-slat" x1={index * 120} y1="0" x2={index * 120} y2="830" />
            ))}
            <line className="sc-shelf" x1="0" y1="300" x2={SOURCE_WIDTH} y2="300" />
            <g className="sc-prop">
                <rect x="150" y="186" width="40" height="114" rx="5" />
                <rect x="198" y="210" width="32" height="90" rx="5" />
                <rect x="238" y="170" width="44" height="130" rx="5" />
                <rect x="400" y="96" width="150" height="120" rx="8" />
                <rect x="770" y="236" width="118" height="64" rx="8" />
                <rect x="1262" y="96" width="150" height="120" rx="8" />
                <rect x="1572" y="238" width="76" height="62" rx="8" />
                <ellipse cx="1586" cy="196" rx="20" ry="46" transform="rotate(-24 1586 196)" />
                <ellipse cx="1634" cy="196" rx="20" ry="46" transform="rotate(24 1634 196)" />
                <ellipse cx="1610" cy="176" rx="18" ry="52" />
                <rect x="1742" y="190" width="38" height="110" rx="5" />
                <rect x="1788" y="214" width="34" height="86" rx="5" />
            </g>
            <line className="sc-shelf" x1="1010" y1="300" x2="1010" y2="236" />
            <circle className="sc-lamp" cx="1010" cy="206" r="36" />

            <g className="sc-host" transform="translate(520 0)">
                <rect x="-190" y="600" width="380" height="330" rx="120" />
                <circle cy="470" r="92" />
            </g>
            <g ref={speakerRef} className="sc-speaker">
                <rect x="-200" y="592" width="400" height="340" rx="126" />
                <circle cy={FACE_Y} r="98" />
            </g>

            <rect className="sc-desk" y="830" width={SOURCE_WIDTH} height="250" />
            <line className="sc-shelf" x1="0" y1="830" x2={SOURCE_WIDTH} y2="830" />
            {/* one microphone each, standing clear of both people */}
            <g className="sc-mic">
                <line x1="796" y1="830" x2="756" y2="716" />
                <rect x="728" y="664" width="44" height="78" rx="22" transform="rotate(-19 750 703)" />
                <line x1="850" y1="830" x2="890" y2="716" />
                <rect x="874" y="664" width="44" height="78" rx="22" transform="rotate(19 896 703)" />
            </g>
        </g>
    );
}

// ---------------------------------------------------------------- the chart
const CHART_HEIGHT = 168;
const MARGIN = { top: 12, right: 10, bottom: 26, left: 40 };
const Y_DOMAIN = [52, 84];           // percent across the source; fixed, so the axis never jumps
const Y_TICKS = [60, 70, 80];
const X_TICKS = [0, 5, 10, 15, 20];
const TABLE_TIMES = Array.from({ length: DURATION / 2 + 1 }, (_, index) => index * 2);

// Frame position over the clip. It is also the clip's timeline: an invisible range
// input lies over the plot, so a click, a drag or the arrow keys move the playhead.
function TrackChart({ ref, keys, band, onSeek }) {
    const wrapRef = useRef(null);
    const inputRef = useRef(null);
    const headRef = useRef(null);
    const naiveDotRef = useRef(null);
    const steadyDotRef = useRef(null);
    const timeRef = useRef(0);
    const clipId = `plot-${useId().replace(/[^a-z0-9]/gi, '')}`;
    const [width, setWidth] = useState(0);
    const [probe, setProbe] = useState(null); // the time being inspected, or null

    useLayoutEffect(() => {
        const wrap = wrapRef.current;
        setWidth(wrap.clientWidth);
        const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
        observer.observe(wrap);
        return () => observer.disconnect();
    }, []);

    const left = MARGIN.left;
    const right = Math.max(width - MARGIN.right, left + 1);
    const top = MARGIN.top;
    const bottom = CHART_HEIGHT - MARGIN.bottom;
    const xOf = useCallback((t) => left + (t / DURATION) * (right - left), [left, right]);
    const yOf = useCallback((value) => bottom - ((value - Y_DOMAIN[0]) / (Y_DOMAIN[1] - Y_DOMAIN[0])) * (bottom - top), [bottom, top]);
    const centreAt = useCallback((t) => percent(cameraAt(keys, t) + HALF_CROP), [keys]);

    const paths = useMemo(() => {
        const half = percent(band);
        const times = Array.from({ length: DURATION * 20 + 1 }, (_, index) => index / 20);
        const point = (t, value) => `${xOf(t).toFixed(1)} ${yOf(value).toFixed(1)}`;
        const steady = times.map((t) => point(t, centreAt(t))).join(' L ');
        const upper = times.map((t) => point(t, centreAt(t) + half));
        const lower = times.map((t) => point(t, centreAt(t) - half)).reverse();
        let naive = `M ${point(0, percent(naiveAt(0) + HALF_CROP))}`;
        for (let t = 0.5; t <= DURATION; t += 0.5) {
            naive += ` H ${xOf(t).toFixed(1)}`;
            if (t < DURATION) naive += ` V ${yOf(percent(naiveAt(t) + HALF_CROP)).toFixed(1)}`;
        }
        return { steady: `M ${steady}`, band: `M ${[...upper, ...lower].join(' L ')} Z`, naive };
    }, [band, centreAt, xOf, yOf]);

    // Move the playhead without a React render.
    const place = useCallback((t) => {
        const x = xOf(t);
        headRef.current.setAttribute('x1', x);
        headRef.current.setAttribute('x2', x);
        naiveDotRef.current.setAttribute('cx', x);
        naiveDotRef.current.setAttribute('cy', yOf(percent(naiveAt(t) + HALF_CROP)));
        steadyDotRef.current.setAttribute('cx', x);
        steadyDotRef.current.setAttribute('cy', yOf(centreAt(t)));
        inputRef.current.value = t;
        inputRef.current.setAttribute('aria-valuetext', `${Number(t.toFixed(2))} of ${DURATION} seconds`);
    }, [centreAt, xOf, yOf]);

    useImperativeHandle(ref, () => ({
        setTime(t) {
            timeRef.current = t;
            place(t);
        },
    }), [place]);

    // The plot was resized or the camera plan changed: put the playhead back.
    useLayoutEffect(() => {
        place(timeRef.current);
    }, [place]);

    function timeUnder(event) {
        const box = wrapRef.current.getBoundingClientRect();
        const share = (event.clientX - box.left - left) / (right - left);
        return Math.min(Math.max(share, 0), 1) * DURATION;
    }

    const probeX = probe === null ? 0 : xOf(probe);
    const tipOnLeft = probeX > (left + right) / 2;

    return (
        <div className="tracking-chart">
            <div className="tracking-chart-head">
                <p className="panel-title">Frame position during the clip, % across the source</p>
                <ul className="tracking-legend">
                    <li><i className="key key-line is-steady" aria-hidden="true" /> Dead-band frame</li>
                    <li><i className="key key-band" aria-hidden="true" /> Dead band</li>
                    <li><i className="key key-line is-naive" aria-hidden="true" /> Naive frame</li>
                    <li><i className="key key-dot" aria-hidden="true" /> Face found</li>
                </ul>
            </div>

            <div
                ref={wrapRef}
                className="tracking-plot"
                onPointerMove={(event) => setProbe(timeUnder(event))}
                onPointerLeave={() => setProbe(null)}
            >
                <svg width={width} height={CHART_HEIGHT} aria-hidden="true">
                    <defs>
                        <clipPath id={clipId}>
                            <rect x={left} y={top} width={right - left} height={bottom - top} />
                        </clipPath>
                    </defs>

                    {Y_TICKS.map((tick) => (
                        <g key={tick}>
                            <line className="ch-grid" x1={left} x2={right} y1={yOf(tick)} y2={yOf(tick)} />
                            <text className="ch-label" x={left - 8} y={yOf(tick)} dy="0.32em" textAnchor="end">{tick}%</text>
                        </g>
                    ))}
                    <line className="ch-axis" x1={left} x2={right} y1={bottom} y2={bottom} />
                    {X_TICKS.map((tick) => (
                        <text key={tick} className="ch-label" x={xOf(tick)} y={bottom + 17} textAnchor={tick === 0 ? 'start' : 'middle'}>{tick}s</text>
                    ))}

                    <g clipPath={`url(#${clipId})`}>
                        <path className="ch-band" d={paths.band} />
                        {detections.map((sample) => (
                            <circle key={sample.t} className="ch-face" cx={xOf(sample.t)} cy={yOf(percent(sample.x))} r="1.6" />
                        ))}
                        <path className="ch-line is-naive" d={paths.naive} />
                        <path className="ch-line is-steady" d={paths.steady} />
                    </g>

                    {probe !== null && <line className="ch-probe" x1={probeX} x2={probeX} y1={top} y2={bottom} />}
                    <line ref={headRef} className="ch-head" y1={top - 4} y2={bottom} />
                    <circle ref={naiveDotRef} className="ch-dot is-naive" r="5" />
                    <circle ref={steadyDotRef} className="ch-dot is-steady" r="5" />
                </svg>

                <input
                    ref={inputRef}
                    className="tracking-scrub"
                    type="range"
                    min="0"
                    max={DURATION}
                    step="0.25"
                    defaultValue="0"
                    aria-label="Clip time"
                    style={{ left, width: right - left }}
                    onChange={(event) => {
                        const t = Math.min(Number(event.target.value), DURATION - 0.01);
                        onSeek(t);
                        if (event.target.matches(':focus-visible')) setProbe(t);
                    }}
                    // Keyboard users get the same readout as the pointer does.
                    onFocus={(event) => {
                        if (event.target.matches(':focus-visible')) setProbe(timeRef.current);
                    }}
                    onBlur={() => setProbe(null)}
                />

                {probe !== null && (
                    <div className="tracking-tip" style={tipOnLeft ? { right: width - probeX + 12 } : { left: probeX + 12 }}>
                        <p>{probe.toFixed(2)} s</p>
                        <dl>
                            <div>
                                <dt><i className="key key-line is-steady" aria-hidden="true" /> Dead-band frame</dt>
                                <dd>{centreAt(probe).toFixed(1)}%</dd>
                            </div>
                            <div>
                                <dt><i className="key key-line is-naive" aria-hidden="true" /> Naive frame</dt>
                                <dd>{percent(naiveAt(probe) + HALF_CROP).toFixed(1)}%</dd>
                            </div>
                            <div>
                                <dt><i className="key key-dot" aria-hidden="true" /> Face found</dt>
                                <dd>{percent(faceAt(probe)).toFixed(1)}%</dd>
                            </div>
                        </dl>
                    </div>
                )}
            </div>

            {/* The same numbers for screen readers. The wrapper does the hiding: a table ignores a 1px width. */}
            <div className="sr-only">
                <table>
                    <caption>Centre of each frame every two seconds, as a percentage of the source width</caption>
                    <thead>
                        <tr><th scope="col">Time</th><th scope="col">Face found</th><th scope="col">Naive frame</th><th scope="col">Dead-band frame</th></tr>
                    </thead>
                    <tbody>
                        {TABLE_TIMES.map((t) => (
                            <tr key={t}>
                                <th scope="row">{t} s</th>
                                <td>{percent(faceAt(t)).toFixed(1)}%</td>
                                <td>{percent(naiveAt(t) + HALF_CROP).toFixed(1)}%</td>
                                <td>{centreAt(t).toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------- the figure
export default function TrackingDemo() {
    const sceneId = `scene-${useId().replace(/[^a-z0-9]/gi, '')}`;
    const [bandPercent, setBandPercent] = useState(CLIPPER_BAND);
    // No autoplay for visitors who asked their system for less motion; they can still press play.
    const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const [inView, setInView] = useState(false);
    const [readout, setReadout] = useState({ snaps: 0, moves: 0, moving: false });

    const keys = useMemo(() => planCamera(bandPercent / 100), [bandPercent]);
    const band = bandWidth(bandPercent / 100);
    const totalMoves = keys.length - 1;

    const figureRef = useRef(null);
    const stageRef = useRef(null);
    const speakerRef = useRef(null);
    const faceRef = useRef(null);
    const bandRef = useRef(null);
    const cropRef = useRef(null);
    const dimLeftRef = useRef(null);
    const dimRightRef = useRef(null);
    const naiveViewRef = useRef(null);
    const steadyViewRef = useRef(null);
    const chartRef = useRef(null);
    const clock = useRef(0);
    const shown = useRef(readout);

    // Draw one moment of the clip.
    const paint = useCallback((t) => {
        const camera = cameraAt(keys, t);
        const naive = naiveAt(t);
        speakerRef.current.setAttribute('transform', `translate(${speakerAt(t).toFixed(1)} 0)`);
        faceRef.current.setAttribute('transform', `translate(${faceAt(t).toFixed(1)} 0)`);
        bandRef.current.setAttribute('x', camera + HALF_CROP - band);
        bandRef.current.setAttribute('width', band * 2);
        cropRef.current.setAttribute('x', camera);
        dimLeftRef.current.setAttribute('width', camera);
        dimRightRef.current.setAttribute('x', camera + CROP_WIDTH);
        dimRightRef.current.setAttribute('width', SOURCE_WIDTH - camera - CROP_WIDTH);
        naiveViewRef.current.setAttribute('viewBox', `${naive} 0 ${CROP_WIDTH} ${SOURCE_HEIGHT}`);
        steadyViewRef.current.setAttribute('viewBox', `${camera.toFixed(2)} 0 ${CROP_WIDTH} ${SOURCE_HEIGHT}`);
        chartRef.current.setTime(t);

        const next = { snaps: naiveSnapsAt(t), moves: movesAt(keys, t), moving: isMoving(keys, t) };
        if (next.snaps !== shown.current.snaps || next.moves !== shown.current.moves || next.moving !== shown.current.moving) {
            shown.current = next;
            setReadout(next);
        }
    }, [band, keys]);

    // First draw, and a redraw whenever the dead band changes (also while paused).
    useLayoutEffect(() => {
        paint(clock.current);
    }, [paint]);

    // Only run while the figure is on screen.
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
        observer.observe(figureRef.current);
        return () => observer.disconnect();
    }, []);

    const running = !paused && inView;
    useEffect(() => {
        if (!running) return undefined;
        let frame = 0;
        let last = null;
        const tick = (now) => {
            // The first frame only sets the starting point. Long gaps (a hidden tab) count as 0.1s.
            if (last !== null) clock.current += Math.min(Math.max((now - last) / 1000, 0), 0.1);
            last = now;
            if (clock.current >= DURATION) {
                clock.current = 0;
                // The clip starts again: a short dip, so the restart does not read as a jump.
                stageRef.current.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 500, easing: 'ease-out' });
            }
            paint(clock.current);
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [paint, running]);

    const seek = useCallback((t) => {
        clock.current = t;
        paint(t);
    }, [paint]);

    return (
        <section className="case-section tracking" aria-labelledby="tracking-title">
            <h2 id="tracking-title" className="case-heading">See the jitter fix</h2>
            <p className="case-note">
                Every short is a 9:16 frame cut out of a 16:9 video, so something has to decide where that frame sits.
                Jumping to the face at every update makes the picture shake. Clipper holds the frame still while the speaker
                stays inside a dead band, and makes one smooth move only when they really change position.
            </p>

            <div ref={figureRef} className="panel tracking-panel">
                <div ref={stageRef} className="tracking-stage">
                    <figure className="tracking-view tracking-source">
                        <svg
                            viewBox={`0 0 ${SOURCE_WIDTH} ${SOURCE_HEIGHT}`}
                            role="img"
                            aria-label="Animated diagram of the source video: two people at a desk. A marked 9:16 frame follows the speaker on the right."
                        >
                            <Scene id={sceneId} speakerRef={speakerRef} />
                            <rect ref={dimLeftRef} className="ov-dim" height={SOURCE_HEIGHT} />
                            <rect ref={dimRightRef} className="ov-dim" height={SOURCE_HEIGHT} />
                            <rect ref={bandRef} className="ov-band" height={SOURCE_HEIGHT} />
                            <rect ref={cropRef} className="ov-crop" y="4" width={CROP_WIDTH} height={SOURCE_HEIGHT - 8} rx="14" />
                            <path
                                ref={faceRef}
                                className="ov-face"
                                d={`M -130 ${FACE_Y - 84} V ${FACE_Y - 130} H -84 M 84 ${FACE_Y - 130} H 130 V ${FACE_Y - 84} M 130 ${FACE_Y + 84} V ${FACE_Y + 130} H 84 M -84 ${FACE_Y + 130} H -130 V ${FACE_Y + 84}`}
                            />
                        </svg>
                        <figcaption>
                            <span className="panel-title">Source video, 16:9</span>
                            <ul className="tracking-legend">
                                <li><i className="key key-face" aria-hidden="true" /> Face found</li>
                                <li><i className="key key-band" aria-hidden="true" /> Dead band</li>
                                <li><i className="key key-frame" aria-hidden="true" /> 9:16 frame</li>
                            </ul>
                        </figcaption>
                    </figure>

                    <figure className="tracking-view">
                        <svg ref={naiveViewRef} viewBox={`0 0 ${CROP_WIDTH} ${SOURCE_HEIGHT}`} aria-hidden="true">
                            <use href={`#${sceneId}`} />
                        </svg>
                        <figcaption>
                            <span className="panel-title">Naive tracking</span>
                            <span className="tracking-stat"><strong>{readout.snaps}</strong> {readout.snaps === 1 ? 'snap' : 'snaps'}</span>
                            <span className="tracking-sub">Jumps to the face twice a second</span>
                        </figcaption>
                    </figure>

                    <figure className="tracking-view is-steady">
                        <svg ref={steadyViewRef} viewBox={`0 0 ${CROP_WIDTH} ${SOURCE_HEIGHT}`} aria-hidden="true">
                            <use href={`#${sceneId}`} />
                        </svg>
                        <figcaption>
                            <span className="panel-title">Dead-band follow</span>
                            <span className="tracking-stat"><strong>0</strong> snaps</span>
                            <span className="tracking-sub">
                                {readout.moves} smooth {readout.moves === 1 ? 'move' : 'moves'} · {readout.moving ? 'following' : 'holding'}
                            </span>
                        </figcaption>
                    </figure>
                </div>

                <TrackChart ref={chartRef} keys={keys} band={band} onSeek={seek} />

                <div className="tracking-controls">
                    <div className="tracking-buttons">
                        <button type="button" className="icon-button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play the clip' : 'Pause the clip'}>
                            {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
                        </button>
                        <button
                            type="button"
                            className="icon-button"
                            aria-label="Restart the clip"
                            onClick={() => {
                                seek(0);
                                setPaused(false);
                            }}
                        >
                            <RotateCcw size={17} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="tracking-band">
                        <label htmlFor="tracking-band">
                            Dead band <strong>{bandPercent}%</strong> of the frame width
                            {bandPercent === CLIPPER_BAND && <span className="chip">Clipper’s setting</span>}
                        </label>
                        <input
                            id="tracking-band"
                            className="tracking-range"
                            type="range"
                            min="0"
                            max={MAX_BAND}
                            step="1"
                            value={bandPercent}
                            style={{ '--fill': `${(bandPercent / MAX_BAND) * 100}%` }}
                            onChange={(event) => setBandPercent(Number(event.target.value))}
                        />
                        <p className="tracking-verdict">
                            <output htmlFor="tracking-band">{verdict(totalMoves)}</output>
                            {bandPercent !== CLIPPER_BAND && (
                                <button type="button" className="text-link" onClick={() => setBandPercent(CLIPPER_BAND)}>
                                    Back to {CLIPPER_BAND}%
                                </button>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <p className="tracking-note">
                This is a simulation, not footage. It runs Clipper’s camera rules with the same settings as{' '}
                <a href="https://github.com/Ironankit525/clipper/blob/main/app/reframe.py" target="_blank" rel="noreferrer">app/reframe.py</a>,
                on a made-up speaker. Choosing between several faces and handling cuts in the source video are left out.
            </p>
        </section>
    );
}
