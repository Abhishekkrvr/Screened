// const fs = require('fs');

// const code = `"use client";

// import { useMemo, useState, useRef, useEffect, memo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toPng } from "html-to-image";

// const fmt = (n, digits = 0) =>
//   new Intl.NumberFormat("en-US", {
//     maximumFractionDigits: digits,
//     minimumFractionDigits: digits,
//   }).format(n);

// const formatTime = (minutes) => {
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;

//   if (h === 0) return \`\${m} min/day\`;
//   if (m === 0) return \`\${h} hr/day\`;
//   return \`\${h} hr \${m} min/day\`;
// };

// /* =========================
//    SOUND SYSTEM
// ========================= */

// const playSound = (type) => {
//   try {
//     const AudioContext = window.AudioContext || window.webkitAudioContext;
//     if (!AudioContext) return;
//     const ctx = new AudioContext();
//     const osc = ctx.createOscillator();
//     const gainNode = ctx.createGain();
    
//     osc.connect(gainNode);
//     gainNode.connect(ctx.destination);
    
//     if (type === 'tick') {
//       // Soft UI click/tick
//       osc.type = 'sine';
//       osc.frequency.setValueAtTime(800, ctx.currentTime);
//       osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
//       gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
//       gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
//       osc.start(ctx.currentTime);
//       osc.stop(ctx.currentTime + 0.05);
//     } else if (type === 'pop') {
//       // Satisfying pop for result
//       osc.type = 'sine';
//       osc.frequency.setValueAtTime(400, ctx.currentTime);
//       osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
//       gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
//       gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
//       osc.start(ctx.currentTime);
//       osc.stop(ctx.currentTime + 0.1);
//     }
//   } catch(e) {
//     // Ignore errors
//   }
// };

// /* =========================
//    ANIMATION VARIANTS
// ========================= */

// const fadeUp = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       delay: i * 0.1,
//       ease: [0.25, 0.46, 0.45, 0.94],
//     },
//   }),
// };

// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     transition: {
//       duration: 0.5,
//       delay: i * 0.1,
//       ease: "easeOut",
//     },
//   }),
// };

// const scaleUp = {
//   hidden: { opacity: 0, scale: 0.9 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.5,
//       delay: i * 0.1,
//       ease: [0.25, 0.46, 0.45, 0.94],
//     },
//   }),
// };

// const staggerContainer = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.08,
//       delayChildren: 0.1,
//     },
//   },
// };

// const slideInRight = {
//   hidden: { opacity: 0, x: 40 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
//   },
// };

// const pageTransition = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
//   exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
// };

// /* =========================
//    COMPONENTS
// ========================= */

// const LifeGrid = memo(function LifeGrid({ lifespan, projectedYears, isDark }) {
//   const totalWeeks = lifespan * 52;
//   const lostWeeks = Math.round(projectedYears * 52);
//   const weeks = Array.from({ length: totalWeeks });

//   return (
//     <div className="mt-8">
//       <div className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-[.15em] text-neutral-400">
//         <span>Life in Weeks</span>
//         <span className="flex items-center gap-2">
//           <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#e63946]"></span> Screens</span>
//           <span className="flex items-center gap-1"><span className={\`h-2 w-2 rounded-sm \${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}\`}></span> Free</span>
//         </span>
//       </div>
//       <div className="flex flex-wrap gap-[3px]">
//         {weeks.map((_, i) => (
//           <div
//             key={i}
//             className={\`h-[6px] w-[6px] rounded-[1px] sm:h-[8px] sm:w-[8px] sm:rounded-sm transition-colors duration-500 \${
//               i < lostWeeks
//                 ? "bg-[#e63946]"
//                 : isDark ? "bg-neutral-800" : "bg-neutral-200"
//             }\`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// });

// function TimeInput({ value, setValue, isDark }) {
//   const [hours, minutes] = value.split(":");
//   const totalMinutes = Number(hours || 0) * 60 + Number(minutes || 0);

