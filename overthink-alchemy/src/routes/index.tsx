import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Check,
  Clipboard,
  Dices,
  Home,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  Share2,
  ShieldAlert,
  Sparkles,
  Square,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overthink OS — Unnecessarily Difficult Decisions" },
      {
        name: "description",
        content: "Turn simple questions into absurdly detailed fictional analysis with Overthink OS.",
      },
      { property: "og:title", content: "Overthink OS — Unnecessarily Difficult Decisions" },
      {
        property: "og:description",
        content: "A uselessly sophisticated decision machine powered by imaginary intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OverthinkOS,
});

type Stage = "welcome" | "analysis" | "result";
type Level = 0 | 1 | 2 | 3;

type Result = {
  status: string;
  risks: { label: string; value: number }[];
  opinions: string[];
  confidence: number;
  score: number;
  recommendation: string;
  branches: { title: string; steps: string[] }[];
  experts: number;
  futures: number;
};

const LEVELS: { title: string; detail: string; color: string }[] = [
  { title: "Slightly Confused", detail: "A light spiral", color: "bg-signal-green" },
  { title: "Serious Overthinking", detail: "Several unnecessary tabs", color: "bg-signal-yellow" },
  { title: "Existential Crisis", detail: "Reality may be questioned", color: "bg-signal-orange" },
  { title: "PhD in Overthinking", detail: "Peer-reviewed panic", color: "bg-signal-red" },
];

const EXAMPLES = [
  "Should I drink tea or coffee?",
  "Should I attend the hackathon?",
  "Should I study or sleep?",
  "Should I text my friend?",
  "Should I buy this phone?",
  "Should I go outside today?",
];

const RANDOM_QUESTIONS = [
  "Should I open Instagram or continue pretending to study?",
  "Is my phone charging or am I charging my phone?",
  "Should I sleep now or regret it tomorrow?",
  "Should I attend class or watch the recording?",
  "Is this project useless enough?",
  "Should I submit this project or overthink it again?",
  "Should I buy another water bottle?",
  "Why did I open this app?",
];

const ANALYSIS_MESSAGES = [
  "Initialising unnecessary thoughts...",
  "Collecting irrelevant data...",
  "Consulting imaginary experts...",
  "Calculating possible regrets...",
  "Analysing 47 possible futures...",
  "Asking people who are also confused...",
  "Rechecking the previous analysis...",
  "Making the simple answer complicated...",
];

const STATUSES = [
  "Decision unstable",
  "Thought process overloaded",
  "Common sense temporarily unavailable",
  "Too many possibilities detected",
  "Decision requires committee approval",
];

const RECOMMENDATIONS = [
  "Think about it for another 3 hours.",
  "Ask 5 people and ignore all of them.",
  "Create a spreadsheet before deciding.",
  "Postpone the decision until further notice.",
  "The safest option is to do nothing.",
  "This decision requires a committee meeting.",
  "Please consult your future self.",
  "You have successfully avoided making a decision.",
  'The answer is probably “maybe.”',
  "Reconsider everything.",
];

const OPINIONS = [
  "According to my completely imaginary research, this decision has consequences.",
  "Have you considered not deciding?",
  "This matter requires at least 4 more opinions.",
  "The data strongly suggests that we need more data.",
  "Every option is optimal if the chart is confusing enough.",
  "I recommend a controlled trial involving snacks.",
  "We cannot rule out the possibility of mild inconvenience.",
];

const EXPERTS = [
  ["Professor of Unnecessary Decisions", "PUD"],
  ["Senior Regret Analyst", "SRA"],
  ["Chief Overthinking Officer", "COO"],
];

