/**
 * AboutPage
 * L7 Refactored - Uses centralized constants
 */
import React from 'react';
import { Database, Users, ClipboardCheck, GraduationCap, Globe, Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { ROUTES, ABOUT_STRINGS, ABOUT_PRINCIPLES } from '../constants';

// Icon mapping
const ICON_MAP = {
    Database,
    Users,
    ClipboardCheck,
};

const AboutPage: React.FC = () => {
    const [heroRef, isHeroVisible] = useIntersectionObserver();
    const [storyRef, isStoryVisible] = useIntersectionObserver();
    const [valuesRef, isValuesVisible] = useIntersectionObserver();

    // Build principles with icons
    const principles = ABOUT_PRINCIPLES.map(p => ({
        ...p,
        icon: ICON_MAP[p.iconName as keyof typeof ICON_MAP],
    }));

    return (
        <div className="bg-light text-dark fade-in">
            {/* Hero Section */}
            <section className="relative bg-white border-b border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gray-100 blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
                    <div ref={heroRef} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-on-scroll ${isHeroVisible ? 'is-visible' : ''}`}>
                        <div className="order-2 lg:order-1">
                            <p className="text-primary font-bold tracking-wide uppercase text-sm mb-2">{ABOUT_STRINGS.hero.badge}</p>
                            <h1 className="text-4xl lg:text-6xl font-extrabold text-dark leading-tight mb-6">
                                {ABOUT_STRINGS.hero.title} <span className="text-primary">{ABOUT_STRINGS.hero.titleHighlight1}</span> & <span className="text-primary">{ABOUT_STRINGS.hero.titleHighlight2}</span>.
                            </h1>
                            <p className="text-lg text-muted mb-8 leading-relaxed max-w-lg">
                                {ABOUT_STRINGS.hero.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to={ROUTES.CONTACT} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-full text-white bg-primary hover:brightness-95 transition-all shadow-lg hover:shadow-primary/25">
                                    {ABOUT_STRINGS.hero.ctaPrimary}
                                </Link>
                                <Link to={ROUTES.SERVICES} className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-base font-bold rounded-full text-dark bg-transparent hover:border-primary hover:text-primary transition-all">
                                    {ABOUT_STRINGS.hero.ctaSecondary}
                                </Link>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl transform translate-x-4 translate-y-4"></div>
                                <img
                                    src="https://picsum.photos/seed/avatar/500/500"
                                    alt="Eswarapandi Vinayagamoorthy"
                                    className="relative w-64 h-64 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-white shadow-2xl"
                                />
                                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <Rocket className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted font-bold uppercase">Current Mission</p>
                                        <p className="text-sm font-bold text-dark">Ranking #1 in 60 Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Credentials Banner */}
            <div className="bg-dark text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
                        {ABOUT_STRINGS.credentials.map((cred, idx) => (
                            <div key={idx} className="p-2">
                                <p className="text-3xl font-bold text-white mb-1">{cred.value}</p>
                                <p className="text-sm text-gray-400 font-medium">{cred.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* The Story Section */}
            <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={storyRef} className={`space-y-16 animate-on-scroll ${isStoryVisible ? 'is-visible' : ''}`}>
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-dark mb-6">{ABOUT_STRINGS.story.title}</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="prose prose-lg max-w-none prose-custom text-muted">
                        <p className="lead text-xl md:text-2xl font-medium text-dark text-center italic mb-12">
                            {ABOUT_STRINGS.story.quote}
                        </p>

                        <h3 className="font-bold text-dark text-2xl flex items-center gap-2">
                            <Globe className="w-6 h-6 text-primary" />
                            {ABOUT_STRINGS.story.whereItStarted.title}
                        </h3>
                        <p>{ABOUT_STRINGS.story.whereItStarted.content}</p>

                        <h3 className="font-bold text-dark text-2xl flex items-center gap-2 mt-12">
                            <GraduationCap className="w-6 h-6 text-primary" />
                            {ABOUT_STRINGS.story.evolution.title}
                        </h3>
                        <p>{ABOUT_STRINGS.story.evolution.content}</p>

                        <p>
                            This website and the <Link to={ROUTES.CHALLENGE} className="text-primary font-bold hover:underline">&quot;Search Me If You Can&quot;</Link> challenge are my way of demonstrating these skills in action. It&apos;s a commitment to transparency and a real-time showcase of what&apos;s possible with a strategic, data-driven approach.
                        </p>
                    </div>
                </div>
            </section>

            {/* Principles Section */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={valuesRef} className={`animate-on-scroll ${isValuesVisible ? 'is-visible' : ''}`}>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-extrabold text-dark">{ABOUT_STRINGS.philosophy.title}</h2>
                            <p className="mt-4 text-lg text-muted">{ABOUT_STRINGS.philosophy.subtitle}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {principles.map((principle, index) => (
                                <div key={index} className="bg-light p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <principle.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-dark mb-3">{principle.title}</h3>
                                    <p className="text-muted leading-relaxed">{principle.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-light">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">{ABOUT_STRINGS.cta.title}</h2>
                            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                                {ABOUT_STRINGS.cta.subtitle}
                            </p>
                            <Link to={ROUTES.WORK_WITH_ME} className="inline-flex items-center justify-center bg-white text-primary font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-lg transform hover:scale-105">
                                {ABOUT_STRINGS.cta.button}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
