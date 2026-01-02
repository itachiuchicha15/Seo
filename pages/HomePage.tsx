import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import { Target, Compass, CheckSquare, ChevronDown, ArrowRight, TrendingUp, MousePointer, Eye, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { BlogPost } from '../types';
import { supabase } from '../lib/supabaseClient';
import PostCard from '../components/PostCard';
import ParticleNetwork from '../components/ParticleNetwork';
import FloatingDataNuggets from '../components/FloatingDataNuggets';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useMediaQuery from '../hooks/useMediaQuery';
import BackToTopButton from '../components/BackToTopButton';
import Skeleton from '../components/Skeleton';
import { getThemeColor } from '../lib/utils';


const faqs = [
    {
        question: "What exactly is this challenge?",
        answer: "It's a 60-day public experiment where I build a new personal brand and try to rank it on Google for a specific keyword phrase from scratch, using only organic SEO techniques."
    },
    {
        question: "Why 60 days?",
        answer: "Sixty days is a challenging yet realistic timeframe to demonstrate meaningful progress in SEO. It's long enough for Google to recognize a new site but short enough to keep the pressure on."
    },
    {
        question: "How will rankings be tracked?",
        answer: "I will be using Google Search Console as the primary source of truth for rankings, clicks, and impressions. I'll share regular, unfiltered screenshots in the Challenge Log."
    },
    {
        question: "Can others replicate this?",
        answer: "Absolutely! The goal is to be fully transparent about the process and tactics used. You can follow along and apply the same principles to your own projects."
    }
];

const FAQItem: React.FC<{ question: string; answer: string, isOpen: boolean, onClick: () => void }> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-muted/10">
            <button
                onClick={onClick}
                className="flex w-full items-center justify-between py-5 sm:py-6 text-left"
                aria-expanded={isOpen}
            >
                <span className="text-base sm:text-lg font-medium text-dark pr-4">{question}</span>
                <ChevronDown className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-muted text-sm sm:text-base">
                    {answer}
                </p>
            </div>
        </div>
    );
};

interface TooltipData {
    x: number;
    y: number;
    post: BlogPost;
}

const RankChange: React.FC<{ currentRank: number | string; prevRank: number | string | null; }> = ({ currentRank, prevRank }) => {
    if (typeof currentRank !== 'number') {
        return <span className="text-muted font-semibold">{currentRank}</span>;
    }
    if (prevRank === null || typeof prevRank !== 'number') {
        return <span className="text-primary flex items-center gap-1 font-bold"><TrendingUp size={14} /> Indexed</span>;
    }

    const change = (typeof prevRank === 'number' ? prevRank : 100) - (typeof currentRank === 'number' ? currentRank : 100); 

    if (change > 0) {
        return <span className="text-primary flex items-center gap-1 font-bold" title={`Improved by ${change} positions`}><ArrowUp size={14} /> {change}</span>;
    }
    if (change < 0) {
        return <span className="text-secondary flex items-center gap-1 font-bold" title={`Dropped by ${Math.abs(change)} positions`}><ArrowDown size={14} /> {Math.abs(change)}</span>;
    }
    return <span className="text-muted flex items-center gap-1"><Minus size={14} /> 0</span>;
};

const DashboardSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-muted/10">
                        <div className="flex justify-between items-start mb-4">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                        <Skeleton className="h-12 w-20 mb-2" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-muted/10">
                <Skeleton className="h-6 w-48 mb-6" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="mt-6 flex justify-center">
                     <Skeleton className="h-6 w-40" />
                </div>
            </div>
        </div>
    );
};