//   function updateTotal(next) {
//     const safe = Math.min(1440, Math.max(0, Math.round(next)));
//     const h = Math.floor(safe / 60);
//     const m = safe % 60;
//     setValue(\`\${h}:\${m}\`);
//   }

//   const inputClass = \`
//     block h-14 w-full min-w-0 max-w-full appearance-none rounded-2xl border px-3 text-center text-lg font-bold outline-none transition sm:px-4
//     \${isDark 
//       ? "bg-neutral-800 border-neutral-700 text-white focus:border-white focus:ring-neutral-700" 
//       : "bg-white border-neutral-200 text-neutral-900 focus:border-neutral-900 focus:ring-neutral-100"
//     }
//   \`;

//   return (
//     <div className="w-full min-w-0">
//       <motion.div className="grid w-full min-w-0 grid-cols-2 gap-3" variants={staggerContainer} initial="hidden" animate="visible">
//         <motion.div className="min-w-0" variants={fadeUp}>
//           <label className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-neutral-400">Hours</label>
//           <input
//             type="number"
//             min="0"
//             max="24"
//             value={hours}
//             onPointerDown={() => playSound('tick')}
//             onChange={(e) => {
//               const raw = e.target.value;
//               if (raw === "") { setValue(\`0:\${minutes || 0}\`); return; }
//               const h = Math.min(24, Math.max(0, Number(raw)));
//               const m = Math.min(59, Math.max(0, Number(minutes || 0)));
//               updateTotal(h * 60 + m);
//             }}
//             className={inputClass}
//             aria-label="Screen time hours"
//           />
//         </motion.div>

//         <motion.div className="min-w-0" variants={fadeUp}>
//           <label className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-neutral-400">Minutes</label>
//           <input
//             type="number"
//             min="0"
//             max="59"
//             value={minutes}
//             onPointerDown={() => playSound('tick')}
//             onChange={(e) => {
//               const raw = e.target.value;
//               if (raw === "") { setValue(\`\${hours || 0}:0\`); return; }
//               const m = Math.min(59, Math.max(0, Number(raw)));
//               const h = Math.min(24, Math.max(0, Number(hours || 0)));
//               updateTotal(h * 60 + m);
//             }}
//             className={inputClass}
//             aria-label="Screen time minutes"
//           />
//         </motion.div>
//       </motion.div>

//       <motion.div className="mt-5 w-full min-w-0" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
//         <input
//           type="range"
//           min="30"
//           max="1440"
//           step="30"
//           value={Math.max(30, totalMinutes)}
//           onPointerDown={() => playSound('tick')}
//           onChange={(e) => {
//             playSound('tick');
//             updateTotal(Number(e.target.value));
//           }}
//           className="screen-slider block w-full max-w-full"
//           aria-label="Daily screen time slider"
//         />
//         <div className="mt-2 flex w-full justify-between text-[11px] text-neutral-400">
//           <span>30 min</span>
//           <span>24 hr</span>
//         </div>
//       </motion.div>

//       <motion.div className="mt-4 flex w-full flex-wrap gap-2" variants={staggerContainer} initial="hidden" animate="visible">
//         {[["1:00", "1 hr"], ["2:00", "2 hrs"], ["3:00", "3 hrs"], ["4:00", "4 hrs"], ["6:00", "6 hrs"], ["8:00", "8 hrs"]].map(([v, label]) => (
//           <motion.button
//             key={v}
//             type="button"
//             onClick={() => { playSound('pop'); setValue(v); }}
//             variants={scaleUp}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className={\`rounded-full px-3 py-1.5 text-xs font-bold transition \${
//               value === v
//                 ? isDark ? "bg-white text-black" : "bg-neutral-900 text-white"
//                 : isDark ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
//             }\`}
//           >
//             {label}
//           </motion.button>
//         ))}
//       </motion.div>
//     </div>
//   );
// }

