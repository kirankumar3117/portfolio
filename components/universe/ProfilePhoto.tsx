'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function ProfilePhoto() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        data-cursor="explore"
        aria-label="Zoom profile photo"
        className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/10 transition hover:border-white/30 sm:h-40 sm:w-40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/kiran.webp" alt="Kiran Kumar" className="h-full w-full object-cover [object-position:50%_20%]" />
      </button>

      <AnimatePresence>
        {zoomed && (
          <div className="fixed inset-0 z-[2500] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomed(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 max-h-[85vh] max-w-sm overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setZoomed(false)}
                aria-label="Close"
                className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-gray-300 backdrop-blur-md transition hover:text-white"
              >
                <X size={18} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/kiran.webp" alt="Kiran Kumar" className="max-h-[85vh] w-full object-contain" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
