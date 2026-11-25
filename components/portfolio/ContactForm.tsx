'use client';

import { useRef, useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import styles from './ContactForm.module.css';

type Submission = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [submission, setSubmission] = useState<Submission>('idle');
  const sending = useRef(false);
  const isSending = submission === 'sending';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    sending.current = true;
    setSubmission('sending');

    try {
      await emailjs.send(
        'service_8oxkfmd',
        'template_0zodhlj',
        {
          from_name: values.get('name'),
          email: values.get('email'),
          from_mobile: values.get('mobile'),
          subject: 'New Inquiry from Portfolio',
          message: values.get('message'),
        },
        'eD-lWat6MIfuL_6B9',
      );
      form.reset();
      setSubmission('sent');
    } catch {
      setSubmission('error');
    } finally {
      sending.current = false;
    }
  }

  return (
    <form className={styles.form} aria-label="Contact form" method="post" onSubmit={handleSubmit}>
      <fieldset className={styles.fields} disabled={isSending} aria-busy={isSending}>
        <label className={styles.field}>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label className={styles.field}>
            <span>Mobile number</span>
            <input name="mobile" type="tel" autoComplete="tel" required />
          </label>
        </div>
        <label className={styles.field}>
          <span>Message</span>
          <textarea name="message" rows={4} required />
        </label>
        <button className={styles.submit} type="submit">
          {isSending ? 'Sending…' : 'Send message'}
        </button>
      </fieldset>
      <div className={styles.feedback}>
        <p role="status">
          {isSending && 'Sending your message…'}
          {submission === 'sent' && 'Message sent. Thanks for reaching out.'}
        </p>
        <p className={styles.error} role="alert">
          {submission === 'error' && 'Your message couldn’t be sent. Try again or email me directly.'}
        </p>
      </div>
    </form>
  );
}