// function LifespanSelector({ value, setValue, isDark }) {
//   return (
//     <motion.div className="grid w-full grid-cols-5 gap-2" variants={staggerContainer} initial="hidden" animate="visible">
//       {[70, 75, 80, 85, 90].map((age) => (
//         <motion.button
//           key={age}
//           type="button"
//           onClick={() => { playSound('pop'); setValue(age); }}
//           variants={scaleUp}
//           whileHover={{ scale: 1.06 }}
//           whileTap={{ scale: 0.94 }}
//           className={\`h-11 min-w-0 rounded-xl text-sm font-bold transition \${
//             value === age
//               ? isDark ? "bg-white text-black shadow-sm" : "bg-neutral-900 text-white shadow-sm"
//               : isDark ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
//           }\`}
//         >
//           {age}
//         </motion.button>
//       ))}
//     </motion.div>
//   );
// }

// function AnimatedNumber({ value, decimals = 1 }) {
//   const display = fmt(value, decimals);
//   const chars = display.split("");

//   useEffect(() => {
//     // Play a few ticks when number animates
//     let count = 0;
//     const interval = setInterval(() => {
//       playSound('tick');
//       count++;
//       if (count > 5) clearInterval(interval);
//     }, 100);
//     return () => clearInterval(interval);
//   }, [value]);

//   return (
//     <span className="inline-flex">
//       {chars.map((char, i) => (
//         <motion.span
//           key={\`\${i}-\${char}\`}
//           initial={{ y: 40, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
//           className="inline-block"
//         >
//           {char}
//         </motion.span>
//       ))}
//     </span>
//   );
// }

// /* =========================
//    RESULT PAGE
// ========================= */

// function Result({ dailyMinutes, initialLifespan, onReset }) {
//   const [lifespan, setLifespan] = useState(initialLifespan);
//   const [copied, setCopied] = useState(false);
//   const resultRef = useRef(null);

//   const daysPerYear = 365.2425;
//   const percentOfDay = (dailyMinutes / 1440) * 100;
//   const projectedYears = (dailyMinutes / 1440) * lifespan;
//   const projectedDays = projectedYears * daysPerYear;
//   const projectedHours = projectedDays * 24;
//   const oneInEvery = Math.max(1, Math.round(24 / (dailyMinutes / 60)));
  
//   // Alternative uses stats
//   const books = Math.floor(projectedHours / 6);
//   const languages = Math.floor(projectedHours / 500);
//   const earthWalk = (projectedHours / 8000).toFixed(1);

//   const isDarkTheme = dailyMinutes >= 360;

//   useEffect(() => {
//     // Satisfying sound on mount
//     playSound('pop');
//   }, []);

//   const projectionText = useMemo(
//     () =>
//       \`At \${formatTime(dailyMinutes)}, screens could take about \${fmt(projectedYears, 1)} years of an \${lifespan}-year life.\`,
//     [dailyMinutes, lifespan, projectedYears]
//   );

//   async function shareResult() {
//     playSound('pop');
//     try {
//       if (resultRef.current) {
//         // Generate image
//         const dataUrl = await toPng(resultRef.current, { cacheBust: true, backgroundColor: isDarkTheme ? '#171717' : '#ffffff' });
        
//         // Try native share first
//         if (navigator.share) {
//           try {
//             const blob = await (await fetch(dataUrl)).blob();
//             const file = new File([blob], 'screened-result.png', { type: blob.type });
//             if (navigator.canShare && navigator.canShare({ files: [file] })) {
//               await navigator.share({
//                 title: "SCREENED.",
//                 text: projectionText,
//                 files: [file]
//               });
//               return;
//             }
//           } catch(e) {
//             // Fallback to text share or download
//           }
//         }
        
//         // Fallback to download
//         const link = document.createElement('a');
//         link.download = 'screened-result.png';
//         link.href = dataUrl;
//         link.click();
//       } else {
//         await navigator.clipboard.writeText(projectionText);
//       }
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   const themeClasses = isDarkTheme 
//     ? "bg-[#111111] text-white" 
//     : "bg-[#f7f7f5] text-neutral-900";