function randomFrom<T>(items: readonly [T, ...T[]]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeResult(question: string, level: Level): Result {
  const intensity = level * 5;
  const isHackathonWin = question.toLowerCase().includes("win this hackathon");
  const opinions = [...OPINIONS].sort(() => Math.random() - 0.5).slice(0, 3);
  const riskLabels = [
    "Chance of success",
    "Chance of regret",
    "Chance of changing your mind",
    "Chance of asking someone else",
    "Chance of doing nothing",
  ];

  return {
    status: randomFrom(STATUSES as [string, ...string[]]),
    risks: riskLabels.map((label, index) => ({
      label,
      value: Math.min(99, randomBetween(index === 0 ? 28 : 42, 88) + intensity),
    })),
    opinions,
    confidence: randomBetween(5, 35),
    score: randomBetween(62 + level * 8, Math.min(100, 82 + level * 6)),
    recommendation: isHackathonWin ? "Ask another judge." : randomFrom(RECOMMENDATIONS as [string, ...string[]]),
    branches: [
      {
        title: "YES",
        steps: ["Commit immediately", "Question the commitment", randomFrom(["Tell everyone", "Make a spreadsheet", "Feel briefly powerful"]), "Think about it at 2 AM"],
      },
      {
        title: "NO",
        steps: ["Avoid commitment", "Imagine the other timeline", randomFrom(["Open 14 tabs", "Ask the group chat", "Make tea instead"]), "Regret with confidence"],
      },
    ],
    experts: randomBetween(12 + intensity, 49 + intensity),
    futures: randomBetween(47 + intensity * 2, 183 + intensity * 4),
  };
}

function ActionButton({
  children,
  onClick,
  variant = "secondary",
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} className={`action-button action-${variant} ${className}`}>
      {children}
    </button>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3" aria-label="Overthink OS">
      <span className="brand-mark"><BrainCircuit size={22} /></span>
      <span className="font-display text-base font-extrabold tracking-[0.12em] sm:text-lg">OVERTHINK<span className="text-primary"> OS</span></span>
    </div>
  );
}

function Shell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <main className="app-shell">
      <div className="grid-noise" aria-hidden="true" />
      <div className="scan-line" aria-hidden="true" />
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Brand />
        <div className="system-live"><span /> SYSTEM ONLINE</div>
      </header>
      <div className={`relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 ${compact ? "pb-10" : "pb-16"}`}>{children}</div>
      <footer className="relative z-10 border-t border-border/60 px-5 py-6 text-center text-xs leading-relaxed text-muted-foreground">
        OverthinkOS is a fictional entertainment project. It does not provide real advice, predictions, or scientific analysis. Please use your own brain.
      </footer>
    </main>
  );
}

function Welcome({
  question,
  setQuestion,
  level,
  setLevel,
  start,
  error,
  randomize,
}: {
  question: string;
  setQuestion: (value: string) => void;
  level: Level;
  setLevel: (level: Level) => void;
  start: () => void;
  error: string;
  randomize: () => void;
}) {
  return (
    <Shell>
      <section className="mx-auto flex min-h-[calc(100vh-170px)] max-w-5xl flex-col justify-center py-10 sm:py-16">
        <div className="animate-fade-in text-center">
          <div className="eyebrow mx-auto"><Sparkles size={14} /> IMAGINARY INTELLIGENCE v0.0.1</div>
          <h1 className="mt-7 font-display text-5xl font-black leading-[0.96] tracking-normal text-foreground sm:text-7xl lg:text-8xl">
            Simple question.<br /><span className="title-accent">Absurd analysis.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Enter a simple question. Receive a completely unnecessary analysis.
          </p>
        </div>

        <div className="control-panel mx-auto mt-10 w-full max-w-3xl animate-scale-in">
          <div className="panel-label"><span>01</span> INPUT YOUR DILEMMA</div>
          <label htmlFor="question" className="sr-only">Question to overthink</label>
          <div className={`question-wrap ${error ? "has-error" : ""}`}>
            <textarea
              id="question"
              rows={2}
              maxLength={240}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") start();
              }}
              placeholder="Should I drink tea or coffee?"
              aria-describedby={error ? "input-error" : undefined}
            />
            <span className="char-count">{question.length}/240</span>
          </div>
          {error && <p id="input-error" role="alert" className="error-message"><AlertTriangle size={15} /> {error}</p>}

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="panel-label mb-0"><span>02</span> SELECT THINKING INTENSITY</div>
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">HIGHER = LESS HELPFUL</span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {LEVELS.map((item, index) => (
              <button
                type="button"
                key={item.title}
                onClick={() => setLevel(index as Level)}
                className={`level-option ${level === index ? "active" : ""}`}
                aria-pressed={level === index}
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
                <span className="min-w-0 text-left"><strong>{item.title}</strong><small>{item.detail}</small></span>
                {level === index && <Check size={17} className="ml-auto shrink-0 text-primary" />}
              </button>
            ))}
          </div>

          <ActionButton onClick={start} variant="primary" className="mt-6 w-full text-base">
            <BrainCircuit size={20} /> START OVERTHINKING <ArrowRight size={19} />
          </ActionButton>
          <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">CTRL / ⌘ + ENTER TO INITIATE</p>
        </div>

        <div className="mx-auto mt-8 w-full max-w-3xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {EXAMPLES.map((example) => (
              <button type="button" key={example} onClick={() => setQuestion(example)} className="prompt-chip">{example}</button>
            ))}
          </div>
          <button type="button" onClick={randomize} className="random-link"><Dices size={16} /> Give me a random dilemma</button>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Powered by imaginary intelligence and unnecessary thinking.
        </p>
      </section>
    </Shell>
  );
}

