"use client";

import { useState, useEffect, useRef, useMemo, memo } from "react";
import Image from "next/image";

/* ─── IMAGE BASE ─── */
// Images live on the deployed site (not in git). Use env on Netlify, else production URL.
const IMG_BASE = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://anas-weds-maria.netlify.app"
).replace(/\/$/, "");

const img = (path) => IMG_BASE + path;

/* ─── CONSTANTS ─── */
const C = {
  midnight: "#0a1a1f",
  deep: "#0f2b33",
  teal: "#1a4a52",
  tealLight: "#2a6a74",
  accent: "#c9a84c",
  accentLight: "#e8d48b",
  accentSoft: "#c9a84c20",
  ivory: "#faf8f2",
  cream: "#f5f0e6",
  sand: "#e8dfd0",
  text: "#1a2e35",
  textMuted: "#4a6670",
  white: "#ffffff",
  rose: "#c41e3a",
};

const GROOM = "Anas Faruqui";
const GROOM_FAM = "Mr. & Mrs. Faruqui";
const BRIDE = "Syeda Maria Yousuf";
const BRIDE_FAM = "Mr. & Mrs. Syed Yousuf";
const HASHTAG = "#AnasWedsMaria";
const CD_DATE = "2026-07-20T20:00:00";

const EVENTS = [
  {
    id: "mehndi",
    title: "Mehndi",
    tag: "An evening of colour, music & henna",
    wday: "Wednesday",
    date: "15 July 2026",
    time: "7:00 PM onwards",
    venue: "Grand Hayat Luxury Banquet",
    addr: "Johar Hill Rd, Block 1 Gulistan-e-Johar, Karachi",
    accent: C.accent,
    photo: img("/images/grand-hayat-front.webp"),
    side: "bride",
  },
  {
    id: "barat",
    title: "Barat",
    tag: "The grand arrival of the baraat",
    wday: "Friday",
    date: "17 July 2026",
    time: "8:00 PM onwards",
    venue: "Bella Vista Banquet",
    addr: "Block 14, Gulistan-e-Johar, Karachi",
    accent: C.rose,
    photo: img("/images/event-barat.jpg"),
    side: "bride",
  },
  {
    id: "valima",
    title: "Valima",
    tag: "A celebration of our union — hosted by the groom\u2019s family",
    wday: "Monday",
    date: "20 July 2026",
    time: "8:00 PM onwards",
    venue: "Parsa Banquet",
    addr: "C, 78, Block 14, Gulistan-e-Johar, Karachi",
    accent: C.teal,
    photo: null,
    side: "groom",
    featured: true,
  },
];

const GAL = [
  { src: img("/images/gallery-1.jpg"), label: "Bride Entry" },
  { src: img("/images/gallery-3.jpg"), label: "Groom Nikah" },
  { src: img("/images/gallery-4.jpg"), label: "Bride Nikah" },
  { src: img("/images/gallery-7.jpg"), label: "Party", pos: "22% center" },
  { src: img("/images/gallery-6.jpg"), label: "Qawali Night" },
];

const SCHED = [
  { time: "8:00 PM", label: "Welcome", detail: "Guests arrival & reception" },
  { time: "10:00 PM", label: "Dinner", detail: "Dinner is served" },
  {
    time: "11:30 PM",
    label: "Dua & Farewell",
    detail: "Closing prayers & send-off",
  },
];

const CONTACTS = [
  {
    name: "Sohail Faruqui",
    role: "Host · Groom\u2019s Family",
    phone: "0332-2168290",
  },
  {
    name: "Zohaib Faruqi",
    role: "RSVP & Queries",
    phone: "0342-2717348",
  },
];

const MAP_URL =
  "https://maps.google.com/maps?q=Parsa+Banquet+Block+14+Gulistan+e+Johar+Karachi&z=16&output=embed";

/* ─── MUSIC ─── */
const SONGS = [
  { src: "/audio/o-maahi.mp3", label: "O Maahi", startAt: 49 },
  { src: "/audio/satranga.mp3", label: "Satranga", startAt: 48 },
];

function ensureAudioReady(audio) {
  if (audio.readyState >= 1) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Audio failed to load"));
    };
    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", onReady);
      audio.removeEventListener("error", onError);
    };
    audio.addEventListener("loadedmetadata", onReady);
    audio.addEventListener("error", onError);
    audio.load();
  });
}

