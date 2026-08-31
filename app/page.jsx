"use client";

import { useMemo, useState } from "react";

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
   TIME INPUT
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

  return (
    <div className="w-full min-w-0">
      {/* HOURS + MINUTES */}

      <div className="grid w-full min-w-0 grid-cols-2 gap-3">
        {/* HOURS */}

        <div className="min-w-0">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-neutral-400">
            Hours
          </label>

          <input
            type="number"
            min="0"
            max="24"
            value={hours}
            onChange={(e) => {
              const raw = e.target.value;

              if (raw === "") {
                setValue(`0:${minutes || 0}`);
                return;
              }

              const h = Math.min(24, Math.max(0, Number(raw)));

              const m = Math.min(59, Math.max(0, Number(minutes || 0)));

              updateTotal(h * 60 + m);
            }}
            className="
              block
              h-14
              w-full
              min-w-0
              max-w-full
              appearance-none
              rounded-2xl
              border
              border-neutral-200
              bg-white
              px-3
              text-center
              text-lg
              font-bold
              outline-none
              transition
              focus:border-neutral-900
              focus:ring-2
              focus:ring-neutral-100
              sm:px-4
            "
            aria-label="Screen time hours"
          />
        </div>

        {/* MINUTES */}

        <div className="min-w-0">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-neutral-400">
            Minutes
          </label>

          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => {
              const raw = e.target.value;

              if (raw === "") {
                setValue(`${hours || 0}:0`);
                return;
              }

              const m = Math.min(59, Math.max(0, Number(raw)));

              const h = Math.min(24, Math.max(0, Number(hours || 0)));

              updateTotal(h * 60 + m);
            }}
            className="
              block
              h-14
              w-full
              min-w-0
              max-w-full
              appearance-none
              rounded-2xl
              border
              border-neutral-200
              bg-white
              px-3
              text-center
              text-lg
              font-bold
              outline-none
              transition
              focus:border-neutral-900
              focus:ring-2
              focus:ring-neutral-100
              sm:px-4
            "
            aria-label="Screen time minutes"
          />
        </div>
      </div>

      {/* SLIDER */}

      <div className="mt-5 w-full min-w-0">
        <input
          type="range"
          min="30"
          max="1440"
          step="30"
          value={Math.max(30, totalMinutes)}
          onChange={(e) => updateTotal(Number(e.target.value))}
          className="screen-slider block w-full max-w-full"
          aria-label="Daily screen time slider"
        />

        <div className="mt-2 flex w-full justify-between text-[11px] text-neutral-400">
          <span>30 min</span>
          <span>24 hr</span>
        </div>
      </div>

      {/* QUICK SELECT */}

      <div className="mt-4 flex w-full flex-wrap gap-2">
        {[
          ["1:00", "1 hr"],
          ["2:00", "2 hrs"],
          ["3:00", "3 hrs"],
          ["4:00", "4 hrs"],
          ["6:00", "6 hrs"],
          ["8:00", "8 hrs"],
        ].map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => setValue(v)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              value === v
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================
   LIFESPAN SELECTOR
========================= */

function LifespanSelector({ value, setValue }) {
  return (
    <div className="grid w-full grid-cols-5 gap-2">
      {[70, 75, 80, 85, 90].map((age) => (
        <button
          key={age}
          type="button"
          onClick={() => setValue(age)}
          className={`h-11 min-w-0 rounded-xl text-sm font-bold transition ${
            value === age
              ? "bg-neutral-900 text-white shadow-sm"
              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
          }`}
        >
          {age}
        </button>
      ))}
    </div>
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

  const projectionText = useMemo(
    () =>
      `At ${formatTime(dailyMinutes)}, screens could take about ${fmt(
        projectedYears,
        1,
      )} years of an ${lifespan}-year life.`,
    [dailyMinutes, lifespan, projectedYears],
  );

  async function shareResult() {
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

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {}
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f5] px-5 py-7 text-neutral-900 sm:px-8">
      {/* HEADER */}

      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          className="text-xl font-black tracking-[-0.04em]"
        >
          SCREENED.
        </button>

        <span className="hidden text-[10px] font-bold uppercase tracking-[.22em] text-neutral-400 sm:block">
          Your screen time in perspective
        </span>
      </header>

      {/* RESULT */}

      <section className="mx-auto max-w-4xl pb-20 pt-12 sm:pt-16">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,.05)] sm:p-10">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[.25em] text-neutral-400">
              Your screen time over a lifetime
            </p>

            <div className="mt-5 text-7xl font-black tracking-[-0.09em] sm:text-9xl">
              {fmt(projectedYears, 1)}
            </div>

            <p className="mt-2 text-lg text-neutral-500">
              years of an {lifespan}-year life on screens
            </p>
          </div>

          <div className="mt-9">
            <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-neutral-900 transition-all duration-500"
                style={{
                  width: `${Math.min(percentOfDay, 100)}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[11px] text-neutral-400">
              <span>{fmt(percentOfDay, 1)}% of every day</span>

              <span>{formatTime(dailyMinutes)}</span>
            </div>
          </div>

          {/* SMALLER PROJECTION TEXT */}

          <p className="mx-auto mt-9 max-w-2xl text-center text-base font-medium leading-7 tracking-tight text-neutral-700 sm:text-lg sm:leading-8">
            At <b>{formatTime(dailyMinutes)}</b>, screens could take about{" "}
            <b>{fmt(projectedYears, 1)} years</b> of an{" "}
            <b>{lifespan}-year life</b>.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-neutral-50 p-5">
              <b className="text-2xl font-black">{fmt(projectedDays, 0)}</b>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-neutral-400">
                screen days
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-5">
              <b className="text-2xl font-black">{fmt(percentOfDay, 1)}%</b>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-neutral-400">
                of every day
              </p>
            </div>

            <div className="col-span-2 rounded-2xl bg-neutral-50 p-5 sm:col-span-1">
              <b className="text-2xl font-black">1 in {oneInEvery}</b>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-neutral-400">
                hours of your day
              </p>
            </div>
          </div>
        </div>

        {/* LIFESPAN */}

        <div className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-400">
                Assumed lifespan
              </p>

              <h2 className="mt-1 text-xl font-black tracking-tight">
                How long do you want to assume?
              </h2>
            </div>

            <span className="shrink-0 text-sm font-bold text-neutral-700">
              {lifespan} years
            </span>
          </div>

          <div className="mt-5">
            <LifespanSelector value={lifespan} setValue={setLifespan} />
          </div>
        </div>

        {/* PERSPECTIVE */}

        <div className="mt-6 rounded-[28px] bg-neutral-900 p-6 text-white sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-500">
            Put it into perspective
          </p>

          <p className="mt-4 text-2xl font-medium leading-9 tracking-tight sm:text-3xl">
            That&apos;s roughly <b>1 out of every {oneInEvery} hours</b> of your
            day spent looking at a screen.
          </p>

          <p className="mt-4 text-sm leading-6 text-neutral-400">
            This assumes your current daily screen time stays the same.
          </p>
        </div>

        {/* ACTIONS */}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={shareResult}
            className="h-12 rounded-xl bg-neutral-900 text-sm font-bold text-white transition hover:bg-neutral-700"
          >
            {copied ? "Copied" : "Share result"}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-12 rounded-xl border border-neutral-200 bg-white text-sm font-bold text-neutral-600 transition hover:bg-neutral-50"
          >
            Calculate again
          </button>
        </div>

        <p className="py-10 text-center text-sm italic text-neutral-400">
          Your time is limited. Use it deliberately.
        </p>
      </section>
    </main>
  );
}

/* =========================
   HOME
========================= */

export default function Home() {
  const [dailyTime, setDailyTime] = useState("3:30");

  const [lifespan, setLifespan] = useState(80);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  function calculate() {
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

    setResult({
      dailyMinutes: totalMinutes,
      lifespan,
    });
  }

  if (result) {
    return (
      <Result
        dailyMinutes={result.dailyMinutes}
        initialLifespan={result.lifespan}
        onReset={() => setResult(null)}
      />
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f5] px-5 py-7 text-neutral-900 sm:px-8">
      {/* HEADER */}

      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="text-xl font-black tracking-[-0.04em]">SCREENED.</div>

        <span className="hidden text-[10px] font-bold uppercase tracking-[.22em] text-neutral-400 sm:block">
          Your screen time in perspective
        </span>
      </header>

      {/* HERO */}

      <section className="mx-auto pb-20 pt-14 sm:max-w-5xl sm:pt-24 lg:pt-28">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[.3em] text-neutral-400">
            A simple reality check
          </p>

          <h1
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-5xl
              font-black
              leading-[.92]
              tracking-[-.07em]

              sm:mt-6
              sm:max-w-4xl
              sm:text-7xl
              sm:leading-[.94]
              sm:tracking-[-.075em]

              lg:max-w-5xl
              lg:text-[140px]
              lg:leading-[.92]
              lg:tracking-[-.08em]
            "
          >
            <span className="block whitespace-nowrap">
              You have{" "}
              <span className="relative inline-block font-serif italic font-semibold tracking-[-0.04em] text-[#DC2626]">
                less
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[#DC2626]" />
              </span>{" "}
              time
            </span>

            <span className="mt-2 block">than you think.</span>
          </h1>

          <p
            className="
              mx-auto
              mt-6
              max-w-lg
              text-base
              leading-7
              text-neutral-500

              sm:mt-7
              sm:max-w-xl
              sm:text-lg
              sm:leading-8

              lg:mt-8
              lg:max-w-2xl
              lg:text-lg
            "
          >
            See how much of your life goes to screens.
          </p>
        </div>

        {/* CALCULATOR */}

        <div
          className="
            mx-auto
            mt-10
            w-full
            max-w-xl
            min-w-0
            rounded-[30px]
            border
            border-neutral-200
            bg-white
            p-5
            shadow-[0_20px_70px_rgba(0,0,0,.05)]

            sm:mt-12
            sm:max-w-2xl
            sm:p-8

            lg:mt-14
            lg:max-w-2xl
          "
        >
          {/* DAILY TIME */}

          <div className="min-w-0">
            <label className="mb-3 block text-xs font-bold uppercase tracking-[.18em] text-neutral-500">
              Average daily screen time
            </label>

            <TimeInput value={dailyTime} setValue={setDailyTime} />
          </div>

          {/* LIFESPAN */}

          <div className="mt-8 border-t border-neutral-100 pt-7">
            <div className="flex items-center justify-between gap-4">
              <label className="text-xs font-bold uppercase tracking-[.18em] text-neutral-500">
                Assumed lifespan
              </label>

              <span className="shrink-0 text-sm font-bold text-neutral-900">
                {lifespan} years
              </span>
            </div>

            <div className="mt-4">
              <LifespanSelector value={lifespan} setValue={setLifespan} />
            </div>

            <p className="mt-3 text-xs text-neutral-400">
              80 years is selected by default.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* BUTTON */}

          <button
            type="button"
            onClick={calculate}
            className="
              mt-7
              h-13
              w-full
              rounded-xl
              bg-neutral-900
              font-bold
              text-white
              transition
              hover:bg-neutral-700
              active:scale-[.99]
            "
          >
            Show me the number
          </button>

          <p className="mt-4 text-center text-[11px] text-neutral-400">
            No account. Nothing is saved.
          </p>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="mx-auto max-w-5xl border-t border-neutral-200 py-6 text-center text-xs text-neutral-400">
        SCREENED. · Your time in perspective.
      </footer>
    </main>
  );
}
