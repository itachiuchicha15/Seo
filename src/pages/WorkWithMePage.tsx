/**
 * WorkWithMePage
 * L7 Refactored - Uses centralized constants
 */
import React from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Search, Wrench, LineChart, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { ROUTES, WORK_WITH_ME_STRINGS, WORK_PROCESS_STEPS } from '../constants';

// Icon mapping
const ICON_MAP = {
    Search,
    Wrench,
    LineChart,
};

const WorkWithMePage: React.FC = () => {
    const [headerRef, isHeaderVisible] = useIntersectionObserver();
    const [processRef, isProcessVisible] = useIntersectionObserver();
    const [fitRef, isFitVisible] = useIntersectionObserver();
    const [ctaRef, isCtaVisible] = useIntersectionObserver();

    return (
        <div className="bg-light pb-24 fade-in">
            {/* Hero Section */}
            <section ref={headerRef} className={`bg-white py-24 sm:py-32 animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-on-scroll is-visible" style={{ transitionDelay: '100ms' }}>
                            <h1 className="text-4xl font-extrabold text-dark sm:text-6xl">{WORK_WITH_ME_STRINGS.hero.title}</h1>
                            <p className="mt-6 text-xl text-muted max-w-xl">
                                {WORK_WITH_ME_STRINGS.hero.subtitle}
                            </p>
                        </div>
                        <div className="flex justify-center lg:justify-end animate-on-scroll is-visible" style={{ transitionDelay: '300ms' }}>
                            <div className="text-center p-8 bg-light rounded-2xl border-2 border-primary/20 shadow-lg max-w-md">
                                <img
                                    className="h-24 w-24 rounded-full mx-auto shadow-md ring-4 ring-white"
                                    src="https://picsum.photos/seed/avatar/200/200"
                                    alt="Eswarapandi V"
                                />
                                <p className="mt-6 text-2xl text-primary font-medium leading-tight">
                                    {WORK_WITH_ME_STRINGS.hero.quote}
                                </p>
                                <p className="mt-4 font-bold text-dark">{WORK_WITH_ME_STRINGS.hero.author}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section ref={processRef} className={`py-24 animate-on-scroll ${isProcessVisible ? 'is-visible' : ''}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">{WORK_WITH_ME_STRINGS.process.title}</h2>
                        <p className="mt-4 text-lg text-muted">{WORK_WITH_ME_STRINGS.process.subtitle}</p>
                    </div>
                    <div className="relative">
                        <div className="absolute top-0 left-8 md:left-1/2 w-0.5 h-full bg-gray-200 -translate-x-1/2" aria-hidden="true"></div>
                        <div className="space-y-16">
                            {WORK_PROCESS_STEPS.map((step, index) => {
                                const isLeftDesktop = index % 2 === 0;
                                const [stepRef, isStepVisible] = useIntersectionObserver({ threshold: 0.3 });
                                const IconComponent = ICON_MAP[step.iconName as keyof typeof ICON_MAP];
                                return (
                                    <div key={step.title} ref={stepRef} className={`relative animate-on-scroll ${isStepVisible ? 'is-visible' : ''}`}>
                                        <div className="absolute top-8 left-8 md:left-1/2 -translate-x-1/2 z-10">
                                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-primary shadow-lg">
                                                <IconComponent className="h-8 w-8 text-primary" />
                                            </div>
                                        </div>
                                        <div className={`pl-24 md:pl-0 md:w-1/2 ${isLeftDesktop ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}>
                                            <div className={`p-8 bg-white rounded-2xl shadow-md border border-gray-200 text-left ${isLeftDesktop ? 'md:text-right' : ''}`}>
                                                <h3 className="text-2xl font-bold text-dark">{step.title}</h3>
                                                <p className="mt-3 text-muted">{step.description}</p>
                                                <div className="mt-6 pt-4 border-t border-gray-200">
                                                    <h4 className="font-bold text-primary text-sm uppercase tracking-wide">{WORK_WITH_ME_STRINGS.process.included}</h4>
                                                    <ul className="mt-3 space-y-2">
                                                        {step.deliverables.map((item) => (
                                                            <li key={item} className={`flex items-center gap-3 text-muted text-sm ${isLeftDesktop ? 'md:justify-end' : 'justify-start'}`}>
                                                                {isLeftDesktop && <span>{item}</span>}
                                                                <CheckCircle className="h-5 w-5 text-primary/80 flex-shrink-0" />
                                                                {!isLeftDesktop && <span>{item}</span>}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Who is this for? Section */}
            <section ref={fitRef} className={`py-24 bg-white animate-on-scroll ${isFitVisible ? 'is-visible' : ''}`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">{WORK_WITH_ME_STRINGS.fit.title}</h2>
                        <p className="mt-4 text-lg text-muted">{WORK_WITH_ME_STRINGS.fit.subtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`p-8 bg-light rounded-2xl border-2 border-green-200 animate-on-scroll ${isFitVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                                <h3 className="text-2xl font-bold text-dark">{WORK_WITH_ME_STRINGS.fit.goodFit.title}</h3>
                            </div>
                            <ul className="mt-6 space-y-3 list-disc list-inside text-muted">
                                {WORK_WITH_ME_STRINGS.fit.goodFit.items.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className={`p-8 bg-light rounded-2xl border-2 border-red-200 animate-on-scroll ${isFitVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '400ms' }}>
                            <div className="flex items-center gap-3">
                                <XCircle className="h-8 w-8 text-red-500" />
                                <h3 className="text-2xl font-bold text-dark">{WORK_WITH_ME_STRINGS.fit.badFit.title}</h3>
                            </div>
                            <ul className="mt-6 space-y-3 list-disc list-inside text-muted">
                                {WORK_WITH_ME_STRINGS.fit.badFit.items.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section ref={ctaRef} className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-on-scroll ${isCtaVisible ? 'is-visible' : ''}`}>
                <div className="bg-secondary text-secondary-foreground rounded-2xl p-12 text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full"></div>
                    <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-primary/20 rounded-full"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold sm:text-4xl">{WORK_WITH_ME_STRINGS.cta.title}</h2>
                        <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary-foreground/80">
                            {WORK_WITH_ME_STRINGS.cta.subtitle}
                        </p>
                        <div className="mt-8">
                            <Link to={ROUTES.CONTACT} className="group inline-flex items-center justify-center bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:brightness-95">
                                {WORK_WITH_ME_STRINGS.cta.button}
                                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WorkWithMePage;