//   const cardClasses = isDarkTheme
//     ? "bg-[#171717] border-[#2a2a2a] shadow-none"
//     : "bg-white border-neutral-200 shadow-[0_24px_80px_rgba(0,0,0,.05)]";

//   const statCardClasses = isDarkTheme
//     ? "bg-[#222222]"
//     : "bg-neutral-50";

//   return (
//     <motion.main
//       className={\`min-h-screen overflow-x-hidden px-5 py-7 sm:px-8 transition-colors duration-1000 \${themeClasses}\`}
//       initial="initial"
//       animate="animate"
//       exit="exit"
//       variants={pageTransition}
//     >
//       {/* HEADER */}
//       <motion.header className="mx-auto flex max-w-5xl items-center justify-between" variants={fadeIn} initial="hidden" animate="visible">
//         <motion.button
//           type="button"
//           onClick={() => { playSound('pop'); onReset(); }}
//           className="text-xl font-black tracking-[-0.04em]"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           SCREENED.
//         </motion.button>
//         <motion.span className="hidden text-[10px] font-bold uppercase tracking-[.22em] text-neutral-400 sm:block" variants={slideInRight} initial="hidden" animate="visible">
//           Your screen time in perspective
//         </motion.span>
//       </motion.header>

//       {/* RESULT */}
//       <section className="mx-auto max-w-4xl pb-20 pt-12 sm:pt-16">
//         <div ref={resultRef} className="rounded-[32px] p-2 -m-2">
//           <motion.div
//             className={\`rounded-[32px] border p-6 sm:p-10 transition-colors duration-1000 \${cardClasses}\`}
//             initial={{ opacity: 0, y: 50, scale: 0.96 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
//           >
//             <div className="text-center">
//               <motion.p className="text-[11px] font-bold uppercase tracking-[.25em] text-neutral-400" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
//                 Your screen time over a lifetime
//               </motion.p>
//               <motion.div
//                 className={\`mt-5 text-7xl font-black tracking-[-0.09em] sm:text-9xl \${isDarkTheme ? 'text-[#e63946]' : ''}\`}
//                 initial={{ opacity: 0, scale: 0.5 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94], type: "spring", stiffness: 100 }}
//               >
//                 <AnimatedNumber value={projectedYears} />
//               </motion.div>
//               <motion.p className="mt-2 text-lg text-neutral-500" variants={fadeUp} initial="hidden" animate="visible" custom={4}>
//                 years of an {lifespan}-year life on screens
//               </motion.p>
//             </div>

//             {/* PROGRESS BAR */}
//             <motion.div className="mt-9" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
//               <div className={\`h-3 w-full overflow-hidden rounded-full \${isDarkTheme ? 'bg-neutral-800' : 'bg-neutral-100'}\`}>
//                 <motion.div
//                   className={\`h-full rounded-full \${isDarkTheme ? 'bg-[#e63946]' : 'bg-neutral-900'}\`}
//                   initial={{ width: 0 }}
//                   animate={{ width: \`\${Math.min(percentOfDay, 100)}%\` }}
//                   transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
//                 />
//               </div>
//               <motion.div className="mt-2 flex justify-between text-[11px] text-neutral-400" variants={fadeIn} initial="hidden" animate="visible" custom={8}>
//                 <span>{fmt(percentOfDay, 1)}% of every day</span>
//                 <span>{formatTime(dailyMinutes)}</span>
//               </motion.div>
//             </motion.div>

//             {/* SMALLER PROJECTION TEXT */}
//             <motion.p
//               className={\`mx-auto mt-9 max-w-2xl text-center text-base font-medium leading-7 tracking-tight sm:text-lg sm:leading-8 \${isDarkTheme ? 'text-neutral-300' : 'text-neutral-700'}\`}
//               variants={fadeUp} initial="hidden" animate="visible" custom={6}
//             >
//               At <b>{formatTime(dailyMinutes)}</b>, screens could take about{" "}
//               <b>{fmt(projectedYears, 1)} years</b> of an{" "}
//               <b>{lifespan}-year life</b>.
//             </motion.p>

