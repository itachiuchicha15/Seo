import React, { useState } from 'react';
import { Linkedin, Twitter, PenSquare, Calendar, ArrowRight, MessageSquare, ClipboardList, Copy, Check } from 'lucide-react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const ContactPage: React.FC = () => {
  const [headerRef, isHeaderVisible] = useIntersectionObserver({ threshold: 0.3 });
  const [primaryCtaRef, isPrimaryCtaVisible] = useIntersectionObserver({ threshold: 0.3 });
  const [contactHubRef, isContactHubVisible] = useIntersectionObserver({ threshold: 0.1 });

  const [copied, setCopied] = useState(false);
  const emailAddress = 'hello@alexdoe.com';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you shortly.');
    const form = e.target as HTMLFormElement;
    form.reset();
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Medium', icon: PenSquare, href: '#' },
  ];

  return (
    <div className="bg-light py-24 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`text-center mb-20 animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
          <h1 className="text-4xl font-extrabold text-dark sm:text-5xl">Let's Connect</h1>
          <p className="mt-4 text-xl text-muted max-w-2xl mx-auto">
            Ready to start a project or just want to talk about SEO? Here's how to reach me.
          </p>
        </div>

        {/* Primary CTA: Discovery Call */}
        <div ref={primaryCtaRef} className={`mb-24 animate-on-scroll ${isPrimaryCtaVisible ? 'is-visible' : ''}`}>
          <div className="bg-gradient-to-br from-white to-light p-8 sm:p-12 rounded-3xl shadow-2xl shadow-primary/10 border-2 border-primary transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-2">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 bg-primary/10 p-5 rounded-full border-4 border-white">
                <Calendar className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-3xl font-bold text-dark">The Best Way to Start?</h2>
                <p className="mt-2 text-muted max-w-2xl">
                    A free 15-minute discovery call is the fastest way to see if we're a good fit for your project goals.
                </p>
              </div>
              <div className="flex-shrink-0">
                  <a href="#" className="group inline-flex items-center justify-center bg-primary text-dark font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:brightness-95 transform hover:scale-105">
                    Schedule a Call
                    <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Hub */}
        <div ref={contactHubRef} className={`grid grid-cols-1 lg:grid-cols-3 gap-8 animate-on-scroll ${isContactHubVisible ? 'is-visible' : ''}`}>
            
            {/* Left Side: Inquiry Form */}
            <div className={`lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-on-scroll flex flex-col h-full ${isContactHubVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
                <div className="flex items-start gap-4 mb-8">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-dark">Send a Detailed Inquiry</h3>
                        <p className="text-sm text-muted mt-1">Best for project proposals or in-depth questions. Expect a reply within one business day.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                    <div className="flex-grow space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="sr-only">Full Name</label>
                                <input type="text" name="name" id="name" required className="block w-full rounded-lg border-2 border-transparent bg-light px-4 py-3 text-secondary placeholder-muted transition-colors duration-300 focus:border-primary focus:bg-white focus:outline-none" placeholder="Full Name" />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email Address</label>
                                <input type="email" name="email" id="email" required className="block w-full rounded-lg border-2 border-transparent bg-light px-4 py-3 text-secondary placeholder-muted transition-colors duration-300 focus:border-primary focus:bg-white focus:outline-none" placeholder="Email Address" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="message" className="sr-only">Your Message</label>
                            <textarea id="message" name="message" rows={5} required className="block w-full rounded-lg border-2 border-transparent bg-light px-4 py-3 text-secondary placeholder-muted transition-colors duration-300 focus:border-primary focus:bg-white focus:outline-none" placeholder="Tell me about your project..."></textarea>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-secondary hover:bg-dark transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Send Project Inquiry
                        </button>
                    </div>
                </form>
            </div>

             {/* Right Side: Quick Connect */}
             <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-10 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-on-scroll ${isContactHubVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
                <div> {/* Top content wrapper */}
                    <div className="flex items-start gap-4 mb-8">
                        <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                            <ClipboardList className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-dark">Other Ways to Connect</h3>
                            <p className="text-sm text-muted mt-1">For quick questions or to follow my work.</p>
                        </div>
                    </div>
                    
                    {/* Direct Email */}
                    <div>
                        <h4 className="font-semibold text-dark mb-3">Direct Email</h4>
                        <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-light border border-gray-200">
                            <a href={`mailto:${emailAddress}`} className="text-sm text-primary font-medium truncate hover:underline">{emailAddress}</a>
                            <button onClick={handleCopy} className={`flex-shrink-0 p-2 rounded-md transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-200 hover:bg-gray-300 text-muted'}`}>
                                <span className="sr-only">Copy email</span>
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="mt-auto pt-8">
                     <h4 className="font-semibold text-dark mb-3 text-center">Follow the journey</h4>
                     <div className="flex items-center justify-center gap-6">
                        {socialLinks.map(social => (
                            <a key={social.name} href={social.href} title={social.name} className="text-muted hover:text-primary transition-colors">
                                <span className="sr-only">{social.name}</span>
                                <social.icon className="h-7 w-7" />
                            </a>
                        ))}
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;