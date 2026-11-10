import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, FileText, LoaderCircle } from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { profile } from '../data/profile';
import { useCopy } from '../hooks/useCopy';
import Reveal from './Reveal';

// Messages go to Formspree, which forwards them to my inbox. Test sends are real email.
const FORM_ENDPOINT = 'https://formspree.io/f/mdalqlkj';

export default function ContactSection() {
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [copied, copy] = useCopy();

    async function handleSubmit(event) {
        event.preventDefault();
        if (status === 'submitting') return;
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        setStatus('submitting');
        try {
            const response = await fetch(FORM_ENDPOINT, {
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
        <section id="contact" className="section" aria-labelledby="contact-title">
            <div className="container">
                <Reveal>
                    <p className="kicker"><span>05</span> / Get in touch</p>
                </Reveal>

                <Reveal className="panel contact-panel">
                    <div className="contact-copy">
                        <h2 id="contact-title">Have an idea?<br />Let’s <em>build it.</em></h2>
                        <p className="lede">
                            I’m looking for internships, and I’m always open to open-source collaborations or a good conversation about technology.
                        </p>

                        <div className="contact-email">
                            <a href={`mailto:${profile.email}`}>{profile.email}</a>
                            <button type="button" className="icon-button" onClick={() => copy(profile.email)} aria-label="Copy email address">
                                {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                            </button>
                            <span className="contact-copied" role="status">{copied ? 'Copied' : ''}</span>
                        </div>

                        <ul className="contact-links">
                            <li><a href={profile.links.github} target="_blank" rel="noreferrer"><FaGithub size={17} aria-hidden="true" /> GitHub <ArrowUpRight size={14} aria-hidden="true" /></a></li>
                            <li><a href={profile.links.linkedin} target="_blank" rel="noreferrer"><FaLinkedinIn size={17} aria-hidden="true" /> LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a></li>
                            <li><a href={profile.resumeUrl} target="_blank" rel="noreferrer"><FileText size={16} aria-hidden="true" /> View résumé <ArrowUpRight size={14} aria-hidden="true" /></a></li>
                            <li><a href={profile.resumeUrl} download><Download size={16} aria-hidden="true" /> Download</a></li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="contact-form" aria-label={`Send ${profile.firstName} a message`} aria-busy={status === 'submitting'}>
                        <fieldset disabled={status === 'submitting'}>
                            <legend className="sr-only">Your message</legend>
                            <div className="form-row">
                                <label>Your name<input name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={120} /></label>
                                <label>Email<input name="email" type="email" autoComplete="email" placeholder="alex@example.com" required maxLength={254} /></label>
                            </div>
                            <label>Your message<textarea name="message" placeholder="Tell me what you have in mind…" required rows={5} maxLength={5000} /></label>
                            <div className="form-bottom">
                                <p className={`form-status${status === 'error' ? ' is-error' : ''}`} role="status" aria-live="polite">
                                    {status === 'success' && 'Thanks for reaching out. Your message has been sent.'}
                                    {status === 'error' && 'Your message couldn’t be sent. Please try again, or email me directly.'}
                                </p>
                                <button className="button button-primary button-lg" type="submit">
                                    {status === 'submitting' && <><LoaderCircle size={17} className="button-spinner" aria-hidden="true" /> Sending…</>}
                                    {status === 'success' && <>Message sent <Check size={18} aria-hidden="true" /></>}
                                    {(status === 'idle' || status === 'error') && <>Send message <ArrowUpRight size={18} aria-hidden="true" /></>}
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </Reveal>
            </div>
        </section>
    );
}
