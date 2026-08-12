'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TerminalSquare } from 'lucide-react';
import { useKonami } from '@/hooks/useKonami';

interface CommandContext {
  close: () => void;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

interface CommandDef {
  name: string;
  run: (ctx: CommandContext) => string;
}

const COMMANDS: CommandDef[] = [
  { name: 'help', run: () => 'Try: about, projects, journey, skills, music, contact, hire, clear' },
  {
    name: 'about',
    run: ({ close }) => {
      scrollToSection('about');
      close();
      return 'Scrolling to About Me…';
    },
  },
  {
    name: 'journey',
    run: ({ close }) => {
      scrollToSection('about');
      close();
      return 'Scrolling to the journey…';
    },
  },
  {
    name: 'skills',
    run: ({ close }) => {
      scrollToSection('about');
      close();
      return 'Loading the technical universe…';
    },
  },
  {
    name: 'projects',
    run: ({ close }) => {
      scrollToSection('projects');
      close();
      return 'Scrolling to Projects…';
    },
  },
  {
    name: 'music',
    run: ({ close }) => {
      close();
      return 'The soundtrack lives bottom-center. \u{1F3A7}';
    },
  },
  {
    name: 'contact',
    run: ({ close }) => {
      scrollToSection('hire');
      close();
      return 'Scrolling to Hire Me…';
    },
  },
  {
    name: 'hire',
    run: ({ close }) => {
      scrollToSection('hire');
      close();
      return 'Scrolling to Hire Me…';
    },
  },
];

export default function CommandTerminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [log, setLog] = useState<string[]>(['Type "help" to see available commands.']);
  const [easterEgg, setEasterEgg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useKonami(
    useCallback(() => {
      setEasterEgg(true);
      setTimeout(() => setEasterEgg(false), 4000);
    }, [])
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const runCommand = (raw: string) => {
    const name = raw.trim().toLowerCase();
    if (!name) return;

    if (name === 'clear') {
      setLog([]);
      setInput('');
      return;
    }

    const command = COMMANDS.find((c) => c.name === name);
    const result = command ? command.run({ close }) : `command not found: ${name}`;
    setLog((prev) => [...prev, `$ ${name}`, result]);
    setInput('');
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-24 sm:pt-32"
            role="dialog"
            aria-modal="true"
            aria-label="Command terminal"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f]/95 shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs text-gray-500">
                <TerminalSquare size={14} />
                <span>softwareguru — ⌘K</span>
              </div>

              <div className="max-h-64 space-y-1 overflow-y-auto px-4 py-3 font-mono text-sm text-gray-400">
                {log.map((line, i) => (
                  <p key={i} className={line.startsWith('$') ? 'text-white' : 'text-gray-500'}>
                    {line}
                  </p>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runCommand(input);
                }}
                className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
              >
                <span className="font-mono text-sm text-indigo-400">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-label="Terminal command input"
                  placeholder="type a command… (help)"
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-gray-600"
                />
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="fixed bottom-6 right-6 z-[150] rounded-xl border border-indigo-400/30 bg-black/80 px-4 py-3 font-mono text-xs text-indigo-300 backdrop-blur-xl"
          >
            👀 You found it. Kiran approves — try ⌘K next.
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(true)}
        data-cursor="hover"
        aria-label="Open command terminal"
        className="fixed bottom-24 right-6 z-40 hidden items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-mono text-gray-400 backdrop-blur-xl transition hover:border-white/30 hover:text-white sm:flex"
      >
        <TerminalSquare size={14} />
        <span>⌘K</span>
      </button>
    </>
  );
}
