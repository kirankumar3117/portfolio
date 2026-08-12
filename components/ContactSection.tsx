'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github, ExternalLink, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- SUCCESS POPUP COMPONENT ---
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative bg-gray-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-gray-400 mb-6">
            Thanks for reaching out. I&apos;ve received your details and will get back to you shortly.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition"
          >
            Close
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        'service_8oxkfmd',     // Service ID
        'template_0zodhlj',    // Template ID
        {
          // These keys MUST match the variables in your EmailJS Template {{...}}
          from_name: formState.name,
          email: formState.email,       // Changed from 'from_email' to 'email' to match template
          from_mobile: formState.mobile,
          subject: "New Inquiry from Portfolio", // Hardcoded subject since we removed the input
          message: formState.message,
        },
        'eD-lWat6MIfuL_6B9'      // Public Key
      );

      // Success!
      setShowSuccess(true);
      setFormState({ name: '', email: '', mobile: '', message: '' });
    } catch (error) {
      console.error('Email failed:', error);
      alert("Something went wrong. Please email me directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 relative overflow-hidden" id="contact">
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">Let&apos;s create something <br /> <span className="text-purple-500">extraordinary.</span></h2>
          <p className="text-gray-400 text-lg mb-8">
            Whether you have a project in mind or just want to say hi, I&apos;m always open to discussing new ideas.
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {[
              'Full-Stack Engineering',
              'Frontend Architecture',
              'Product Development',
              'Technical Consulting',
              'Interesting Engineering Projects',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="space-y-6">
            <a href="mailto:Kirankumar.challagiri@gmail.com" className="flex items-center gap-4 text-gray-300 hover:text-white transition group">
              <div className="p-3 bg-white/5 rounded-full text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition">
                <Mail />
              </div>
              <span className="group-hover:underline">Kirankumar.challagiri@gmail.com</span>
            </a>

            <div className="flex items-center gap-4 text-gray-300">
              <div className="p-3 bg-white/5 rounded-full text-purple-400">
                <MapPin />
              </div>
              <span>Vijayawada, India (Remote)</span>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <a href="https://linkedin.com/in/kirankumar3117" target="_blank" className="p-4 border border-white/10 rounded-full hover:bg-blue-600 hover:border-blue-600 hover:text-white transition duration-300 text-gray-400">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com/kirankumar3117" target="_blank" className="p-4 border border-white/10 rounded-full hover:bg-white hover:text-black transition duration-300 text-gray-400">
              <Github size={20} />
            </a>
            {process.env.NEXT_PUBLIC_RESUME_URL && (
              <a
                href={process.env.NEXT_PUBLIC_RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="flex items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-semibold text-gray-400 transition duration-300 hover:bg-purple-500 hover:border-purple-500 hover:text-white"
              >
                Resume
              </a>
            )}
          </div>
        </motion.div>

        {/* Right: Functional Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl"
        >
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              type="text"
              placeholder="Name"
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Email */}
              <input
                name="email"
                value={formState.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition"
                required
              />
              {/* Mobile Number */}
              <input
                name="mobile"
                value={formState.mobile}
                onChange={handleChange}
                type="tel"
                placeholder="Mobile No."
                className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition"
                required
              />
            </div>

            {/* Message */}
            <textarea
              name="message"
              value={formState.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell me about your project..."
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition resize-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-purple-500 hover:text-white transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
              {!loading && <ExternalLink size={16} />}
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}