//             {/* LIFE IN WEEKS GRID */}
//             <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
//               <LifeGrid lifespan={lifespan} projectedYears={projectedYears} isDark={isDarkTheme} />
//             </motion.div>

//             {/* STAT CARDS */}
//             <motion.div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" variants={staggerContainer} initial="hidden" animate="visible">
//               <motion.div className={\`rounded-2xl p-5 \${statCardClasses}\`} variants={scaleUp} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
//                 <b className="text-2xl font-black">{fmt(projectedDays, 0)}</b>
//                 <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-neutral-400">screen days</p>
//               </motion.div>
//               <motion.div className={\`rounded-2xl p-5 \${statCardClasses}\`} variants={scaleUp} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
//                 <b className="text-2xl font-black">{fmt(percentOfDay, 1)}%</b>
//                 <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-neutral-400">of every day</p>
//               </motion.div>
//               <motion.div className={\`col-span-2 rounded-2xl p-5 sm:col-span-1 \${statCardClasses}\`} variants={scaleUp} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
//                 <b className="text-2xl font-black">1 in {oneInEvery}</b>
//                 <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-neutral-400">hours of your day</p>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* ALTERNATIVE USES SECTION */}
//         <motion.div
//           className={\`mt-6 rounded-[28px] border p-6 sm:p-8 transition-colors duration-1000 \${cardClasses}\`}
//           initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
//         >
//           <p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-400">What else could you do?</p>
//           <h2 className="mt-1 text-xl font-black tracking-tight">With {fmt(projectedHours, 0)} hours, you could...</h2>
          
//           <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
//              <div className={\`rounded-2xl p-5 \${isDarkTheme ? 'bg-[#222]' : 'bg-neutral-50'}\`}>
//                 <div className="text-3xl mb-2">📚</div>
//                 <b className="text-xl font-black">{fmt(books)}</b>
//                 <p className="text-xs font-medium text-neutral-400">Books read</p>
//              </div>
//              <div className={\`rounded-2xl p-5 \${isDarkTheme ? 'bg-[#222]' : 'bg-neutral-50'}\`}>
//                 <div className="text-3xl mb-2">🌍</div>
//                 <b className="text-xl font-black">{fmt(languages)}</b>
//                 <p className="text-xs font-medium text-neutral-400">Languages learned</p>
//              </div>
//              <div className={\`rounded-2xl p-5 \${isDarkTheme ? 'bg-[#222]' : 'bg-neutral-50'}\`}>
//                 <div className="text-3xl mb-2">🚶</div>
//                 <b className="text-xl font-black">{earthWalk}x</b>
//                 <p className="text-xs font-medium text-neutral-400">Walk around Earth</p>
//              </div>
//           </div>
//         </motion.div>

//         {/* LIFESPAN */}
//         <motion.div
//           className={\`mt-6 rounded-[28px] border p-6 sm:p-8 transition-colors duration-1000 \${cardClasses}\`}
//           initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
//         >
//           <div className="flex items-end justify-between gap-4">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-400">Assumed lifespan</p>
//               <h2 className="mt-1 text-xl font-black tracking-tight">How long do you want to assume?</h2>
//             </div>
//             <motion.span
//               className="shrink-0 text-sm font-bold"
//               key={lifespan}
//               initial={{ scale: 1.3, color: "#e63946" }}
//               animate={{ scale: 1, color: isDarkTheme ? "#a3a3a3" : "#404040" }}
//               transition={{ duration: 0.3 }}
//             >
//               {lifespan} years
//             </motion.span>
//           </div>
//           <div className="mt-5">
//             <LifespanSelector value={lifespan} setValue={setLifespan} isDark={isDarkTheme} />
//           </div>
//         </motion.div>

