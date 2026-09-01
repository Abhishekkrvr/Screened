"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";

const fmt = (n, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);

const formatTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) return `${m} min/day`;
  if (m === 0) return `${h} hr/day`;
  return `${h} hr ${m} min/day`;
};

/* =========================
   SOUND SYSTEM WITH MAC STARTUP CHIME
========================= */

const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "tick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.025);
    } else if (type === "chip") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === "welcome") {
      // ICONIC MACBOOK STARTUP BOOT CHIME (F# Major Warm Resonant Chord)
      const freqs = [92.5, 185.0, 277.18, 369.99, 466.16, 739.99];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        const vol = i === 0 ? 0.08 : 0.05 / (i * 0.5 + 1);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2.3);
      });
    } else if (type === "calculate") {
      const frequencies = [440, 554.37, 659.25, 880];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.03);
        gain.gain.setValueAtTime(0.06 / (i + 1), ctx.currentTime + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5 + i * 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.03);
        osc.stop(ctx.currentTime + 0.6 + i * 0.05);
      });
    } else if (type === "count") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } else if (type === "pop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (e) {}
};

/* =========================
   ANIMATION VARIANTS & CURVES
========================= */

const springConfig = { type: "spring", stiffness: 400, damping: 28 };

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.07,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.07,
      ease: "easeOut",
    },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: i * 0.05,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const pageTransition = {
  initial: { opacity: 0, scale: 0.98, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.98, y: -12, transition: { duration: 0.3, ease: "easeIn" } },
};

/* =========================
   STANDARD LAYOUT COMPONENTS (SUBTLE SPOTLIGHT)
========================= */