/* ─── HOOKS ─── */
function useCountdown(target) {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const d = new Date(target).getTime();
    function calc() {
      const df = Math.max(0, d - Date.now());
      return {
        d: Math.floor(df / 864e5),
        h: Math.floor((df % 864e5) / 36e5),
        m: Math.floor((df % 36e5) / 6e4),
        s: Math.floor((df % 6e4) / 1e3),
      };
    }
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVis(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─── ANIMATION WRAPPERS ─── */
function FadeIn({ delay = 0, y = 36, className = "", style = {}, children }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : `translateY(${y}px)`,
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function ScaleIn({ delay = 0, children }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "scale(1)" : "scale(0.92)",
        transition: `all .8s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── PARTICLES ─── */
function Particles() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const narrow = window.matchMedia("(max-width: 640px)").matches;
    const count = narrow ? 5 : 8;
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100 + "%",
        animationDelay: Math.random() * 12 + "s",
        animationDuration: 10 + Math.random() * 8 + "s",
        width: 4 + Math.random() * 5,
        height: 4 + Math.random() * 5,
        opacity: 0.06 + Math.random() * 0.08,
      });
    }
    setItems(arr);
  }, []);

  if (!items.length) return null;

  return (
    <div className="particles">
      {items.map((p) => (
        <div
          key={p.id}
          className="ptcl"
          style={{
            left: p.left,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
            width: p.width,
            height: p.height,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ─── ORNAMENT ─── */
function Orn({ color = C.accent, w = 200 }) {
  return (
    <svg
      width={w}
      height="18"
      viewBox="0 0 200 18"
      fill="none"
      style={{ display: "block", margin: "0 auto" }}
    >
      <line x1="0" y1="9" x2="72" y2="9" stroke={color} strokeWidth=".5" opacity=".35" />
      <path d="M78 9Q88 1 98 9Q108 17 118 9" stroke={color} strokeWidth="1" fill="none" opacity=".45" />
      <line x1="124" y1="9" x2="200" y2="9" stroke={color} strokeWidth=".5" opacity=".35" />
      <circle cx="98" cy="9" r="2" fill={color} opacity=".3" />
    </svg>
  );
}

/* ─── SECTION HEAD ─── */
function SH({ overline, title, subtitle, light = false }) {
  return (
    <FadeIn>
      <div className="sh">
        {overline && <p className={"sh-ov" + (light ? " sh-ov-l" : "")}>{overline}</p>}
        <h2 className={"sh-t" + (light ? " sh-t-l" : "")}>{title}</h2>
        {subtitle && <p className={"sh-sub" + (light ? " sh-sub-l" : "")}>{subtitle}</p>}
        <div style={{ marginTop: 16 }}>
          <Orn color={light ? C.accentLight : C.accent} />
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── VALIMA VENUE SVG ART ─── */
const ValimaArt = memo(function ValimaArt() {
  const stars = [
    { x: 50, y: 25 }, { x: 120, y: 45 }, { x: 200, y: 18 }, { x: 320, y: 35 },
    { x: 430, y: 20 }, { x: 520, y: 40 }, { x: 560, y: 60 }, { x: 80, y: 65 },
    { x: 250, y: 55 }, { x: 480, y: 55 }, { x: 150, y: 70 }, { x: 380, y: 15 }, { x: 550, y: 25 },
  ];
  const tassels = [100, 180, 260, 340, 420, 500];
  const flowerPetals = [0, 60, 120, 180, 240, 300];
  const flowerL = [{ cx: 140, cy: 175 }, { cx: 160, cy: 168 }];
  const flowerR = [{ cx: 460, cy: 175 }, { cx: 440, cy: 168 }];
  const trail = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: 100 + i * 24,
        y: 260 + Math.sin(i * 0.8) * 5,
        r: 2 + (i % 3) * 0.8,
        c: i % 3 ? "#c9a84c" : "#d4849a",
        o: 0.2 + (i % 4) * 0.05,
      })),
    []
  );
  const lights = useMemo(
    () =>
      Array.from({ length: 20 }, (_, j) => ({
        x: 80 + j * 24,
        y: 56 + Math.sin(j * 0.6) * 6,
      })),
    []
  );

  return (
    <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1a1f" />
          <stop offset="60%" stopColor="#1a4a52" />
          <stop offset="100%" stopColor="#2a6a74" />
        </linearGradient>
        <linearGradient id="stageGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity=".9" />
          <stop offset="100%" stopColor="#8a6d2f" stopOpacity=".7" />
        </linearGradient>
        <linearGradient id="curtain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c1a2a" />
          <stop offset="50%" stopColor="#8b2040" />
          <stop offset="100%" stopColor="#5c1a2a" />
        </linearGradient>
        <radialGradient id="spotlight" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity=".25" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity=".4" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="1.5" /></filter>
        <filter id="softer"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="600" height="280" fill="url(#sky)" />
      <rect width="600" height="280" fill="url(#spotlight)" />
      {stars.map((s, i) => (
        <circle key={"s" + i} cx={s.x} cy={s.y} r={0.8} fill={C.accentLight} opacity={0.5} />
      ))}
      <rect x="80" y="190" width="440" height="90" rx="6" fill="#1a3a42" stroke={C.accent} strokeWidth=".5" opacity=".8" />
      <rect x="80" y="190" width="440" height="4" rx="2" fill="url(#stageGold)" />
      <path d="M80 80 Q80 190 80 190 L120 190 Q115 140 130 100 Q145 80 120 75Z" fill="url(#curtain)" opacity=".7" />
      <path d="M520 80 Q520 190 520 190 L480 190 Q485 140 470 100 Q455 80 480 75Z" fill="url(#curtain)" opacity=".7" />
      <path d="M60 72 Q180 85 300 68 Q420 85 540 72 Q540 55 300 52 Q60 55 60 72Z" fill="url(#curtain)" opacity=".8" />
      <path d="M60 72 Q180 85 300 68 Q420 85 540 72" fill="none" stroke={C.accent} strokeWidth="1.5" opacity=".6" />
      {tassels.map((x, i) => (
        <g key={"t" + i}>
          <line x1={x} y1={72 + (i % 2 ? 4 : -2)} x2={x} y2={88 + (i % 2 ? 4 : -2)} stroke={C.accent} strokeWidth="1" opacity=".5" />
          <circle cx={x} cy={90 + (i % 2 ? 4 : -2)} r="2.5" fill={C.accent} opacity=".5" />
        </g>
      ))}
      <ellipse cx="300" cy="230" rx="70" ry="18" fill="#2a5560" stroke={C.accent} strokeWidth=".8" opacity=".6" />
      <rect x="240" y="210" width="120" height="28" rx="14" fill="#1a4048" stroke={C.accent} strokeWidth=".8" opacity=".7" />
      {flowerL.map((f, fi) => (
        <g key={"fl" + fi}>
          {flowerPetals.map((a, j) => (
            <ellipse
              key={j}
              cx={f.cx + Math.cos((a * Math.PI) / 180) * 10}
              cy={f.cy + Math.sin((a * Math.PI) / 180) * 7}
              rx="6"
              ry="4"
              fill={j % 2 ? C.accent : "#e8a0b0"}
              opacity=".5"
              transform={`rotate(${a} ${f.cx + Math.cos((a * Math.PI) / 180) * 10} ${f.cy + Math.sin((a * Math.PI) / 180) * 7})`}
            />
          ))}
          <circle cx={f.cx} cy={f.cy} r="4" fill={C.accentLight} opacity=".6" />
        </g>
      ))}
      {flowerR.map((f, fi) => (
        <g key={"fr" + fi}>
          {flowerPetals.map((a, j) => (
            <ellipse
              key={j}
              cx={f.cx + Math.cos((a * Math.PI) / 180) * 10}
              cy={f.cy + Math.sin((a * Math.PI) / 180) * 7}
              rx="6"
              ry="4"
              fill={j % 2 ? C.accent : "#e8a0b0"}
              opacity=".5"
              transform={`rotate(${a} ${f.cx + Math.cos((a * Math.PI) / 180) * 10} ${f.cy + Math.sin((a * Math.PI) / 180) * 7})`}
            />
          ))}
          <circle cx={f.cx} cy={f.cy} r="4" fill={C.accentLight} opacity=".6" />
        </g>
      ))}
      {trail.map((p, i) => (
        <circle key={"p" + i} cx={p.x} cy={p.y} r={p.r} fill={p.c} opacity={p.o} />
      ))}
      <path d="M60 62 Q180 52 300 58 Q420 52 540 62" fill="none" stroke={C.accent} strokeWidth=".5" opacity=".3" />
      {lights.map((l, i) => (
        <circle key={"l" + i} cx={l.x} cy={l.y} r="2" fill={C.accentLight} opacity=".5" />
      ))}
      <ellipse cx="300" cy="160" rx="120" ry="80" fill="url(#glow)" filter="url(#softer)" opacity=".4" />
      <text x="300" y="145" textAnchor="middle" fontFamily="'Great Vibes',cursive" fontSize="36" fill={C.accentLight} opacity=".9">
        Valima
      </text>
    </svg>
  );
});

/* ─── ENVELOPE ─── */
function Envelope({ onOpen }) {
  return (
    <button onClick={onOpen} className="envelope" aria-label="Tap to open invitation">
      <div className="env-bg" />
      <div className="env-card">
        <div className="env-pat" />
        <div className="env-bdr" />
        <div className="env-glow" />
        <div className="env-ct">
          <p className="env-inv">You&rsquo;re Invited</p>
          <div className="env-mono">
            <span className="env-ini">A&nbsp;&amp;&nbsp;M</span>
            <span className="env-ring" />
          </div>
          <p className="env-tap">Tap to Open</p>
          <p className="env-hash">{HASHTAG}</p>
        </div>
      </div>
    </button>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-iw">
        <Image
          src={img("/images/cover-image.jpeg")}
          alt="Anas and Maria"
          className="hero-img"
          fill
          priority
          sizes="100vw"
          quality={80}
        />
      </div>
      <div className="hero-o1" />
      <div className="hero-o2" />
      <div className="hero-o3" />
      <div className="hero-fade" />
      <div className="hero-ct">
        <FadeIn delay={0.2}>
          <div className="hero-top">
            <p className="bism" dir="rtl" lang="ar">
              {"\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0670\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650"}
            </p>
            <p className="bism-en">In the name of Allah, the most Gracious and most Merciful</p>
            <div className="hero-dsm">
              <span className="hero-ln" />
              <span className="hero-ht">{"\u2766"}</span>
              <span className="hero-ln" />
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.5}>
          <div className="hero-bot">
            <p className="hero-fam">{GROOM_FAM}</p>
            <p className="hero-it">cordially invite you to the</p>
            <h2 className="hero-ev">Valima Reception</h2>
            <p className="hero-it">of their beloved son</p>
            <h1 className="hero-nm">{GROOM}</h1>
            <div className="hero-dsm" style={{ margin: "6px auto" }}>
              <span className="hero-ln" />
              <span className="hero-amp">&amp;</span>
              <span className="hero-ln" />
            </div>
            <h1 className="hero-nm">{BRIDE}</h1>
            <p className="hero-sf">D/O {BRIDE_FAM}</p>
            <div className="hero-pill">
              <span style={{ color: C.accentLight }}>{"\u2726"}</span>
              <span>Monday, 20 July 2026</span>
            </div>
            <p className="hero-ht2">{HASHTAG}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── COUNTDOWN ─── */
function CDSection() {
  const t = useCountdown(CD_DATE);
  if (!t) return null;
  const units = [
    { v: t.d, l: "Days" },
    { v: t.h, l: "Hours" },
    { v: t.m, l: "Minutes" },
    { v: t.s, l: "Seconds" },
  ];
  return (
    <section className="cd-sec">
      <div className="dot-p" />
      <FadeIn>
        <p className="cd-h">Save the Date</p>
        <p className="cd-dt">Monday &middot; 20 July &middot; 2026</p>
        <p className="cd-sub">Valima Reception</p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="cd-g">
          {units.map((x) => (
            <div key={x.l} className="cd-box">
              <div className="cd-num">{String(x.v).padStart(2, "0")}</div>
              <div className="cd-lbl">{x.l}</div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── EVENT CARD ─── */
function EvCard({ ev, i }) {
  const ours = ev.side === "groom";
  return (
    <FadeIn delay={i * 0.12} className="ev-w">
      <div className={"ev-c" + (ours ? " ev-f" : "")}>
        <div className="ev-pw">
          {ev.photo ? (
            <Image
              src={ev.photo}
              alt={ev.title}
              className="ev-ph"
              fill
              sizes="(max-width: 640px) 75vw, 300px"
              loading="lazy"
              quality={75}
            />
          ) : (
            <ValimaArt />
          )}
          <div className="ev-po" />
          <span
            className="ev-badge"
            style={{ background: ours ? C.teal + "e6" : ev.accent + "bb" }}
          >
            {ev.title}
            {ours ? " \u2726" : ""}
          </span>
          {ours && <span className="ev-our">Our Event</span>}
        </div>
        <div className="ev-det">
          <p className="ev-tag">{ev.tag}</p>
          <div className="ev-meta">
            <div>
              <span className="ml">Date</span>
              <span className="mv">
                {ev.wday}, {ev.date}
              </span>
            </div>
            <div>
              <span className="ml">Time</span>
              <span className="mv">{ev.time}</span>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <span className="ml">Venue</span>
            <p className="mv-ven">{ev.venue}</p>
            <p className="mv-addr">{ev.addr}</p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function Events() {
  return (
    <section className="ev-sec">
      <SH
        overline="The Celebrations"
        title="Our Events"
        subtitle="The Valima is hosted by us. Mehndi & Barat are at the bride's side."
      />
      <div className="ev-scroll">
        {EVENTS.map((e, i) => (
          <EvCard key={e.id} ev={e} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ─── GALLERY ─── */
const GP = [
  { l: "10%", t: "2%", r: -6 },
  { l: "52%", t: "14%", r: 5 },
  { l: "6%", t: "36%", r: -4 },
  { l: "54%", t: "50%", r: 5 },
  { l: "24%", t: "70%", r: -3 },
];

function GallerySection() {
  const [sel, setSel] = useState(null);
  return (
    <section className="gal-sec">
      <SH overline="Memories" title="Our Gallery" subtitle="A glimpse of the journey that brought us here." />
      <ScaleIn>
        <div className="gal-board">
          <div className="gal-pat" />
          {GAL.map((imgItem, i) => {
            const p = GP[i];
            return (
              <div
                key={i}
                className="gal-pol"
                onClick={() => setSel(i)}
                style={{
                  left: p.l,
                  top: p.t,
                  width: "36%",
                  transform: `rotate(${p.r}deg)`,
                }}
              >
                <div className="pol-iw">
                  <Image
                    src={imgItem.src}
                    alt={imgItem.label}
                    className="pol-img"
                    fill
                    sizes="(max-width: 520px) 44vw, 150px"
                    loading="lazy"
                    quality={70}
                    style={{ objectPosition: imgItem.pos || "center" }}
                  />
                </div>
                <p className="pol-lbl">{imgItem.label}</p>
              </div>
            );
          })}
        </div>
      </ScaleIn>
      {sel !== null && (
        <div className="lb" onClick={() => setSel(null)}>
          <div className="lb-in" onClick={(e) => e.stopPropagation()}>
            <Image
              src={GAL[sel].src}
              alt={GAL[sel].label}
              className="lb-img"
              width={560}
              height={700}
              sizes="92vw"
              quality={85}
              style={{ width: "100%", height: "auto" }}
            />
            <p className="lb-lbl">{GAL[sel].label}</p>
            <button className="lb-x" onClick={() => setSel(null)}>
              &#10005;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── VENUE ─── */
function Venue() {
  const [mapRef, mapVis] = useInView(0.05);
  return (
    <section className="ven-sec">
      <SH overline="Find Us" title="The Venue" subtitle="The Valima will be held here." light />
      <FadeIn>
        <div className="ven-card">
          <div className="ven-art">
            <ValimaArt />
            <div className="ven-art-ov" />
            <h3 className="ven-art-t">Parsa Banquet</h3>
          </div>
          <div ref={mapRef} className="ven-map">
            {mapVis && (
              <iframe
                src={MAP_URL}
                width="100%"
                height="100%"
                style={{ border: "none", display: "block" }}
                loading="lazy"
                title="Venue"
                allowFullScreen
              />
            )}
          </div>
          <div className="ven-info">
            <p className="ven-addr">C, 78, Block 14, Gulistan-e-Johar, Karachi</p>
            <p className="ven-date">Monday, 20 July 2026 &middot; 8:00 PM onwards</p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── SCHEDULE ─── */
function Schedule() {
  return (
    <section className="sc-sec">
      <SH overline="Programme" title="Valima Evening" subtitle="Here's how the evening will unfold." />
      <div className="sc-tl">
        <span className="sc-line" />
        {SCHED.map((s, i) => (
          <FadeIn key={i} delay={i * 0.12}>
            <div className="sc-item">
              <span className="sc-dw">
                <span className="sc-dot" />
                <span className="sc-ring" />
              </span>
              <div>
                <p className="sc-time">{s.time}</p>
                <p className="sc-lbl">{s.label}</p>
                <p className="sc-det">{s.detail}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ─── FAMILY ─── */
function Family() {
  return (
    <section className="fam-sec">
      <SH overline="Hosted By" title="The Groom's Family" light />
      <FadeIn>
        <div style={{ textAlign: "center" }}>
          <h3 className="fam-nm">{GROOM_FAM}</h3>
          <p className="fam-role">Parents of the Groom</p>
          <p className="fam-msg">
            &ldquo;It is with hearts full of joy and gratitude that we invite you to celebrate this
            blessed union. Your presence will make our happiness complete.&rdquo;
          </p>
        </div>
      </FadeIn>
      <div className="cts">
        {CONTACTS.map((c, i) => (
          <FadeIn key={i} delay={i * 0.15}>
            <a href={"tel:" + c.phone.replace(/[\s-]/g, "")} className="ct-c">
              <p className="ct-nm">{c.name}</p>
              <p className="ct-role">{c.role}</p>
              <p className="ct-ph">{c.phone}</p>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="foot">
      <div className="ft-ln" />
      <FadeIn>
        <p className="ft-nm">
          {GROOM} &amp; {BRIDE}
        </p>
        <p className="ft-hash">{HASHTAG}</p>
        <p className="ft-love">Made with &hearts; for our loved ones</p>
      </FadeIn>
    </footer>
  );
}

/* ─── MUSIC BUTTON ─── */
function MusicBtn({ playing, onToggle, songIndex }) {
  return (
    <button
      onClick={onToggle}
      className={"mus" + (playing ? " mus-on" : "")}
      aria-label={playing ? "Pause" : "Play"}
      title={playing ? "Now playing: " + SONGS[songIndex].label : "Play music"}
    >
      <span className="mus-icon">{playing ? "\u266B" : "\u266A"}</span>
      {playing && (
        <span className="mus-label">{SONGS[songIndex].label}</span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function Home() {
  const [opened, setOpened] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [songIdx, setSongIdx] = useState(0);
  const audio1Ref = useRef(null);
  const audio2Ref = useRef(null);
  const playSongRef = useRef(null);

  const getAudios = () => [audio1Ref.current, audio2Ref.current];

  playSongRef.current = async (index, { fromStart = true } = {}) => {
    const [a1, a2] = getAudios();
    if (!a1 || !a2) return;

    const current = index === 0 ? a1 : a2;
    const other = index === 0 ? a2 : a1;
    const { startAt } = SONGS[index];

    other.pause();

    try {
      await ensureAudioReady(current);
      current.volume = 0.45;

      if (fromStart || current.ended || current.currentTime < startAt) {
        current.currentTime = startAt;
      }

      await current.play();
      setPlaying(true);
      setSongIdx(index);

      // Preload next song so alternate play is instant
      const next = index === 0 ? a2 : a1;
      ensureAudioReady(next).catch(() => {});
    } catch {
      setPlaying(false);
    }
  };

  function handleOpen() {
    setExiting(true);
    setTimeout(() => {
      setOpened(true);
      playSongRef.current?.(0, { fromStart: true });
    }, 700);
  }

  useEffect(() => {
    const [a1, a2] = getAudios();
    if (!a1 || !a2) return;

    function onEnd1() {
      playSongRef.current?.(1, { fromStart: true });
    }
    function onEnd2() {
      playSongRef.current?.(0, { fromStart: true });
    }

    a1.addEventListener("ended", onEnd1);
    a2.addEventListener("ended", onEnd2);
    return () => {
      a1.removeEventListener("ended", onEnd1);
      a2.removeEventListener("ended", onEnd2);
    };
  }, [opened]);

  function toggleMusic() {
    const [a1, a2] = getAudios();
    if (!a1 || !a2) return;

    if (playing) {
      a1.pause();
      a2.pause();
      setPlaying(false);
      return;
    }

    playSongRef.current?.(songIdx, { fromStart: false });
  }

  return (
    <div>
      {/* ── AUDIO ELEMENTS ── */}
      <audio ref={audio1Ref} src={SONGS[0].src} preload="none" />
      <audio ref={audio2Ref} src={SONGS[1].src} preload="none" />

      {/* ── ENVELOPE ── */}
      {!opened && (
        <div style={{ animation: exiting ? "envExit .7s ease-in forwards" : "none" }}>
          <Envelope onOpen={handleOpen} />
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      {opened && (
        <main style={{ animation: "fadeUp 1s ease-out" }}>
          <Particles />
          <Hero />
          <CDSection />
          <Events />
          <GallerySection />
          <Venue />
          <Schedule />
          <Family />
          <Footer />
          <MusicBtn playing={playing} onToggle={toggleMusic} songIndex={songIdx} />
        </main>
      )}
    </div>
  );
}