function Analysis({ question, level, progress, messageIndex }: { question: string; level: Level; progress: number; messageIndex: number }) {
  return (
    <Shell compact>
      <section className="mx-auto flex min-h-[calc(100vh-170px)] max-w-3xl items-center justify-center py-12">
        <div className="analysis-panel w-full animate-scale-in">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
            <div className="panel-label mb-0"><span>SYS</span> OVERTHINK ENGINE</div>
            <div className="font-mono text-[10px] text-primary">PROCESS ACTIVE</div>
          </div>
          <div className="px-5 py-10 text-center sm:px-12 sm:py-14">
            <div className="loader-orbit mx-auto">
              <BrainCircuit size={38} />
              <i /><i /><i />
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase text-muted-foreground">Target dilemma</p>
            <h1 className="mx-auto mt-2 max-w-2xl break-words font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">“{question}”</h1>
            <div className="mt-9 min-h-14">
              <p className="font-mono text-sm text-primary sm:text-base">{ANALYSIS_MESSAGES[messageIndex] ?? ANALYSIS_MESSAGES[0]}</p>
              <p className="mt-2 text-xs text-muted-foreground">Mode: {LEVELS[level]?.title ?? "Slightly Confused"}</p>
            </div>
            <div className="mx-auto mt-6 max-w-xl">
              <div className="mb-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>UNNECESSARY COMPUTATION</span><span>{progress}%</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ "--progress": `${progress}%` } as CSSProperties} /></div>
              <div className="mt-3 grid grid-cols-12 gap-1" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, index) => <span key={index} className={index < Math.ceil(progress / 8.34) ? "active" : ""} />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Panel({ label, number, children, className = "" }: { label: string; number: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`dashboard-panel ${className}`}>
      <div className="panel-heading"><span>{number}</span><h2>{label}</h2></div>
      {children}
    </section>
  );
}