function PageBackground({ children }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightBg = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(220, 38, 38, 0.04),
      transparent 80%
    )
  `;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-x-hidden bg-[#f7f7f5] px-5 py-7 text-neutral-900 sm:px-8 group"
    >
      {/* Subtle background glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Card({ children, className = "" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
  }

  const cardGlow = useMotionTemplate`
    radial-gradient(
      400px circle at ${mouseX}px ${mouseY}px,
      rgba(220, 38, 38, 0.06),
      transparent 80%
    )
  `;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[30px] border border-neutral-200/90 bg-white/95 backdrop-blur-sm ${className}`}
      whileHover={{ y: -3, boxShadow: "0 28px 80px rgba(0,0,0,.08)", transition: { duration: 0.3 } }}
    >
      {/* Subtle card interior highlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: cardGlow,
          opacity: opacity,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* =========================
   COMPONENTS
========================= */

function TimeInput({ value, setValue }) {
  const [hours, minutes] = value.split(":");
  const totalMinutes = Number(hours || 0) * 60 + Number(minutes || 0);

  function updateTotal(next) {
    const safe = Math.min(1440, Math.max(0, Math.round(next)));
    const h = Math.floor(safe / 60);
    const m = safe % 60;
    setValue(`${h}:${m}`);
  }

  const inputClass =
    "block h-14 w-full min-w-0 max-w-full appearance-none rounded-2xl border border-neutral-200 bg-white px-3 text-center text-lg font-bold text-neutral-900 outline-none transition-all duration-200 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100 sm:px-4 shadow-sm hover:border-neutral-300";

  return (
    <div className="w-full min-w-0">
      <motion.div className="grid w-full min-w-0 grid-cols-2 gap-3" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div className="min-w-0" variants={fadeUp}>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-neutral-400">Hours</label>
          <input
            type="number"
            min="0"
            max="24"
            value={hours}
            onPointerDown={() => playSound("tick")}
            onChange={(e) => {
              playSound("tick");
              const raw = e.target.value;
              if (raw === "") {
                setValue(`0:${minutes || 0}`);
                return;
              }
              const h = Math.min(24, Math.max(0, Number(raw)));
              const m = Math.min(59, Math.max(0, Number(minutes || 0)));
              updateTotal(h * 60 + m);
            }}
            className={inputClass}
            aria-label="Screen time hours"
          />
        </motion.div>

        <motion.div className="min-w-0" variants={fadeUp}>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-neutral-400">Minutes</label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onPointerDown={() => playSound("tick")}
            onChange={(e) => {
              playSound("tick");
              const raw = e.target.value;
              if (raw === "") {
                setValue(`${hours || 0}:0`);
                return;
              }
              const m = Math.min(59, Math.max(0, Number(raw)));
              const h = Math.min(24, Math.max(0, Number(hours || 0)));
              updateTotal(h * 60 + m);
            }}
            className={inputClass}
            aria-label="Screen time minutes"
          />
        </motion.div>
      </motion.div>

      <motion.div className="mt-5 w-full min-w-0" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <input
          type="range"
          min="30"
          max="1440"
          step="30"
          value={Math.max(30, totalMinutes)}
          onPointerDown={() => playSound("tick")}
          onChange={(e) => {
            playSound("tick");
            updateTotal(Number(e.target.value));
          }}
          className="screen-slider block w-full max-w-full cursor-pointer"
          aria-label="Daily screen time slider"
        />
        <div className="mt-2 flex w-full justify-between text-[11px] font-semibold text-neutral-400">
          <span>30 min</span>
          <span>12 hr</span>
          <span>24 hr</span>
        </div>
      </motion.div>

      <motion.div className="mt-5 flex w-full flex-wrap gap-2" variants={staggerContainer} initial="hidden" animate="visible">
        {[
          ["1:00", "1 hr"],
          ["2:00", "2 hrs"],
          ["3:00", "3 hrs"],
          ["4:00", "4 hrs"],
          ["6:00", "6 hrs"],
          ["8:00", "8 hrs"],
        ].map(([v, label]) => {
          const isSelected = value === v;
          return (
            <motion.button
              key={v}
              type="button"
              onClick={() => {
                playSound("chip");
                setValue(v);
              }}
              variants={scaleUp}
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.94 }}
              className={`relative rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                isSelected ? "text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activePresetPill"
                  className="absolute inset-0 rounded-full bg-neutral-900 shadow-md"
                  transition={springConfig}
                />
              )}
              <span className="relative z-10">{label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

function LifespanSelector({ value, setValue }) {
  return (
    <motion.div className="grid w-full grid-cols-5 gap-2" variants={staggerContainer} initial="hidden" animate="visible">
      {[70, 75, 80, 85, 90].map((age) => {
        const isSelected = value === age;
        return (
          <motion.button
            key={age}
            type="button"
            onClick={() => {
              playSound("chip");
              setValue(age);
            }}
            variants={scaleUp}
            whileHover={{ scale: 1.07, y: -1 }}
            whileTap={{ scale: 0.93 }}
            className={`relative h-11 min-w-0 rounded-xl text-sm font-bold transition-colors ${
              isSelected ? "text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="activeLifespanPill"
                className="absolute inset-0 rounded-xl bg-neutral-900 shadow-sm"
                transition={springConfig}
              />
            )}
            <span className="relative z-10">{age}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

function AnimatedNumber({ value, decimals = 1 }) {
  const display = fmt(value, decimals);
  const chars = display.split("");

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      playSound("count");
      count++;
      if (count > 5) clearInterval(interval);
    }, 90);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <span className="inline-flex">
      {chars.map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          initial={{ y: 50, opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: i * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

/* =========================
   RESULT PAGE
========================= */

function Result({ dailyMinutes, initialLifespan, onReset }) {
  const [lifespan, setLifespan] = useState(initialLifespan);
  const [copied, setCopied] = useState(false);

  const daysPerYear = 365.2425;
  const percentOfDay = (dailyMinutes / 1440) * 100;
  const projectedYears = (dailyMinutes / 1440) * lifespan;
  const projectedDays = projectedYears * daysPerYear;
  const oneInEvery = Math.max(1, Math.round(24 / (dailyMinutes / 60)));

  useEffect(() => {
    playSound("calculate");
  }, []);

  const projectionText = useMemo(
    () =>
      `At ${formatTime(dailyMinutes)}, screens could take about ${fmt(projectedYears, 1)} years of an ${lifespan}-year life.`,
    [dailyMinutes, lifespan, projectedYears]
  );

  async function shareResult() {
    playSound("chip");
    try {
      if (navigator.share) {
        await navigator.share({
          title: "SCREENED.",
          text: projectionText,
        });
        return;
      }
      await navigator.clipboard.writeText(projectionText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  }

  return (
    <PageBackground>
      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <motion.header className="mx-auto flex max-w-5xl items-center justify-between" variants={fadeIn} initial="hidden" animate="visible">
          <motion.button
            type="button"
            onClick={() => {
              playSound("pop");
              onReset();
            }}
            className="text-xl font-black tracking-[-0.04em]"
            whileHover={{ scale: 1.06, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            SCREENED.
          </motion.button>
          <motion.span className="hidden text-[10px] font-bold uppercase tracking-[.22em] text-neutral-400 sm:block" variants={slideInRight} initial="hidden" animate="visible">
            Your screen time in perspective
          </motion.span>
        </motion.header>

        <section className="mx-auto max-w-4xl pb-20 pt-12 sm:pt-16">
          <Card className="p-6 sm:p-10">
            <div className="text-center">
              <motion.p className="text-[11px] font-bold uppercase tracking-[.25em] text-neutral-400" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                Your screen time over a lifetime
              </motion.p>
              <motion.div
                className="mt-5 text-7xl font-black tracking-[-0.09em] text-neutral-900 sm:text-9xl leading-tight py-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnimatedNumber value={projectedYears} />
              </motion.div>
              <motion.p className="mt-2 text-lg font-medium text-neutral-500" variants={fadeUp} initial="hidden" animate="visible" custom={4}>
                years of an {lifespan}-year life on screens
              </motion.p>
            </div>

            <motion.div className="mt-9" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-neutral-100 p-0.5 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-neutral-900"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentOfDay, 100)}%` }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <motion.div className="mt-2.5 flex justify-between text-[11px] font-semibold text-neutral-400" variants={fadeIn} initial="hidden" animate="visible" custom={8}>
                <span>{fmt(percentOfDay, 1)}% of every day</span>
                <span>{formatTime(dailyMinutes)}</span>
              </motion.div>
            </motion.div>

            <motion.p
              className="mx-auto mt-9 max-w-2xl text-center text-base font-medium leading-7 tracking-tight text-neutral-700 sm:text-lg sm:leading-8"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={6}
            >
              At <b>{formatTime(dailyMinutes)}</b>, screens could take about{" "}
              <b className="text-neutral-900">{fmt(projectedYears, 1)} years</b> of an{" "}
              <b>{lifespan}-year life</b>.
            </motion.p>

            <motion.div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div
                className="rounded-2xl bg-neutral-50/80 border border-neutral-100 p-5 shadow-sm"
                variants={scaleUp}
                whileHover={{ y: -4, scale: 1.02, transition: springConfig }}
              >
                <b className="text-2xl font-black text-neutral-900">{fmt(projectedDays, 0)}</b>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-neutral-400">screen days</p>
              </motion.div>
              <motion.div
                className="rounded-2xl bg-neutral-50/80 border border-neutral-100 p-5 shadow-sm"
                variants={scaleUp}
                whileHover={{ y: -4, scale: 1.02, transition: springConfig }}
              >
                <b className="text-2xl font-black text-neutral-900">{fmt(percentOfDay, 1)}%</b>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-neutral-400">of every day</p>
              </motion.div>
              <motion.div
                className="col-span-2 rounded-2xl bg-neutral-50/80 border border-neutral-100 p-5 shadow-sm sm:col-span-1"
                variants={scaleUp}
                whileHover={{ y: -4, scale: 1.02, transition: springConfig }}
              >
                <b className="text-2xl font-black text-neutral-900">1 in {oneInEvery}</b>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-neutral-400">hours of your day</p>
              </motion.div>
            </motion.div>
          </Card>

          <Card className="mt-6 p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-400">Assumed lifespan</p>
                <h2 className="mt-1 text-xl font-black tracking-tight">How long do you want to assume?</h2>
              </div>
              <motion.span
                className="shrink-0 text-sm font-bold text-neutral-700"
                key={lifespan}
                initial={{ scale: 1.35, color: "#DC2626" }}
                animate={{ scale: 1, color: "#404040" }}
                transition={springConfig}
              >
                {lifespan} years
              </motion.span>
            </div>
            <div className="mt-5">
              <LifespanSelector value={lifespan} setValue={setLifespan} />
            </div>
          </Card>

          <motion.div
            className="mt-6 rounded-[28px] bg-neutral-900 p-6 text-white shadow-xl sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            whileHover={{ scale: 1.01, y: -2, transition: springConfig }}
          >
            <motion.p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-400" variants={fadeIn} initial="hidden" animate="visible" custom={8}>
              Put it into perspective
            </motion.p>
            <motion.p className="mt-4 text-2xl font-medium leading-9 tracking-tight sm:text-3xl" variants={fadeUp} initial="hidden" animate="visible" custom={9}>
              That&apos;s roughly <b className="text-white">1 out of every {oneInEvery} hours</b> of your day spent looking at a screen.
            </motion.p>
            <motion.p className="mt-4 text-sm leading-6 text-neutral-400" variants={fadeIn} initial="hidden" animate="visible" custom={10}>
              This assumes your current daily screen time stays the same.
            </motion.p>
          </motion.div>

          <motion.div className="mt-6 grid grid-cols-2 gap-3" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.button
              type="button"
              onClick={shareResult}
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="h-13 rounded-xl bg-neutral-900 text-sm font-bold text-white shadow-md transition-colors hover:bg-neutral-800"
            >
              {copied ? "Copied" : "Share result"}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => {
                playSound("pop");
                onReset();
              }}
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="h-13 rounded-xl border border-neutral-200 bg-white text-sm font-bold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
            >
              Calculate again
            </motion.button>
          </motion.div>

          <motion.p className="py-10 text-center text-sm italic text-neutral-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
            Your time is limited. Use it deliberately.
          </motion.p>
        </section>
      </motion.main>
    </PageBackground>
  );
}

/* =========================
   HOME PAGE
========================= */

export default function Home() {
  const [dailyTime, setDailyTime] = useState("3:30");
  const [lifespan, setLifespan] = useState(80);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    playSound("welcome");
  }, []);

  function calculate() {
    playSound("calculate");
    setError("");
    const [h, m] = dailyTime.split(":").map(Number);
    const hours = Number.isFinite(h) ? h : 0;
    const minutes = Number.isFinite(m) ? m : 0;
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes <= 0) {
      setError("Please enter your daily screen time.");
      return;
    }
    if (totalMinutes > 1440) {
      setError("Screen time cannot be more than 24 hours.");
      return;
    }

    setResult({ dailyMinutes: totalMinutes, lifespan });
  }

  return (
    <AnimatePresence mode="wait">
      {result ? (
        <Result key="result" dailyMinutes={result.dailyMinutes} initialLifespan={result.lifespan} onReset={() => setResult(null)} />
      ) : (
        <PageBackground key="home">
          <motion.main
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
          >
            {/* HEADER */}
            <motion.header className="mx-auto flex max-w-5xl items-center justify-between" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <motion.div className="text-xl font-black tracking-[-0.04em]" whileHover={{ scale: 1.06, rotate: -1 }}>
                SCREENED.
              </motion.div>
              <motion.span className="hidden text-[10px] font-bold uppercase tracking-[.22em] text-neutral-400 sm:block" variants={slideInRight} initial="hidden" animate="visible">
                Your screen time in perspective
              </motion.span>
            </motion.header>

            {/* HERO */}
            <section className="mx-auto pb-20 pt-14 sm:max-w-5xl sm:pt-24 lg:pt-28">
              <div className="text-center">
                <motion.p className="text-[11px] font-bold uppercase tracking-[.3em] text-neutral-400" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                  A simple reality check
                </motion.p>
                <motion.h1
                  className="mx-auto mt-5 max-w-2xl text-5xl font-black leading-[.92] tracking-[-.07em] sm:mt-6 sm:max-w-4xl sm:text-7xl sm:leading-[.94] sm:tracking-[-.075em] lg:max-w-5xl lg:text-[140px] lg:leading-[.92] lg:tracking-[-.08em]"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block whitespace-nowrap">
                    You have{" "}
                    <motion.span
                      className="relative inline-block font-serif italic font-semibold tracking-[-0.04em] text-[#DC2626] cursor-pointer"
                      initial={{ opacity: 0, x: -20, rotateZ: -5 }}
                      animate={{ opacity: 1, x: 0, rotateZ: 0 }}
                      whileHover={{ scale: 1.08, rotateZ: -2 }}
                      transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      less
                      <motion.span
                        className="absolute -bottom-1 left-0 h-[3.5px] w-full rounded-full bg-[#DC2626]"
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
                      />
                    </motion.span>{" "}
                    time
                  </span>
                  <motion.span className="mt-2 block" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                    than you think.
                  </motion.span>
                </motion.h1>
                <motion.p className="mx-auto mt-6 max-w-lg text-base leading-7 text-neutral-500 sm:mt-7 sm:max-w-xl sm:text-lg sm:leading-8 lg:mt-8 lg:max-w-2xl lg:text-lg" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
                  See how much of your life goes to screens.
                </motion.p>
              </div>

              {/* CRAZY SPOTLIGHT CARD WITH BORDER ILLUMINATION */}
              <motion.div
                className="mx-auto mt-10 w-full max-w-xl min-w-0 sm:mt-12 sm:max-w-2xl lg:mt-14 lg:max-w-2xl"
                initial={{ opacity: 0, y: 50, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="p-5 shadow-[0_20px_70px_rgba(0,0,0,.05)] sm:p-8">
                  <div className="min-w-0">
                    <motion.label className="mb-3 block text-xs font-bold uppercase tracking-[.18em] text-neutral-500" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
                      Average daily screen time
                    </motion.label>
                    <TimeInput value={dailyTime} setValue={setDailyTime} />
                  </div>

                  <motion.div className="mt-8 border-t border-neutral-100 pt-7" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-bold uppercase tracking-[.18em] text-neutral-500">
                        Assumed lifespan
                      </label>
                      <motion.span className="shrink-0 text-sm font-bold text-neutral-900" key={lifespan} initial={{ scale: 1.35, color: "#DC2626" }} animate={{ scale: 1, color: "#171717" }} transition={springConfig}>
                        {lifespan} years
                      </motion.span>
                    </div>
                    <div className="mt-4">
                      <LifespanSelector value={lifespan} setValue={setLifespan} />
                    </div>
                    <p className="mt-3 text-xs text-neutral-400">
                      80 years is selected by default.
                    </p>
                  </motion.div>

                  <AnimatePresence>
                    {error && (
                      <motion.p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 font-medium" initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} transition={{ duration: 0.3 }}>
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    onClick={calculate}
                    onPointerDown={() => playSound("tick")}
                    className="mt-7 h-14 w-full rounded-xl bg-neutral-900 font-bold text-white shadow-lg transition-colors hover:bg-neutral-800 active:bg-black"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={7}
                  >
                    Show me the number
                  </motion.button>
                  <motion.p className="mt-4 text-center text-[11px] font-medium text-neutral-400" variants={fadeIn} initial="hidden" animate="visible" custom={9}>
                    No account. Nothing is saved.
                  </motion.p>
                </Card>
              </motion.div>
            </section>

            {/* FOOTER */}
            <motion.footer className="mx-auto max-w-5xl border-t border-neutral-200 py-6 text-center text-xs text-neutral-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}>
              <span className="font-bold text-neutral-500">SCREENED.</span> · Your time in perspective.
            </motion.footer>
          </motion.main>
        </PageBackground>
      )}
    </AnimatePresence>
  );
}