//         {/* PERSPECTIVE */}
//         <motion.div
//           className={\`mt-6 rounded-[28px] p-6 text-white sm:p-8 \${isDarkTheme ? 'bg-[#222]' : 'bg-neutral-900'}\`}
//           initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}
//           whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
//         >
//           <motion.p className="text-[11px] font-bold uppercase tracking-[.2em] text-neutral-500" variants={fadeIn} initial="hidden" animate="visible" custom={8}>
//             Put it into perspective
//           </motion.p>
//           <motion.p className="mt-4 text-2xl font-medium leading-9 tracking-tight sm:text-3xl" variants={fadeUp} initial="hidden" animate="visible" custom={9}>
//             That&apos;s roughly <b>1 out of every {oneInEvery} hours</b> of your day spent looking at a screen.
//           </motion.p>
//           <motion.p className="mt-4 text-sm leading-6 text-neutral-400" variants={fadeIn} initial="hidden" animate="visible" custom={10}>
//             This assumes your current daily screen time stays the same.
//           </motion.p>
//         </motion.div>

//         {/* ACTIONS */}
//         <motion.div className="mt-6 grid grid-cols-2 gap-3" variants={staggerContainer} initial="hidden" animate="visible">
//           <motion.button
//             type="button"
//             onClick={shareResult}
//             variants={fadeUp}
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             className={\`h-12 rounded-xl text-sm font-bold transition \${isDarkTheme ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-neutral-700'}\`}
//           >
//             {copied ? "Image Generated!" : "Share Image"}
//           </motion.button>
//           <motion.button
//             type="button"
//             onClick={() => { playSound('pop'); onReset(); }}
//             variants={fadeUp}
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             className={\`h-12 rounded-xl border text-sm font-bold transition \${isDarkTheme ? 'border-[#333] bg-[#171717] text-white hover:bg-[#222]' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'}\`}
//           >
//             Calculate again
//           </motion.button>
//         </motion.div>

//         <motion.p className="py-10 text-center text-sm italic text-neutral-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
//           Your time is limited. Use it deliberately.
//         </motion.p>
//       </section>
//     </motion.main>
//   );
// }

// /* =========================
//    HOME
// ========================= */

// export default function Home() {
//   const [dailyTime, setDailyTime] = useState("3:30");
//   const [lifespan, setLifespan] = useState(80);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   function calculate() {
//     playSound('pop');
//     setError("");
//     const [h, m] = dailyTime.split(":").map(Number);
//     const hours = Number.isFinite(h) ? h : 0;
//     const minutes = Number.isFinite(m) ? m : 0;
//     const totalMinutes = hours * 60 + minutes;

//     if (totalMinutes <= 0) {
//       setError("Please enter your daily screen time.");
//       return;
//     }
//     if (totalMinutes > 1440) {
//       setError("Screen time cannot be more than 24 hours.");
//       return;
//     }

//     setResult({ dailyMinutes: totalMinutes, lifespan });
//   }

//   return (
//     <AnimatePresence mode="wait">
//       {result ? (
//         <Result key="result" dailyMinutes={result.dailyMinutes} initialLifespan={result.lifespan} onReset={() => setResult(null)} />
//       ) : (
//         <motion.main
//           key="home"
//           className="min-h-screen overflow-x-hidden bg-[#f7f7f5] px-5 py-7 text-neutral-900 sm:px-8"
//           initial="initial"
//           animate="animate"
//           exit="exit"
//           variants={pageTransition}
//         >
//           {/* HEADER */}
//           <motion.header className="mx-auto flex max-w-5xl items-center justify-between" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
//             <motion.div className="text-xl font-black tracking-[-0.04em]" whileHover={{ scale: 1.05 }}>
//               SCREENED.
//             </motion.div>
//             <motion.span className="hidden text-[10px] font-bold uppercase tracking-[.22em] text-neutral-400 sm:block" variants={slideInRight} initial="hidden" animate="visible">
//               Your screen time in perspective
//             </motion.span>
//           </motion.header>

//           {/* HERO */}
//           <section className="mx-auto pb-20 pt-14 sm:max-w-5xl sm:pt-24 lg:pt-28">
//             <div className="text-center">
//               <motion.p className="text-[11px] font-bold uppercase tracking-[.3em] text-neutral-400" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
//                 A simple reality check
//               </motion.p>
//               <motion.h1 className="mx-auto mt-5 max-w-2xl text-5xl font-black leading-[.92] tracking-[-.07em] sm:mt-6 sm:max-w-4xl sm:text-7xl sm:leading-[.94] sm:tracking-[-.075em] lg:max-w-5xl lg:text-[140px] lg:leading-[.92] lg:tracking-[-.08em]" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}>
//                 <span className="block whitespace-nowrap">
//                   You have{" "}
//                   <motion.span className="relative inline-block font-serif italic font-semibold tracking-[-0.04em] text-[#DC2626]" initial={{ opacity: 0, x: -20, rotateZ: -5 }} animate={{ opacity: 1, x: 0, rotateZ: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
//                     less
//                     <motion.span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[#DC2626]" initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }} />
//                   </motion.span>{" "}
//                   time
//                 </span>
//                 <motion.span className="mt-2 block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
//                   than you think.
//                 </motion.span>
//               </motion.h1>
//               <motion.p className="mx-auto mt-6 max-w-lg text-base leading-7 text-neutral-500 sm:mt-7 sm:max-w-xl sm:text-lg sm:leading-8 lg:mt-8 lg:max-w-2xl lg:text-lg" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
//                 See how much of your life goes to screens.
//               </motion.p>
//             </div>

//             {/* CALCULATOR */}
//             <motion.div className="mx-auto mt-10 w-full max-w-xl min-w-0 rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_20px_70px_rgba(0,0,0,.05)] sm:mt-12 sm:max-w-2xl sm:p-8 lg:mt-14 lg:max-w-2xl" initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
//               <div className="min-w-0">
//                 <motion.label className="mb-3 block text-xs font-bold uppercase tracking-[.18em] text-neutral-500" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
//                   Average daily screen time
//                 </motion.label>
//                 <TimeInput value={dailyTime} setValue={setDailyTime} isDark={false} />
//               </div>

//               <motion.div className="mt-8 border-t border-neutral-100 pt-7" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
//                 <div className="flex items-center justify-between gap-4">
//                   <label className="text-xs font-bold uppercase tracking-[.18em] text-neutral-500">
//                     Assumed lifespan
//                   </label>
//                   <motion.span className="shrink-0 text-sm font-bold text-neutral-900" key={lifespan} initial={{ scale: 1.3, color: "#e63946" }} animate={{ scale: 1, color: "#171717" }} transition={{ duration: 0.3 }}>
//                     {lifespan} years
//                   </motion.span>
//                 </div>
//                 <div className="mt-4">
//                   <LifespanSelector value={lifespan} setValue={setLifespan} isDark={false} />
//                 </div>
//                 <p className="mt-3 text-xs text-neutral-400">
//                   80 years is selected by default.
//                 </p>
//               </motion.div>

//               <AnimatePresence>
//                 {error && (
//                   <motion.p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} transition={{ duration: 0.3 }}>
//                     {error}
//                   </motion.p>
//                 )}
//               </AnimatePresence>

//               <motion.button type="button" onClick={calculate} onPointerDown={() => playSound('tick')} className="mt-7 h-13 w-full rounded-xl bg-neutral-900 font-bold text-white transition hover:bg-neutral-700" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} variants={fadeUp} initial="hidden" animate="visible" custom={7}>
//                 Show me the number
//               </motion.button>
//               <motion.p className="mt-4 text-center text-[11px] text-neutral-400" variants={fadeIn} initial="hidden" animate="visible" custom={9}>
//                 No account. Nothing is saved.
//               </motion.p>
//             </motion.div>
//           </section>

//           {/* FOOTER */}
//           <motion.footer className="mx-auto max-w-5xl border-t border-neutral-200 py-6 text-center text-xs text-neutral-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}>
//             <span style={{ fontStyle: 'italic', color: '#e63946' }}>S</span>CREENED. · Your time in perspective.
//           </motion.footer>
//         </motion.main>
//       )}
//     </AnimatePresence>
//   );
// }
// `

// fs.writeFileSync('app/page.jsx', code);
