/**
 * ChallengePage
 * L7 Refactored - Uses centralized constants
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Layers, PenTool, BarChart3, Megaphone, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { ChallengePhase } from '../types';
import {
    ROUTES,
    CHALLENGE_STRINGS,
    DEMONSTRATED_SKILLS,
    CHALLENGE_PROCESS_STEPS
} from '../constants';

// Icon mapping
const ICON_MAP = {
    Layers,
    PenTool,
    BarChart3,
    Megaphone,
};

const ChallengePage: React.FC = () => {
    const [phases, setPhases] = useState<ChallengePhase[]>([]);
    const [loading, setLoading] = useState(true);

    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [lineHeight, setLineHeight] = useState(0);

    useEffect(() => {
        const fetchPhases = async () => {
            const { data, error } = await supabase
                .from('challenge_phases')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) {
                if (error.code !== 'PGRST205' && error.code !== '42P01') {
                    console.warn('Error fetching phases:', error.message);
                }
            } else if (data) {
                setPhases(data as ChallengePhase[]);
            }
            setLoading(false);
        };
        fetchPhases();
    }, []);

    // Combine DB data with static content
    const steps = CHALLENGE_PROCESS_STEPS.map((staticStep, index) => {
        const dbPhase = phases.length > index ? phases[index] : null;
        const IconComponent = ICON_MAP[staticStep.iconName as keyof typeof ICON_MAP];
        return {
            ...staticStep,
            icon: IconComponent,
            number: index + 1,
            title: dbPhase ? dbPhase.title : staticStep.defaultTitle,
            isCompleted: dbPhase ? dbPhase.is_completed : false
        };
    });

    // Calculate line height
    useEffect(() => {
        if (loading || steps.length === 0) return;

        const calculateHeight = () => {
            if (!containerRef.current) return;

            let lastCompletedIndex = -1;
            for (let i = steps.length - 1; i >= 0; i--) {
                if (steps[i].isCompleted) {
                    lastCompletedIndex = i;
                    break;
                }
            }

            if (lastCompletedIndex >= 0 && stepRefs.current[lastCompletedIndex]) {
                const containerTop = containerRef.current.getBoundingClientRect().top;
                const stepEl = stepRefs.current[lastCompletedIndex];
                if (stepEl) {
                    const stepTop = stepEl.getBoundingClientRect().top;
                    const relativeTop = stepTop - containerTop;
                    setLineHeight(relativeTop + 40);
                }
            } else {
                setLineHeight(0);
            }
        };

        calculateHeight();
        window.addEventListener('resize', calculateHeight);
        const timeoutId = setTimeout(calculateHeight, 500);

        return () => {
            window.removeEventListener('resize', calculateHeight);
            clearTimeout(timeoutId);
        };
    }, [steps, loading]);

    const [headerRef, isHeaderVisible] = useIntersectionObserver();
    const [whyRef, isWhyVisible] = useIntersectionObserver();
    const [processRef, isProcessVisible] = useIntersectionObserver();
    const [missionRef, isMissionVisible] = useIntersectionObserver();
    const [ctaRef, isCtaVisible] = useIntersectionObserver();

    return (
        <div className="bg-white py-24 fade-in">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className={`text-center animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
                    <p className="text-lg font-semibold text-primary uppercase tracking-wider">{CHALLENGE_STRINGS.hero.badge}</p>
                    <h1 className="mt-4 text-4xl font-extrabold text-dark sm:text-5xl">{CHALLENGE_STRINGS.hero.title}</h1>
                    <p className="mt-6 text-xl text-muted max-w-3xl mx-auto">
                        {CHALLENGE_STRINGS.hero.subtitle}
                    </p>
                </div>

                <div ref={whyRef} className={`mt-20 prose prose-lg max-w-none prose-gray space-y-6 animate-on-scroll ${isWhyVisible ? 'is-visible' : ''}`}>
                    <h2 className="text-3xl font-extrabold text-dark">{CHALLENGE_STRINGS.why.title}</h2>
                    <p>
                        {CHALLENGE_STRINGS.why.intro} <strong className="text-primary">{CHALLENGE_STRINGS.why.proof}</strong>
                    </p>
                    <p>{CHALLENGE_STRINGS.why.description}</p>
                    <div className="bg-light p-6 rounded-2xl border border-gray-200">
                        <h3 className="text-xl font-bold text-dark !mt-0">{CHALLENGE_STRINGS.why.skillsTitle}</h3>
                        <ul className="!mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            {DEMONSTRATED_SKILLS.map(skill => (
                                <li key={skill} className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <span>{skill}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p>{CHALLENGE_STRINGS.why.conclusion}</p>
                </div>

                <div ref={processRef} className={`mt-20 pt-16 border-t border-gray-200 animate-on-scroll ${isProcessVisible ? 'is-visible' : ''}`}>
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">{CHALLENGE_STRINGS.process.title}</h2>
                        <p className="mt-4 text-xl text-muted max-w-2xl mx-auto">
                            {CHALLENGE_STRINGS.process.subtitle}
                        </p>
                    </div>
                    <div className="mt-20">
                        <div className="relative" ref={containerRef}>
                            <div className="absolute left-8 md:left-1/2 top-0 w-0.5 h-full bg-gray-200 -translate-x-1/2" aria-hidden="true"></div>
                            <div
                                className="absolute left-8 md:left-1/2 top-0 w-0.5 bg-primary -translate-x-1/2 transition-all duration-1000 ease-in-out"
                                style={{ height: `${lineHeight}px` }}
                                aria-hidden="true"
                            ></div>

                            <div className="space-y-16">
                                {steps.map((step, index) => {
                                    const isLeftDesktop = index % 2 === 0;
                                    const [stepInViewRef, isStepVisible] = useIntersectionObserver({ threshold: 0.3 });

                                    return (
                                        <div
                                            key={step.number}
                                            className={`relative animate-on-scroll ${isStepVisible ? 'is-visible' : ''}`}
                                        >
                                            <div ref={stepInViewRef} className="absolute inset-0 pointer-events-none"></div>
                                            <div
                                                ref={el => { stepRefs.current[index] = el }}
                                                className="absolute top-0 left-8 md:left-1/2 -translate-x-1/2 z-10"
                                            >
                                                <div
                                                    className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 shadow-lg transition-all duration-700 ${step.isCompleted
                                                        ? 'bg-primary border-primary shadow-primary/30'
                                                        : 'bg-white border-gray-200'
                                                        }`}
                                                >
                                                    {step.isCompleted ? (
                                                        <CheckCircle className="h-10 w-10 text-white" />
                                                    ) : (
                                                        <step.icon className={`h-8 w-8 ${step.isCompleted ? 'text-white' : 'text-primary'}`} />
                                                    )}
                                                </div>
                                            </div>

                                            <div className={`pl-24 md:pl-0 md:w-1/2 pt-2 ${isLeftDesktop ? 'md:mr-auto md:pr-14' : 'md:ml-auto md:pl-14'}`}>
                                                <div className={`p-6 bg-white rounded-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left ${isLeftDesktop ? 'md:text-right' : ''} ${step.isCompleted ? 'border-primary hover:border-primary border-t-4 shadow-md' : 'border-gray-200 hover:border-gray-300 border-t-4 border-t-transparent hover:border-t-primary'}`}>
                                                    <h3 className={`text-2xl font-bold ${step.isCompleted ? 'text-primary' : 'text-dark'}`}>
                                                        {step.title}
                                                        {step.isCompleted && <span className="ml-2 text-xs bg-black text-white px-2 py-1 rounded-full align-middle inline-block shadow-sm">Completed</span>}
                                                    </h3>
                                                    <p className="mt-2 text-muted">{step.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div ref={missionRef} className={`mt-20 pt-16 border-t border-gray-200 prose prose-lg max-w-none prose-gray space-y-6 animate-on-scroll ${isMissionVisible ? 'is-visible' : ''}`}>
                    <h2 className="text-3xl font-extrabold text-dark">{CHALLENGE_STRINGS.mission.title}</h2>
                    <p>{CHALLENGE_STRINGS.mission.p1}</p>
                    <p>{CHALLENGE_STRINGS.mission.p2}</p>
                    <blockquote className="border-l-4 border-primary bg-light p-6 rounded-r-lg">
                        <p className="!mt-0">{CHALLENGE_STRINGS.mission.quote}</p>
                    </blockquote>
                    <p className="font-semibold text-dark">{CHALLENGE_STRINGS.mission.closing}</p>
                </div>

                <section ref={ctaRef} className={`mt-24 animate-on-scroll ${isCtaVisible ? 'is-visible' : ''}`}>
                    <div className="bg-secondary text-secondary-foreground rounded-2xl p-12 text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full"></div>
                        <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-primary/20 rounded-full"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold">{CHALLENGE_STRINGS.cta.title}</h2>
                            <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary-foreground/80">
                                {CHALLENGE_STRINGS.cta.subtitle}
                            </p>
                            <div className="mt-8 flex justify-center gap-4 flex-wrap">
                                <Link to={ROUTES.BLOG} className="group inline-flex items-center justify-center bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:brightness-95">
                                    {CHALLENGE_STRINGS.cta.primary}
                                    <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                                <Link to={ROUTES.RESULTS} className="group inline-flex items-center justify-center bg-secondary-foreground/10 text-secondary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-secondary-foreground/20">
                                    {CHALLENGE_STRINGS.cta.secondary}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ChallengePage;