const LiveChallengeDashboard: React.FC<{ blogPosts: BlogPost[] }> = ({ blogPosts }) => {
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [isLogVisible, setIsLogVisible] = useState(false);
    const [ref, isVisible] = useIntersectionObserver();
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const [colors, setColors] = useState({ primary: '#606C38', muted: '#DDA15E', chart: '#BC6C25', dark: '#283618', light: '#FEFAE0' });

    useEffect(() => {
        setColors({
            primary: getThemeColor('primary', '#606C38'),
            muted: getThemeColor('muted', '#DDA15E'),
            chart: getThemeColor('chart', '#BC6C25'),
            dark: getThemeColor('dark', '#283618'),
            light: getThemeColor('light', '#FEFAE0')
        });
    }, []);

    const sortedPosts = useMemo(() => [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [blogPosts]);
    const allPostsChronological = useMemo(() => [...blogPosts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [blogPosts]);
    
    if (blogPosts.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-2xl shadow-lg border border-muted/10">
                <p className="text-muted">No challenge data available yet. Check back soon!</p>
            </div>
        );
    }

    const latestPost = sortedPosts[0];
    const firstPost = sortedPosts[sortedPosts.length - 1];

    const getGrowth = useCallback((start: number, end: number) => {
        if (start === 0) return 'NEW';
        const percentage = ((end - start) / start) * 100;
        return `${percentage > 0 ? '+' : ''}${percentage.toFixed(0)}%`;
    }, []);

    const chartData = useMemo(() => {
        if (allPostsChronological.length < 2) return null;
        const SVG_WIDTH = 800;
        const SVG_HEIGHT = 250;
        const PADDING = { top: 20, right: 60, bottom: 30, left: 60 };

        const maxImpressions = Math.max(...allPostsChronological.map(p => p.metrics.impressions), 1);
        const rankValues = allPostsChronological.map(p => p.metrics.rank).filter(r => typeof r === 'number') as number[];
        const maxRank = Math.max(...rankValues, 100);

        const points = allPostsChronological.map((post, i) => {
            const x = PADDING.left + (i / (allPostsChronological.length - 1)) * (SVG_WIDTH - PADDING.left - PADDING.right);
            const yImpressions = PADDING.top + (SVG_HEIGHT - PADDING.top - PADDING.bottom) * (1 - post.metrics.impressions / maxImpressions);
            
            let yRank;
            if (typeof post.metrics.rank === 'number') {
                yRank = PADDING.top + (SVG_HEIGHT - PADDING.top - PADDING.bottom) * (post.metrics.rank / maxRank);
            } else {
                yRank = SVG_HEIGHT - PADDING.bottom;
            }

            return { post, x, yImpressions, yRank };
        });
        
        const impressionLinePoints = points.map(p => `${p.x},${p.yImpressions}`).join(' ');
        const rankLinePoints = points.map(p => `${p.x},${p.yRank}`).join(' ');
        
        const impressionAreaPoints = `M${points[0].x},${SVG_HEIGHT - PADDING.bottom} L${impressionLinePoints} L${points[points.length-1].x},${SVG_HEIGHT - PADDING.bottom} Z`;
        const rankAreaPoints = `M${points[0].x},${SVG_HEIGHT - PADDING.bottom} L${rankLinePoints} L${points[points.length-1].x},${SVG_HEIGHT - PADDING.bottom} Z`;


        return {
            svgWidth: SVG_WIDTH,
            svgHeight: SVG_HEIGHT,
            padding: PADDING,
            points,
            maxImpressions,
            maxRank,
            impressionLinePoints,
            rankLinePoints,
            impressionAreaPoints,
            rankAreaPoints
        };
    }, [allPostsChronological]);

    const updateTooltip = (cursorX: number) => {
        if (!chartData) return;
        let closestPoint = null;
        let minDistance = Infinity;

        chartData.points.forEach(p => {
            const distance = Math.abs(p.x - cursorX);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = p;
            }
        });

        if (closestPoint && minDistance < 50) {
            setTooltip({
                x: closestPoint.x,
                y: Math.min(closestPoint.yImpressions, closestPoint.yRank),
                post: closestPoint.post,
            });
        } else {
            setTooltip(null);
        }
    };
    
    return (
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
            <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
                <div className="min-w-[75vw] md:min-w-0 snap-center bg-white p-6 rounded-2xl shadow-lg border border-muted/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-auto">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-dark">Current SERP Rank</h3>
                            <TrendingUp className="h-8 w-8 text-primary/80" />
                        </div>
                        <p className="text-5xl font-bold font-mono text-dark mt-4">{latestPost.metrics.rank}</p>
                        <p className="text-sm text-muted mt-2">From <span className="font-semibold text-secondary">Not Indexed</span></p>
                    </div>
                </div>
                <div className="min-w-[75vw] md:min-w-0 snap-center bg-white p-6 rounded-2xl shadow-lg border border-muted/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-auto">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-dark">Total Clicks</h3>
                            <MousePointer className="h-8 w-8 text-primary/80" />
                        </div>
                        <p className="text-5xl font-bold font-mono text-dark mt-4">{latestPost.metrics.clicks}</p>
                        <p className="text-sm font-semibold text-primary mt-2">{getGrowth(firstPost.metrics.clicks, latestPost.metrics.clicks)} vs Day 1</p>
                    </div>
                </div>
                <div className="min-w-[75vw] md:min-w-0 snap-center bg-white p-6 rounded-2xl shadow-lg border border-muted/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-auto">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-dark">Total Impressions</h3>
                            <Eye className="h-8 w-8 text-primary/80" />
                        </div>
                        <p className="text-5xl font-bold font-mono text-dark mt-4">{latestPost.metrics.impressions}</p>
                        <p className="text-sm font-semibold text-primary mt-2">{getGrowth(firstPost.metrics.impressions, latestPost.metrics.impressions)} vs Day 1</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-muted/10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-dark">Performance Over Time</h3>
                </div>
                
                {chartData ? (
                <div className="relative w-full">
                    <svg
                        viewBox={`0 0 ${chartData.svgWidth} ${chartData.svgHeight}`}
                        className="w-full h-auto select-none"
                        onMouseMove={(e) => {
                             const svg = e.currentTarget;
                             const pt = svg.createSVGPoint();
                             pt.x = e.clientX;
                             const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
                             updateTooltip(cursorPoint.x);
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{ touchAction: 'pan-y' }} 
                    >
                        <defs>
                            <linearGradient id="impressionGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={colors.muted} stopOpacity={0.15}/>
                                <stop offset="100%" stopColor={colors.muted} stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="rankGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={colors.chart} stopOpacity={0.15}/>
                                <stop offset="100%" stopColor={colors.chart} stopOpacity={0}/>
                            </linearGradient>
                        </defs>

                        <line x1={chartData.padding.left} y1={chartData.svgHeight - chartData.padding.bottom} x2={chartData.svgWidth - chartData.padding.right} y2={chartData.svgHeight - chartData.padding.bottom} stroke={colors.muted} strokeOpacity="0.2" />
                        
                        <text x={chartData.padding.left - 10} y={chartData.padding.top} dy="0.3em" textAnchor="end" className="text-xs font-semibold fill-muted" fontSize={isMobile ? "14" : "12"}>{chartData.maxImpressions}</text>
                        <text x={chartData.padding.left - 10} y={chartData.svgHeight - chartData.padding.bottom} textAnchor="end" className="text-xs font-semibold fill-muted" fontSize={isMobile ? "14" : "12"}>0</text>
                        
                        <text x={chartData.svgWidth-chartData.padding.right + 10} y={chartData.padding.top} dy="0.3em" textAnchor="start" className="text-xs font-semibold" fill={colors.chart} fontSize={isMobile ? "14" : "12"}>1</text>
                        <text x={chartData.svgWidth-chartData.padding.right + 10} y={chartData.svgHeight - chartData.padding.bottom} textAnchor="start" className="text-xs font-semibold" fill={colors.chart} fontSize={isMobile ? "14" : "12"}>{'>'}{chartData.maxRank}</text>
                        
                        <path d={chartData.impressionAreaPoints} fill="url(#impressionGradient)" />
                        <path d={chartData.rankAreaPoints} fill="url(#rankGradient)" />

                        <polyline points={chartData.impressionLinePoints} fill="none" stroke={colors.muted} strokeWidth="2" strokeDasharray="4,4" />
                        <polyline points={chartData.rankLinePoints} fill="none" stroke={colors.chart} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                        {tooltip && (
                            <g>
                                <line x1={tooltip.x} y1={chartData.padding.top} x2={tooltip.x} y2={chartData.svgHeight - chartData.padding.bottom} stroke={colors.muted} strokeDasharray="3,3" />
                                <g transform={`translate(${tooltip.x > chartData.svgWidth / 2 ? tooltip.x - 210 : tooltip.x + 10}, ${chartData.padding.top})`}>
                                    <rect width="200" height="85" rx="8" fill={colors.dark} fillOpacity="0.95" />
                                    <text x="10" y="25" fill={colors.light} fontSize="12" fontWeight="bold">{tooltip.post.title.substring(0, 28)}...</text>
                                    <text x="10" y="45" fill={colors.chart} fontSize="11" fontWeight="bold">Rank: {tooltip.post.metrics.rank}</text>
                                    <text x="10" y="60" fill={colors.muted} fontSize="11">Clicks: <tspan fill={colors.light}>{tooltip.post.metrics.clicks}</tspan></text>
                                    <text x="10" y="75" fill={colors.muted} fontSize="11">Impressions: <tspan fill={colors.light}>{tooltip.post.metrics.impressions}</tspan></text>
                                </g>
                            </g>
                        )}
                    </svg>
                </div>
                ) : <div className="text-center p-8 text-muted">Not enough data to display chart.</div>}

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => setIsLogVisible(!isLogVisible)} 
                        className="font-bold text-primary hover:text-dark transition-colors inline-flex items-center gap-2"
                        aria-expanded={isLogVisible}
                    >
                        {isLogVisible ? 'Hide Detailed Log' : 'Show Detailed Log'}
                        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isLogVisible ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {isLogVisible && (
                    <div className="mt-6 overflow-x-auto fade-in">
                        <div className="border border-muted/10 rounded-lg">
                            <table className="min-w-full bg-white divide-y divide-muted/10">
                                <thead className="bg-light/30">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">Update</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-muted uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-muted uppercase tracking-wider">Change</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-muted/10">
                                    {allPostsChronological.slice(-5).reverse().map((post, idx, arr) => {
                                        const prevPost = idx < arr.length - 1 ? arr[idx + 1] : null;
                                        return (
                                            <tr key={post.id} className="hover:bg-light/20 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{post.date}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-dark whitespace-normal break-words max-w-[200px]">{post.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono font-bold text-secondary">{post.metrics.rank}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono">
                                                    <RankChange currentRank={post.metrics.rank} prevRank={prevPost?.metrics.rank ?? null} />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const HomePage: React.FC = () => {
  const challengeEndDate = new Date();
  challengeEndDate.setDate(challengeEndDate.getDate() + 60);

  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('date', { ascending: false });

        if (!error) setBlogPosts(data as BlogPost[]);
        setLoading(false);
    };
    fetchData();
  }, []);
  
  const latestPostsForTimeline = useMemo(() => blogPosts.slice(0, 3), [blogPosts]);
  const allPostsChronological = useMemo(() => [...blogPosts].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [blogPosts]);

  const [heroRef, isHeroVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [dashboardRef, isDashboardVisible] = useIntersectionObserver();
  const [caseStudyRef, isCaseStudyVisible] = useIntersectionObserver();
  const [logRef, isLogVisible] = useIntersectionObserver();
  const [faqRef, isFaqVisible] = useIntersectionObserver();
  const isMobile = useMediaQuery('(max-width: 768px)');


  return (
    <div className="text-dark">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-light overflow-hidden">
        {!isMobile && <ParticleNetwork isAnimating={isHeroVisible} />}
        {!isMobile && <FloatingDataNuggets isAnimating={isHeroVisible} />}
        <div className="absolute inset-0 bg-gradient-to-b from-light/0 to-light z-[5]"></div>
        <div className="relative z-10 py-16 sm:py-24 lg:py-32">
          {/* FIXED: container alignment bug (auto -> mx-auto) */}
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-lg font-bold text-primary uppercase tracking-widest fade-in-up" style={{ animationDelay: '100ms' }}>
              The 60-Day SEO Challenge
            </p>
            <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-dark fade-in-up leading-tight" style={{ animationDelay: '200ms' }}>
              Search Me If You Can
            </h1>
            <p className="mt-6 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto text-dark/70 fade-in-up" style={{ animationDelay: '400ms' }}>
              If I can rank myself, I can rank your brand. A real-time portfolio proving SEO skills, not just talking about them.
            </p>
            <div className="mt-8 sm:mt-12 max-w-3xl mx-auto fade-in-up" style={{ animationDelay: '600ms' }}>
              <CountdownTimer targetDate={challengeEndDate} />
            </div>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-4 fade-in-up px-4 sm:px-0" style={{ animationDelay: '800ms' }}>
              <Link to="/blog" className="w-full sm:w-auto inline-block bg-primary text-light font-bold py-4 px-10 rounded-full text-lg hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-primary/20 text-center">
                Follow the Challenge
              </Link>
              <Link to="/challenge" className="w-full sm:w-auto inline-block bg-white text-dark font-bold py-4 px-10 rounded-full text-lg hover:bg-light/50 transition-all duration-300 transform hover:scale-105 border-2 border-muted/20 text-center">
                About The Challenge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Metrics Dashboard Section */}
      <section className="py-12 md:py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={dashboardRef} className={`text-center mb-10 md:mb-16 animate-on-scroll ${isDashboardVisible ? 'is-visible' : ''}`}>
                <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">Live Performance</h2>
                <p className="mt-4 text-lg text-muted max-w-3xl mx-auto">
                    Real-time progress, from day zero to total organic domination.
                </p>
            </div>
            {loading ? <DashboardSkeleton /> : <LiveChallengeDashboard blogPosts={blogPosts} />}
        </div>
      </section>

      {/* Case Study Section */}
      <section ref={caseStudyRef} className={`py-12 md:py-24 bg-white animate-on-scroll ${isCaseStudyVisible ? 'is-visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">A Transparent Case Study</h2>
            <p className="mt-4 text-lg text-muted max-w-3xl mx-auto">
              This challenge is a public demonstration of ranking a brand new site from scratch—pure SEO strategy.
            </p>
          </div>
          <div className="mt-10 md:mt-16 grid gap-12 lg:grid-cols-2 items-center">
            <div className="animate-on-scroll is-visible" style={{ transitionDelay: '200ms' }}>
              <img loading="lazy" src="https://picsum.photos/seed/casestudy/800/600" alt="Data analysis dashboard" className="rounded-3xl shadow-2xl w-full h-auto border border-muted/10" />
            </div>
            <div className="space-y-8">
              <div className="flex items-start animate-on-scroll is-visible" style={{ transitionDelay: '400ms' }}>
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-dark">The Goal</h3>
                  <p className="mt-2 text-muted">
                    Achieve a top-10 Google ranking for "Eswarapandi SEO Challenge" to showcase practical, effective skills.
                  </p>
                </div>
              </div>
              <div className="flex items-start animate-on-scroll is-visible" style={{ transitionDelay: '600ms' }}>
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
                  <Compass className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-dark">The Stakes</h3>
                  <p className="mt-2 text-muted">
                    Success builds my brand. Failure is a public lesson. Either way, it's a real-world demonstration of the SEO journey.
                  </p>
                </div>
              </div>
              <div className="flex items-start animate-on-scroll is-visible" style={{ transitionDelay: '800ms' }}>
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-dark">The Rules</h3>
                  <ul className="mt-2 text-muted list-disc list-inside space-y-1">
                    <li>No budget for ads.</li>
                    <li>No prior brand authority.</li>
                    <li>No paid backlink campaigns.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Logs Section */}
      <section ref={logRef} className={`py-12 md:py-24 bg-light animate-on-scroll ${isLogVisible ? 'is-visible' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10 md:mb-16">
            <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">Latest Updates</h2>
            <Link to="/blog" className="group inline-flex items-center font-bold text-primary hover:text-dark transition-colors">
              View All Logs
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
            <div className="space-y-0">
                {latestPostsForTimeline.map((post, index) => {
                    const postNumber = allPostsChronological.findIndex(p => p.id === post.id) + 1;
                    return (
                        <div key={post.id} className="group flex animate-on-scroll is-visible" style={{ transitionDelay: `${index * 200}ms` }}>
                            <div className="flex flex-col items-center mr-4 sm:mr-6">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center z-10 bg-light transition-transform duration-300 group-hover:scale-110">
                                    <span className="font-bold text-primary text-base sm:text-lg">{postNumber}</span>
                                </div>
                                {index < latestPostsForTimeline.length - 1 && (
                                    <div className="w-px flex-1 bg-muted/20"></div>
                                )}
                            </div>

                            <div className="pb-8 sm:pb-12 transition-transform duration-300 group-hover:translate-x-2 w-full">
                                <p className="text-sm font-bold text-muted tracking-widest uppercase">{post.date}</p>
                                <Link to={`/blog/${post.slug}`} className="block mt-1 mb-2">
                                    <h3 className="text-xl sm:text-2xl font-bold text-dark group-hover:text-primary transition-colors">{post.title}</h3>
                                </Link>
                                <p className="text-muted mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>
                                <div className="p-4 bg-white border border-muted/10 rounded-xl flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                                    <div className="flex items-center gap-1.5 font-bold"><TrendingUp className="text-primary h-4 w-4" /> Rank: <span className="text-secondary">{post.metrics.rank}</span></div>
                                    <div className="flex items-center gap-1.5 font-bold"><MousePointer className="text-primary h-4 w-4" /> Clicks: <span className="text-secondary">{post.metrics.clicks}</span></div>
                                    <div className="flex items-center gap-1.5 font-bold"><Eye className="text-primary h-4 w-4" /> Impr: <span className="text-secondary">{post.metrics.impressions}</span></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

       {/* FAQ Section */}
      <section ref={faqRef} className={`py-12 md:py-24 bg-white animate-on-scroll ${isFaqVisible ? 'is-visible' : ''}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold text-center text-dark mb-8 md:mb-12 uppercase tracking-widest">Common Questions</h2>
              <div className="space-y-2 sm:space-y-4">
                  {faqs.map((faq, index) => (
                      <FAQItem 
                          key={index}
                          question={faq.question} 
                          answer={faq.answer}
                          isOpen={openFAQ === index}
                          onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      />
                  ))}
              </div>
          </div>
      </section>
      <BackToTopButton />
    </div>
  );
};

export default HomePage;