function ResultDashboard({
  question,
  level,
  result,
  again,
  reset,
  stop,
  share,
  emergency,
  randomize,
}: {
  question: string;
  level: Level;
  result: Result;
  again: () => void;
  reset: () => void;
  stop: () => void;
  share: () => void;
  emergency: () => void;
  randomize: () => void;
}) {
  return (
    <Shell>
      <div className="result-header animate-fade-in">
        <div>
          <div className="eyebrow"><Sparkles size={14} /> ANALYSIS COMPLETE</div>
          <h1 className="mt-4 font-display text-3xl font-black tracking-normal sm:text-5xl">Your decision has been<br /><span className="title-accent">properly overthought.</span></h1>
        </div>
        <div className="status-cluster">
          <span>OVERTHINKING STATUS</span>
          <strong><span className="status-dot" /> {result.status}</strong>
        </div>
      </div>

      <section className="question-banner animate-fade-in">
        <span>ORIGINAL QUESTION</span>
        <p>“{question}”</p>
        <em>{LEVELS[level]?.title ?? "Slightly Confused"}</em>
      </section>

      <div className="dashboard-grid">
        <Panel number="01" label="Fictional risk analysis" className="lg:col-span-7">
          <div className="space-y-5">
            {result.risks.map((risk, index) => (
              <div key={risk.label} className="risk-row" style={{ animationDelay: `${index * 80}ms` }}>
                <div><span>{risk.label}</span><strong>{risk.value}%</strong></div>
                <div className="risk-track"><span style={{ "--progress": `${risk.value}%` } as CSSProperties} /></div>
              </div>
            ))}
          </div>
          <p className="fiction-note"><ShieldAlert size={13} /> 100% fabricated entertainment statistics</p>
        </Panel>

        <Panel number="02" label="System confidence" className="lg:col-span-5 confidence-panel">
          <div className="confidence-ring" style={{ "--score": `${result.confidence * 3.6}deg` } as CSSProperties}>
            <div><strong>{result.confidence}%</strong><span>CONFIDENT</span></div>
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">Even the software is unsure.</p>
          <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">FICTIONAL — NOT AN AI PREDICTION</p>
        </Panel>

        <Panel number="03" label="Ridiculous consequence tree" className="lg:col-span-12 overflow-hidden">
          <div className="decision-tree">
            <div className="tree-root">{question}</div>
            <div className="tree-split"><span /><span /></div>
            <div className="grid grid-cols-2 gap-4 sm:gap-10">
              {result.branches.map((branch) => (
                <div key={branch.title} className="tree-branch">
                  <strong>{branch.title}</strong>
                  {branch.steps.map((step, index) => (
                    <div key={step}><i /><span>{step}</span>{index < branch.steps.length - 1 && <b>↓</b>}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel number="04" label="Imaginary expert opinions" className="lg:col-span-8">
          <div className="grid gap-3 sm:grid-cols-3">
            {EXPERTS.map((expert, index) => (
              <article className="expert-card" key={expert[0]}>
                <div className="expert-avatar">{expert[1]}</div>
                <h3>{expert[0]}</h3>
                <p>“{result.opinions[index]}”</p>
                <span>NOT A REAL PERSON</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel number="05" label="Overthinking score" className="lg:col-span-4 score-panel">
          <div className="score-value"><strong>{result.score}</strong><span>/100</span></div>
          <div className="score-ticks">{Array.from({ length: 10 }).map((_, index) => <span key={index} className={index < Math.ceil(result.score / 10) ? "active" : ""} />)}</div>
          <p>Professional-level unnecessary thinking.</p>
        </Panel>

        <section className="recommendation-panel lg:col-span-12">
          <div className="recommendation-icon"><Lightbulb size={27} /></div>
          <div>
            <span>FINAL RECOMMENDATION</span>
            <h2>{result.recommendation}</h2>
          </div>
          <Sparkles className="recommendation-spark" />
        </section>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <ActionButton variant="primary" onClick={again}><RefreshCw size={17} /> OVERTHINK AGAIN</ActionButton>
        <ActionButton onClick={stop}><Square size={16} /> STOP THINKING</ActionButton>
        <ActionButton onClick={share}><Share2 size={17} /> SHARE RESULT</ActionButton>
        <ActionButton onClick={randomize}><Dices size={17} /> RANDOM QUESTION</ActionButton>
        <ActionButton onClick={reset}><Home size={17} /> NEW QUESTION</ActionButton>
      </div>

      <button type="button" onClick={emergency} className="emergency-button">
        <span><Zap size={18} /> DECISION EMERGENCY</span>
        <small>Only press if the dilemma is critically unnecessary</small>
        <ArrowRight size={18} />
      </button>
    </Shell>
  );
}

function EmergencyModal({ result, close }: { result: Result; close: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) close(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="emergency-title" className="emergency-modal animate-scale-in">
        <button type="button" onClick={close} className="modal-close" aria-label="Close emergency report"><X size={19} /></button>
        <div className="emergency-icon"><AlertTriangle size={34} /></div>
        <p className="font-mono text-[10px] font-bold text-signal-red">CRITICAL DECISION EVENT</p>
        <h2 id="emergency-title">Your decision has become too complicated.</h2>
        <div className="emergency-stats">
          <div><span>Emergency level</span><strong>CATASTROPHICALLY MINOR</strong></div>
          <div><span>Imaginary experts consulted</span><strong>{result.experts}</strong></div>
          <div><span>Possible futures detected</span><strong>{result.futures}</strong></div>
        </div>
        <div className="emergency-action"><span>RECOMMENDED ACTION</span><strong>Do absolutely nothing for 5 minutes.</strong></div>
        <ActionButton onClick={close} variant="danger" className="mt-5 w-full">UNDERSTOOD, PROBABLY</ActionButton>
      </section>
    </div>
  );
}

function OverthinkOS() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState<Level>(1);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [result, setResult] = useState<Result>(() => makeResult("A very important decision", 1));
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [showEmergency, setShowEmergency] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  const startAnalysis = () => {
    const cleaned = question.trim();
    if (!cleaned) {
      setError("You cannot overthink nothing. Please enter a question.");
      return;
    }
    setQuestion(cleaned);
    setError("");
    setProgress(0);
    setMessageIndex(0);
    setStage("analysis");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (stage !== "analysis") return;
    let value = 0;
    timerRef.current = window.setInterval(() => {
      value += randomBetween(4, 10);
      const next = Math.min(100, value);
      setProgress(next);
      setMessageIndex(Math.min(ANALYSIS_MESSAGES.length - 1, Math.floor((next / 100) * ANALYSIS_MESSAGES.length)));
      if (next >= 100) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        window.setTimeout(() => {
          setResult(makeResult(question, level));
          setStage("result");
          window.scrollTo({ top: 0 });
        }, 450);
      }
    }, 230);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [stage, question, level]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const summary = useMemo(() => `OverthinkOS analysed: “${question}”\nResult: ${result.recommendation}\nConfidence: ${result.confidence}% (fictional)\nOverthinking score: ${result.score}/100`, [question, result]);

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "My OverthinkOS Result", text: summary });
        setToast("Your uncertainty has been shared.");
      } else {
        await navigator.clipboard.writeText(summary);
        setToast("Ridiculous result copied to clipboard.");
      }
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(summary);
        setToast("Ridiculous result copied to clipboard.");
      } catch {
        setToast("Sharing failed. Perhaps the universe is undecided.");
      }
    }
  };

  const randomize = () => {
    const randomQuestion = randomFrom(RANDOM_QUESTIONS as [string, ...string[]]);
    setQuestion(randomQuestion);
    setError("");
    if (stage === "result") {
      setResult(makeResult(randomQuestion, level));
      setStage("analysis");
    }
  };

  return (
    <>
      {stage === "welcome" && <Welcome question={question} setQuestion={setQuestion} level={level} setLevel={setLevel} start={startAnalysis} error={error} randomize={randomize} />}
      {stage === "analysis" && <Analysis question={question} level={level} progress={progress} messageIndex={messageIndex} />}
      {stage === "result" && (
        <ResultDashboard
          question={question}
          level={level}
          result={result}
          again={startAnalysis}
          reset={() => { setQuestion(""); setStage("welcome"); window.scrollTo({ top: 0 }); }}
          stop={() => setToast("You cannot stop thinking. The thinking has already started.")}
          share={share}
          emergency={() => setShowEmergency(true)}
          randomize={randomize}
        />
      )}
      {showEmergency && <EmergencyModal result={result} close={() => setShowEmergency(false)} />}
      {toast && <div className="toast-message" role="status"><Clipboard size={17} /> {toast}</div>}
    </>
  );
}