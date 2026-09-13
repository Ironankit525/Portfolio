import { useState } from 'react';
import { ArrowUpRight, Check, Github, Linkedin, LoaderCircle } from 'lucide-react';
import Reveal from './Reveal';

export default function ContactSection({ contactEmail = 'ankitkumar17541@gmail.com' }) {
    const [status, setStatus] = useState('idle');
    async function handleSubmit(event) {
        event.preventDefault();
        if (status === 'submitting') return;
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        setStatus('submitting');
        try {
            const response = await fetch('https://formspree.io/f/mdalqlkj', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(15000),
            });
            if (!response.ok) throw new Error('Message submission failed');
            setStatus('success');
            form.reset();
        } catch {
            setStatus('error');
        }
    }
    return (
        <section id="contact" className="studio-section contact-section" aria-labelledby="contact-title">
            <Reveal>
                <p className="section-kicker"><span>04</span> / GET IN TOUCH</p>
                <div className="studio-panel contact-panel">
                    <div className="contact-copy">
                        <h2 id="contact-title">Have an idea?<br />Let’s <em>build it.</em></h2>
                        <p>I’m always open to interesting projects, open-source collaborations, or a good conversation about technology.</p>
                        <a className="contact-email text-link" href={`mailto:${contactEmail}`}>{contactEmail} <ArrowUpRight size={16} /></a>
                        <div className="social-links">
                            <a href="https://github.com/Ironankit525" target="_blank" rel="noreferrer"><Github size={18} /> GitHub <ArrowUpRight size={14} /></a>
                            <a href="https://www.linkedin.com/in/ankit-kumar525/" target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn <ArrowUpRight size={14} /></a>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="contact-form" aria-label="Send Ankit a message" aria-busy={status === 'submitting'}>
                        <fieldset disabled={status === 'submitting'}>
                            <legend className="sr-only">Your message</legend>
                            <div className="form-row">
                                <label>Your name<input name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={120} /></label>
                                <label>Email<input name="email" type="email" autoComplete="email" placeholder="alex@example.com" required maxLength={254} /></label>
                            </div>
                            <label>Your message<textarea name="message" placeholder="Tell me what you have in mind…" required rows={4} maxLength={5000} /></label>
                            <div className="form-bottom"><span>Good things start with a hello.</span><button className="lime-button" type="submit">{status === 'submitting' ? <><LoaderCircle size={17} className="button-spinner" /> Sending…</> : status === 'success' ? <>Message sent <Check size={18} /></> : <>Send message <ArrowUpRight size={18} /></>}</button></div>
                        </fieldset>
                        <p className={`form-status${status === 'error' ? ' form-error' : ''}`} role="status" aria-live="polite">{status === 'success' ? 'Thanks for reaching out. Your message has been sent.' : status === 'error' ? 'Your message couldn’t be sent. Please try again, or email me directly.' : ''}</p>
                    </form>
                </div>
            </Reveal>
        </section>
    );
}
