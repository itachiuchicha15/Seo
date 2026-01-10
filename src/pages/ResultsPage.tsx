import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Trophy, MousePointer, Eye, Lightbulb, Zap, Target, ArrowRight, ArrowDown, TrendingUp, Calendar, CheckCircle, Star, BarChart } from 'lucide-react';
import { BlogPost } from '../types';
import { supabase } from '../lib/supabaseClient';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { useAllPosts } from '../hooks/queries';
import Skeleton from '../components/Skeleton';
import { getThemeColor } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { ROUTES, RESULTS_LESSONS } from '../constants';

// --- Helper Components ---

const NumberTicker: React.FC<{ value: string | number, delay?: number }> = ({ value, delay = 0 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const stringVal = value.toString();
    const numericValue = parseFloat(stringVal.replace(/[^0-9.]/g, ''));
    const prefix = stringVal.match(/^[^\d]*/)?.[0] || '';
    const suffix = stringVal.match(/[^\d]*$/)?.[0] || '';
    const isNumber = !isNaN(numericValue);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible || !isNumber) return;

        let startTimestamp: number | null = null;
        const duration = 2000;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setDisplayValue(Math.floor(easeProgress * numericValue));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setDisplayValue(numericValue);
            }
        };

        const timeoutId = setTimeout(() => {
            window.requestAnimationFrame(step);
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [isVisible, numericValue, isNumber, delay]);

    if (!isNumber) return <span>{value}</span>;
    return <span ref={elementRef}>{prefix}{displayValue}{suffix}</span>;
};

const ResultMetricCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: string | number;
    description: string;
    trend?: string;
    delay?: number;
}> = ({ icon: Icon, label, value, description, trend, delay = 0 }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

    return (
        <div
            ref={ref}
            className={`relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-muted/20 overflow-hidden group transition-all duration-500 hover:-translate-y-1 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-light rounded-full group-hover:bg-primary/5 group-hover:scale-125 transition-all duration-700 ease-out z-0"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-3.5 bg-light rounded-2xl group-hover:bg-primary group-hover:text-light transition-all duration-300 shadow-sm">
                        <Icon className="h-6 w-6 text-primary group-hover:text-light" />
                    </div>
                    {trend && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            <TrendingUp className="w-3 h-3 mr-1.5" /> {trend}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <p className="text-5xl font-extrabold text-dark tracking-tight tabular-nums">
                        <NumberTicker value={value} delay={delay + 200} />
                    </p>
                    <h3 className="text-sm font-bold text-muted uppercase tracking-widest">{label}</h3>
                </div>

                <div className="mt-6 pt-6 border-t border-light">
                    <p className="text-sm text-dark/70 font-medium leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
};

const ResultsSkeleton: React.FC = () => {
    return (
        <div className="bg-light min-h-screen pb-24">
            <div className="bg-white text-center py-32 px-4 border-b border-light">
                <Skeleton className="h-6 w-48 mx-auto mb-6 rounded-full" />
                <Skeleton className="h-16 w-3/4 max-w-2xl mx-auto mb-8" />
                <Skeleton className="h-6 w-1/2 max-w-xl mx-auto" />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-xl border border-light h-64 flex flex-col justify-between">
                            <div className="flex justify-between">
                                <Skeleton className="h-12 w-12 rounded-2xl" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                            <div>
                                <Skeleton className="h-12 w-32 mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface TooltipData {
    x: number;
    y: number;
    post: BlogPost;
}

const ResultsPage: React.FC = () => {
    const { theme } = useTheme();

    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [colors, setColors] = useState({ primary: '#606C38', secondary: '#BC6C25', muted: '#DDA15E', chart: '#BC6C25', dark: '#283618', light: '#FEFAE0' });

    const [headerRef, isHeaderVisible] = useIntersectionObserver();
    const [journeyRef, isJourneyVisible] = useIntersectionObserver();
    const [chartRef, isChartVisible] = useIntersectionObserver();
    const [learningsRef, isLearningsVisible] = useIntersectionObserver();
    const [ctaRef, isCtaVisible] = useIntersectionObserver();

    // Data Fetching via React Query
    const { data: posts = [], isLoading: loading } = useAllPosts();

    useEffect(() => {
        // Delay to allow DOM update for CSS variables
        const timer = setTimeout(() => {
            setColors({
                primary: getThemeColor('primary', '#606C38'),
                secondary: getThemeColor('secondary', '#BC6C25'),
                muted: getThemeColor('muted', '#DDA15E'),
                chart: getThemeColor('chart', '#BC6C25'),
                dark: getThemeColor('dark', '#283618'),
                light: getThemeColor('light', '#FEFAE0')
            });
        }, 50);
        return () => clearTimeout(timer);
    }, [theme]);

    const allPostsChronological = posts;
    const firstPost = allPostsChronological[0];
    const latestPost = allPostsChronological[allPostsChronological.length - 1];

    const getGrowthDisplay = (start: number, end: number) => {
        if (start === 0) return `+${end} total`;
        const percentage = ((end - start) / start) * 100;
        return `${percentage > 0 ? '+' : ''}${percentage.toFixed(0)}%`;
    };

    const chartData = useMemo(() => {
        if (allPostsChronological.length < 2) return null;
        const SVG_WIDTH = 1000;
        const SVG_HEIGHT = 450;
        const PADDING = { top: 50, right: 80, bottom: 60, left: 80 };
        const maxImpressions = Math.max(...allPostsChronological.map(p => p.metrics.impressions), 10);
        const maxRank = 100;

        const points = allPostsChronological.map((post, i) => {
            const x = PADDING.left + (i / (allPostsChronological.length - 1)) * (SVG_WIDTH - PADDING.left - PADDING.right);
            const yImpressions = PADDING.top + (SVG_HEIGHT - PADDING.top - PADDING.bottom) * (1 - post.metrics.impressions / maxImpressions);
            let yRank = (typeof post.metrics.rank === 'number')
                ? PADDING.top + (SVG_HEIGHT - PADDING.top - PADDING.bottom) * ((maxRank - post.metrics.rank) / maxRank)
                : SVG_HEIGHT - PADDING.bottom;
            return { post, x, yImpressions, yRank };
        });

        const impressionLinePoints = points.map(p => `${p.x},${p.yImpressions}`).join(' ');
        const rankLinePoints = points.filter(p => typeof p.post.metrics.rank === 'number').map(p => `${p.x},${p.yRank}`).join(' ');

        const annotations = [];
        const top10 = allPostsChronological.find(p => typeof p.metrics.rank === 'number' && p.metrics.rank <= 10);
        if (top10) {
            const point = points.find(p => p.post.id === top10.id);
            if (point) annotations.push({ x: point.x, y: point.yRank, label: 'Cracked Top 10!', type: 'rank' });
        }

        return { svgWidth: SVG_WIDTH, svgHeight: SVG_HEIGHT, padding: PADDING, points, maxImpressions, maxRank, impressionLinePoints, rankLinePoints, annotations };
    }, [allPostsChronological]);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!chartData) return;
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        let closestPoint = null;
        let minDistance = Infinity;
        chartData.points.forEach(p => {
            const distance = Math.abs(p.x - cursorPoint.x);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = p;
            }
        });
        if (closestPoint && minDistance < 50) {
            setTooltip({ x: closestPoint.x, y: Math.min(closestPoint.yImpressions, closestPoint.yRank), post: closestPoint.post });
        } else {
            setTooltip(null);
        }
    };

    // Icon mapping for lessons
    const LESSON_ICONS = { Lightbulb, Zap, Target };
    const keyLearnings = RESULTS_LESSONS.map(l => ({
        ...l,
        icon: LESSON_ICONS[l.iconName as keyof typeof LESSON_ICONS],
    }));

    if (loading) return <ResultsSkeleton />;
    if (!latestPost) return <div className="py-40 text-center">Not enough data to display results.</div>

    const CARD_CLASSES = "w-full max-w-[280px] h-[400px] relative rounded-[2rem] p-6 flex flex-col items-center justify-between transition-all duration-500 shadow-xl border";

    return (
        <div className="bg-light min-h-screen font-sans text-dark">
            <section className="relative bg-white border-b border-muted/10 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-70"></div>
                </div>
                <div ref={headerRef} className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40 text-center animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
                    <div className="inline-flex items-center gap-2 bg-primary text-light px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide mb-8 shadow-xl shadow-primary/20">
                        <CheckCircle className="w-4 h-4 text-light" /> Mission Accomplished
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-dark tracking-tight mb-6 leading-tight">
                        Ranked in <span className="text-primary">60 Days</span>
                    </h1>
                    <p className="mt-6 text-xl md:text-2xl text-dark/70 max-w-3xl mx-auto leading-relaxed">
                        A transparent SEO experiment starting from absolute zero.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    <ResultMetricCard icon={Trophy} label="Final Rank" value={`#${latestPost.metrics.rank}`} description="Target Keyword Position" trend="Target Achieved" delay={100} />
                    <ResultMetricCard icon={MousePointer} label="Total Clicks" value={latestPost.metrics.clicks} description="Organic Search Traffic" trend={`${getGrowthDisplay(firstPost.metrics.clicks, latestPost.metrics.clicks)} Growth`} delay={300} />
                    <ResultMetricCard icon={Eye} label="Impressions" value={latestPost.metrics.impressions} description="Search Visibility" trend={`${getGrowthDisplay(firstPost.metrics.impressions, latestPost.metrics.impressions)} Growth`} delay={500} />
                </div>
            </div>

            <section ref={journeyRef} className="py-32 bg-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-20 animate-on-scroll ${isJourneyVisible ? 'is-visible' : ''}`}>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-dark">The Transformation</h2>
                        <p className="mt-4 text-lg text-muted">A leap from obscurity to authority.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
                        <div className={`${CARD_CLASSES} bg-white border-muted/20 ${isJourneyVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '100ms' }}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-muted font-bold text-[10px] px-4 py-1 rounded-full border border-muted/30 uppercase tracking-widest">Day 01</div>
                            <div className="flex-1 flex flex-col items-center justify-center w-full">
                                <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mb-5 opacity-50"><Calendar className="w-8 h-8 text-muted" /></div>
                                <div className="text-center mb-6 opacity-50"><p className="text-4xl font-bold text-muted/40 font-mono mb-2">--</p><p className="text-[10px] font-bold text-muted uppercase tracking-widest">Not Indexed</p></div>
                            </div>
                            <div className="w-full pt-6 border-t border-dashed border-muted/20 grid grid-cols-2 gap-4 opacity-60">
                                <div className="text-center"><p className="font-bold text-lg text-muted">0</p><p className="text-[10px] uppercase text-muted font-bold tracking-wider">Clicks</p></div>
                                <div className="text-center"><p className="font-bold text-lg text-muted">0</p><p className="text-[10px] uppercase text-muted font-bold tracking-wider">Impr.</p></div>
                            </div>
                        </div>

                        <div className="relative flex-shrink-0 flex items-center justify-center z-10">
                            <div className={`w-12 h-12 rounded-full bg-white shadow-lg border border-light flex items-center justify-center text-primary transition-all duration-700 ${isJourneyVisible ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'}`} style={{ transitionDelay: '300ms' }}>
                                <ArrowRight className="w-5 h-5 hidden lg:block" />
                                <ArrowDown className="w-5 h-5 lg:hidden" />
                            </div>
                            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20"></div>
                        </div>

                        <div className={`${CARD_CLASSES} bg-dark text-light border-dark shadow-2xl ${isJourneyVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '500ms' }}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-light font-bold text-[10px] px-4 py-1.5 rounded-full border-4 border-light uppercase tracking-widest shadow-lg z-20">Day 60</div>
                            <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
                                <div className="w-16 h-16 bg-light/10 rounded-full flex items-center justify-center mb-5 backdrop-blur-md ring-1 ring-light/20"><Trophy className="w-8 h-8 text-secondary" /></div>
                                <div className="text-center mb-6">
                                    <p className="text-5xl font-extrabold text-light font-mono tracking-tighter">
                                        <span className="text-muted mr-1 text-3xl align-top mt-2 inline-block">#</span>
                                        <NumberTicker value={latestPost.metrics.rank} delay={1000} />
                                    </p>
                                    <p className="text-[10px] font-bold text-secondary uppercase mt-3 tracking-[0.2em] flex items-center justify-center gap-1">Final Rank</p>
                                </div>
                            </div>
                            <div className="relative z-10 w-full pt-6 border-t border-light/10 grid grid-cols-2 gap-4">
                                <div className="text-center"><p className="font-bold text-xl text-light"><NumberTicker value={latestPost.metrics.clicks} delay={1200} /></p><p className="text-[10px] uppercase text-muted font-bold tracking-wider">Clicks</p></div>
                                <div className="text-center"><p className="font-bold text-xl text-light"><NumberTicker value={latestPost.metrics.impressions} delay={1400} /></p><p className="text-[10px] uppercase text-muted font-bold tracking-wider">Impr.</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={chartRef} className={`py-32 bg-white animate-on-scroll ${isChartVisible ? 'is-visible' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-4 space-y-8">
                            <div>
                                <div className="inline-block p-3 rounded-2xl bg-primary/5 text-primary mb-4"><BarChart className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-extrabold text-dark leading-tight">Performance<br />Deep Dive</h2>
                            </div>
                            <p className="text-lg text-dark/70 leading-relaxed">Correlation between consistent output and search visibility.</p>
                        </div>
                        <div className="lg:col-span-8">
                            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-2xl border border-light relative">
                                {chartData ? (
                                    <div className="relative w-full aspect-[16/10] sm:aspect-[2/1]">
                                        <svg viewBox={`0 0 ${chartData.svgWidth} ${chartData.svgHeight}`} className="w-full h-full overflow-visible" onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)}>
                                            <defs>
                                                <linearGradient id="impressionGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={colors.primary} stopOpacity={0.1} /><stop offset="100%" stopColor={colors.primary} stopOpacity={0} /></linearGradient>
                                            </defs>
                                            <path d={`M${chartData.points[0].x},${chartData.svgHeight - chartData.padding.bottom} L${chartData.impressionLinePoints} L${chartData.points[chartData.points.length - 1].x},${chartData.svgHeight - chartData.padding.bottom} Z`} fill="url(#impressionGrad)" />
                                            <polyline points={chartData.impressionLinePoints} fill="none" stroke={colors.primary} strokeWidth="2" strokeDasharray="5,5" strokeOpacity="0.4" />
                                            <polyline points={chartData.rankLinePoints} fill="none" stroke={colors.secondary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            {tooltip && (
                                                <g><line x1={tooltip.x} y1={chartData.padding.top} x2={tooltip.x} y2={chartData.svgHeight - chartData.padding.bottom} stroke={colors.dark} strokeWidth="1" strokeDasharray="4 4" opacity="0.3" /><circle cx={tooltip.x} cy={chartData.points.find(p => p.post.id === tooltip.post.id)?.yRank} r="8" fill={colors.secondary} stroke="white" strokeWidth="3" /></g>
                                            )}
                                        </svg>
                                        {tooltip && (
                                            <div className="absolute z-50 bg-dark text-light p-4 rounded-xl shadow-2xl text-xs w-56 transform -translate-x-1/2 -translate-y-full" style={{ top: `${(tooltip.y / chartData.svgHeight) * 100}%`, left: `${(tooltip.x / chartData.svgWidth) * 100}%`, marginTop: '-20px' }}>
                                                <div className="flex items-center justify-between mb-2 border-b border-light/10 pb-2"><span className="font-bold">{new Date(tooltip.post.date).toLocaleDateString()}</span></div>
                                                <p className="font-bold text-sm mb-3 line-clamp-1">{tooltip.post.title}</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-light/10 p-2 rounded-lg"><p className="text-[10px] text-muted uppercase font-bold">Rank</p><p className="text-lg font-mono font-bold text-primary">{tooltip.post.metrics.rank}</p></div>
                                                    <div className="bg-light/10 p-2 rounded-lg"><p className="text-[10px] text-muted uppercase font-bold">Impr.</p><p className="text-lg font-mono font-bold">{tooltip.post.metrics.impressions}</p></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={learningsRef} className={`py-32 bg-light animate-on-scroll ${isLearningsVisible ? 'is-visible' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20"><h2 className="text-3xl font-extrabold text-dark sm:text-4xl">Strategic Takeaways</h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {keyLearnings.map((learning, index) => (
                            <div key={learning.title} className="relative bg-white p-10 rounded-[2rem] border border-muted/20 overflow-hidden group hover:shadow-2xl transition-all duration-500" style={{ transitionDelay: `${index * 100}ms` }}>
                                <span className="absolute -bottom-6 -right-4 text-[140px] font-extrabold text-light opacity-50 select-none">0{index + 1}</span>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-light rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-light transition-colors duration-300"><learning.icon className="h-6 w-6" /></div>
                                    <h3 className="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">{learning.title}</h3>
                                    <p className="text-dark/70 leading-relaxed">{learning.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={ctaRef} className={`py-24 bg-white animate-on-scroll ${isCtaVisible ? 'is-visible' : ''}`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-dark text-light rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-dark/30">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Results You Can Replicate.</h2>
                            <p className="text-lg md:text-xl text-light/70 max-w-2xl mx-auto mb-10">The same data-driven process can elevate your brand.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link to={ROUTES.WORK_WITH_ME} className="group inline-flex items-center justify-center bg-primary text-light font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-lg hover:scale-105">Apply This Strategy <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" /></Link>
                                <Link to={ROUTES.BLOG} className="inline-flex items-center justify-center bg-transparent border border-muted/30 text-light font-bold py-4 px-10 rounded-xl text-lg hover:bg-light/5">Read The Logs</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ResultsPage;