import React, { useState } from 'react';
import { Linkedin, Calendar, ArrowRight, Mail, Copy, Check, Send, Loader, AlertCircle, Clock, ChevronDown, Globe } from 'lucide-react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { supabase } from '../lib/supabaseClient';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-muted/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-dark group-hover:text-primary'}`}>
                    {question}
                </span>
                <span className={`ml-6 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${isOpen ? 'bg-primary border-primary text-light rotate-180' : 'bg-white border-muted/20 text-muted group-hover:border-primary group-hover:text-primary'}`}>
                    <ChevronDown className="h-4 w-4" />
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-dark/70 leading-relaxed pr-8">{answer}</p>
            </div>
        </div>
    )
}

const ContactPage: React.FC = () => {
    const [formRef, isFormVisible] = useIntersectionObserver({ threshold: 0.1 });
    const [contentRef, isContentVisible] = useIntersectionObserver({ threshold: 0.1 });

    const [copied, setCopied] = useState(false);
    const emailAddress = 'hello@alexdoe.com';

    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [activeSubject, setActiveSubject] = useState('SEO Audit');

    const subjects = ['SEO Audit', 'Content Strategy', 'Full Partnership', 'Speaking/Podcast', 'Other'];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus('idle');

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;
        const fullMessage = `[Subject: ${activeSubject}]\n\n${message}`;

        const { error } = await supabase
            .from('contact_messages')
            .insert([{ name, email, message: fullMessage, is_read: false }]);

        setSubmitting(false);

        if (error) {
            console.error('Error submitting contact form:', error);
            setSubmitStatus('error');
        } else {
            setSubmitStatus('success');
            form.reset();
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(emailAddress).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <div className="bg-light min-h-screen fade-in">
            {/* Elegant Header Section */}
            <div className="bg-white relative overflow-hidden border-b border-muted/10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-muted/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-light border border-muted/20 text-primary text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                            Contact
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-dark mb-6 leading-tight">
                            Let&apos;s Start a <br className="hidden md:block" /> Conversation.
                        </h1>
                        <p className="text-xl text-dark/70 max-w-xl leading-relaxed">
                            Whether you have a specific goal in mind or just want to explore what&apos;s possible, I&apos;m ready to listen.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Sidebar: Contact Info */}
                    <div className="lg:col-span-4 space-y-6" ref={contentRef}>
                        <div className={`space-y-6 animate-on-scroll ${isContentVisible ? 'is-visible' : ''}`}>
                            {/* Primary Contact Card - Black Forest (dark) */}
                            <div className="bg-dark text-light rounded-3xl p-8 shadow-2xl shadow-dark/20 relative overflow-hidden group">
                                {/* Animated Background Icon */}
                                <div className="absolute -bottom-6 -right-6 p-4 text-light opacity-[0.03] transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ease-out">
                                    <Mail className="w-48 h-48" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold">Contact Info</h2>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-light/10 border border-light/5 backdrop-blur-sm">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                            </span>
                                            <span className="text-xs font-medium text-light/90">Online</span>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="group/item">
                                            <p className="text-sm text-muted mb-1 flex items-center gap-2">
                                                <Mail className="h-4 w-4" /> Email Me
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <a href={`mailto:${emailAddress}`} className="text-lg font-bold hover:text-light/80 transition-colors border-b border-transparent hover:border-light/50 pb-0.5">{emailAddress}</a>
                                                <button onClick={handleCopy} className="p-2 hover:bg-light/10 rounded-lg transition-colors group-hover/item:bg-light/5" title="Copy Email">
                                                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-muted mb-1 flex items-center gap-2">
                                                <Globe className="h-4 w-4" /> Based In
                                            </p>
                                            <p className="text-lg font-bold">Chennai, India</p>
                                            <p className="text-sm text-muted/60 mt-1">Available for global remote work</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-muted mb-1 flex items-center gap-2">
                                                <Clock className="h-4 w-4" /> Response Time
                                            </p>
                                            <p className="text-lg font-bold">Usually within 24 hours</p>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-light/10 flex gap-4">
                                        <a href="#" className="bg-light/5 hover:bg-light/20 p-3 rounded-xl transition-all duration-300 text-light/70 hover:text-light">
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                        <a href="#" className="bg-light/5 hover:bg-light/20 p-3 rounded-xl transition-all duration-300 text-light/70 hover:text-light">
                                            <XIcon className="h-5 w-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Card: Book a Call */}
                            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-muted/5 border border-muted/10 hover:border-primary/20 transition-colors duration-300">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="bg-primary/5 p-3 rounded-xl">
                                        <Calendar className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-dark">Skip the inbox?</h3>
                                        <p className="text-muted text-sm mt-1">Book a 15-min discovery call directly.</p>
                                    </div>
                                </div>
                                <a href="#" className="mt-4 w-full flex items-center justify-center gap-2 bg-white border-2 border-light text-dark font-bold py-3 px-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-300">
                                    Book Discovery Call <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: The Form */}
                    <div className="lg:col-span-8">
                        <div ref={formRef} className={`bg-white rounded-3xl shadow-xl shadow-muted/5 border border-muted/10 p-8 md:p-12 h-full animate-on-scroll ${isFormVisible ? 'is-visible' : ''}`}>
                            {submitStatus === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12 fade-in">
                                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                                        <Check className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-dark mb-4">Message Sent!</h3>
                                    <p className="text-dark/70 max-w-md mx-auto mb-8 text-lg">
                                        Thanks for reaching out. I&apos;ve received your message and will get back to you shortly.
                                    </p>
                                    <button onClick={() => setSubmitStatus('idle')} className="text-primary font-bold hover:underline underline-offset-4">
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-dark mb-2">Send a Message</h2>
                                        <p className="text-muted">Tell me a bit about your goals, and I&apos;ll get back to you with some initial thoughts.</p>
                                    </div>

                                    {/* Subject Tags */}
                                    <div>
                                        <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-4">I&apos;m interested in...</label>
                                        <div className="flex flex-wrap gap-3">
                                            {subjects.map(subject => (
                                                <button
                                                    key={subject}
                                                    type="button"
                                                    onClick={() => setActiveSubject(subject)}
                                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${activeSubject === subject
                                                        ? 'bg-dark text-light border-dark shadow-lg shadow-dark/10 transform scale-105'
                                                        : 'bg-white text-dark/70 border-muted/20 hover:border-primary hover:text-primary'
                                                        }`}
                                                >
                                                    {subject}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="block text-sm font-semibold text-dark">Your Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                disabled={submitting}
                                                className="w-full px-4 py-3.5 rounded-xl bg-light/30 border border-muted/20 text-dark placeholder-muted focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-semibold text-dark">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                disabled={submitting}
                                                className="w-full px-4 py-3.5 rounded-xl bg-light/30 border border-muted/20 text-dark placeholder-muted focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="block text-sm font-semibold text-dark">Your Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            required
                                            disabled={submitting}
                                            className="w-full px-4 py-3.5 rounded-xl bg-light/30 border border-muted/20 text-dark placeholder-muted focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
                                            placeholder="Tell me a bit about your project, timeline, and goals..."
                                        ></textarea>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        {submitStatus === 'error' && (
                                            <span className="text-red-600 text-sm font-semibold flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                                                <AlertCircle className="h-4 w-4" /> Failed to send. Please try again.
                                            </span>
                                        )}
                                        {!submitStatus && <span></span>}

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="inline-flex items-center justify-center gap-2 bg-primary text-light font-bold py-4 px-10 rounded-xl text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {submitting ? <Loader className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                                            {submitting ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-dark">Common Questions</h2>
                        <div className="h-1 w-20 bg-primary/20 mx-auto mt-4 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        <FAQItem
                            question="Are you accepting new clients right now?"
                            answer="Yes, I have limited capacity for 1-2 new retainer clients this month. For one-off audits or consultations, I can usually schedule within a week."
                        />
                        <FAQItem
                            question="Do you offer white-label services for agencies?"
                            answer="Absolutely. I partner with select design and development agencies to handle their client's technical SEO and content strategy needs under their brand."
                        />
                        <FAQItem
                            question="What is your typical pricing structure?"
                            answer="I work on both a project basis (e.g., Audit, Setup) and monthly retainers for ongoing growth. Retainers typically start at $1,500/mo, while audits start at $800 depending on site size."
                        />
                        <FAQItem
                            question="Do you guarantee #1 rankings?"
                            answer="No ethical SEO professional can guarantee a specific ranking, as algorithms are outside our control. I guarantee best-practice execution, transparent data, and a strategy aimed at maximizing organic growth."
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;