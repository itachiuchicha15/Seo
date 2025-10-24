import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, MousePointer, Eye, Lightbulb, Zap, Target, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const ResultMetricCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; description: string; style?: React.CSSProperties; }> = ({ icon: Icon, label, value, description, style }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
    return (
        <div ref={ref} className={`bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-center animate-on-scroll ${isVisible ? 'is-visible' : ''}`} style={style}>
            <Icon className="h-12 w-12 text-primary mx-auto" />
            <p className="mt-4 text-5xl font-extrabold text-dark font-mono">{value}</p>
            <h3 className="mt-2 text-lg font-bold text-secondary">{label}</h3>
            <p className="text-sm text-muted">{description}</p>
        </div>
    );
};

interface TooltipData {
    x: number;
    y: number;
    post: typeof blogPosts[0];
}

const ResultsPage: React.FC = () => {
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const allPostsChronological = useMemo(() => [...blogPosts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), []);
    const firstPost = allPostsChronological[0];
    const latestPost = allPostsChronological[allPostsChronological.length - 1];

    const getGrowth = useMemo(() => (start: number, end: number) => {
        if (start === 0) return end > 0 ? `+${end}` : '0';
        const percentage = ((end - start) / start) * 100;
        return `${percentage > 0 ? '+' : ''}${percentage.toFixed(0)}%`;
    }, []);

    const chartData = useMemo(() => {
        const SVG_WIDTH = 900;
        const SVG_HEIGHT = 400;
        const PADDING = { top: 40, right: 60, bottom: 50, left: 60 };

        const maxImpressions = Math.max(...allPostsChronological.map(p => p.metrics.impressions), 1);
        const maxRank = 100; // Fixed max rank for better scale consistency

        const points = allPostsChronological.map((post, i) => {
            const x = PADDING.left + (i / (allPostsChronological.length - 1)) * (SVG_WIDTH - PADDING.left - PADDING.right);
            const yImpressions = PADDING.top + (SVG_HEIGHT - PADDING.top - PADDING.bottom) * (1 - post.metrics.impressions / maxImpressions);
            
            let yRank;
            if (typeof post.metrics.rank === 'number') {
                // Invert rank so lower (better) is higher on the chart
                yRank = PADDING.top + (SVG_HEIGHT - PADDING.top - PADDING.bottom) * ((maxRank - post.metrics.rank) / maxRank);
            } else {
                yRank = SVG_HEIGHT - PADDING.bottom; // "Not Indexed" at the bottom
            }

            return { post, x, yImpressions, yRank };
        });
        
        const impressionLinePoints = points.map(p => `${p.x},${p.yImpressions}`).join(' ');
        const rankLinePoints = points.filter(p => typeof p.post.metrics.rank === 'number').map(p => `${p.x},${p.yRank}`).join(' ');
        
        const annotations = [];
        const firstImpressionPost = allPostsChronological.find(p => p.metrics.impressions > 0);
        if (firstImpressionPost) {
            const point = points.find(p => p.post.id === firstImpressionPost.id);
            if(point) annotations.push({ x: point.x, y: point.yImpressions, label: 'First Impressions!' });
        }
        const firstClickPost = allPostsChronological.find(p => p.metrics.clicks > 0);
        if (firstClickPost) {
            const point = points.find(p => p.post.id === firstClickPost.id);
            if(point) annotations.push({ x: point.x, y: point.yImpressions, label: 'First Click!' });
        }

        return {
            svgWidth: SVG_WIDTH, svgHeight: SVG_HEIGHT, padding: PADDING, points, maxImpressions, maxRank, impressionLinePoints, rankLinePoints, annotations
        };
    }, [allPostsChronological]);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
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

        if (closestPoint && minDistance < 25) {
            setTooltip({
                x: closestPoint.x,
                y: Math.min(closestPoint.yImpressions, closestPoint.yRank),
                post: closestPoint.post,
            });
        } else {
            setTooltip(null);
        }
    };
    
    const keyLearnings = [
        {
            icon: Lightbulb,
            title: "Content is Still King",
            description: "High-quality, long-form content consistently drove the biggest jumps in impressions and rankings. Value and relevance are non-negotiable."
        },
        {
            icon: Zap,
            title: "Technical SEO Matters from Day 1",
            description: "A fast site, clean structure, and proper indexing setup created the foundation that allowed good content to be discovered quickly."
        },
        {
            icon: Target,
            title: "Patience and Consistency Win",
            description: "SEO is a marathon, not a sprint. The most significant gains came after weeks of consistent effort, not from a single 'magic bullet' tactic."
        },
    ]

    const [headerRef, isHeaderVisible] = useIntersectionObserver();
    const [journeyRef, isJourneyVisible] = useIntersectionObserver();
    const [chartRef, isChartVisible] = useIntersectionObserver();
    const [learningsRef, isLearningsVisible] = useIntersectionObserver();
    const [ctaRef, isCtaVisible] = useIntersectionObserver();


    return (
    <div className="bg-light pb-24">
      {/* Hero Section */}
      <section ref={headerRef} className={`bg-white text-center py-24 px-4 sm:px-6 lg:px-8 animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
        <p className="text-lg font-semibold text-primary uppercase tracking-wider">The 60-Day SEO Challenge</p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-dark">
          Challenge Complete: The Final Results
        </h1>
        <p className="mt-6 text-xl max-w-3xl mx-auto text-secondary">
          From a brand new domain to a ranked keyword in 60 days. Here's the full data-driven breakdown of the journey.
        </p>
      </section>
      
      {/* Trophy Case Metrics */}
      <section className="py-24 bg-light -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ResultMetricCard 
                    icon={Trophy} 
                    label="Final SERP Rank"
                    value={`#${latestPost.metrics.rank}`}
                    description="For the target keyword"
                    style={{ transitionDelay: '200ms' }}
                />
                 <ResultMetricCard 
                    icon={MousePointer} 
                    label="Total Clicks"
                    value={latestPost.metrics.clicks}
                    description={`${getGrowth(firstPost.metrics.clicks, latestPost.metrics.clicks)} growth over 60 days`}
                    style={{ transitionDelay: '350ms' }}
                />
                 <ResultMetricCard 
                    icon={Eye} 
                    label="Total Impressions"
                    value={latestPost.metrics.impressions}
                    description={`${getGrowth(firstPost.metrics.impressions, latestPost.metrics.impressions)} growth over 60 days`}
                    style={{ transitionDelay: '500ms' }}
                />
            </div>
        </div>
      </section>
      
      {/* The Journey: Before & After */}
      <section ref={journeyRef} className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-800 ${isJourneyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">The 60-Day Journey</h2>
                <p className="mt-4 text-lg text-muted max-w-3xl mx-auto">
                    A visual comparison of where the challenge started versus where it ended.
                </p>
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-8">
                {/* Day 1 Card */}
                <div className={`flex-shrink-0 bg-light p-8 rounded-2xl shadow-md border border-gray-200 w-64 text-center transition-all duration-800 delay-200 ${isJourneyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    <p className="text-sm font-bold text-muted uppercase">Day 1</p>
                    <p className="text-dark font-mono text-3xl font-bold mt-2">Not Indexed</p>
                    <p className="text-muted text-sm mt-2">0 Clicks, 0 Impressions</p>
                </div>

                {/* Connector */}
                <div className="relative flex-grow max-w-[200px] h-1 bg-gray-200">
                    <div 
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 transition-transform duration-[1200ms] ease-out"
                        style={{
                            transformOrigin: 'left',
                            transform: isJourneyVisible ? 'scaleX(1)' : 'scaleX(0)',
                            transitionDelay: '500ms',
                        }}
                    ></div>
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 transition-opacity duration-600 ease-out"
                        style={{ transitionDelay: '1500ms', opacity: isJourneyVisible ? 1 : 0 }}
                    >
                        <div
                            className="bg-light p-2 rounded-full shadow-md border border-gray-200 transition-transform duration-600 ease-out"
                            style={{ transitionDelay: '1500ms', transform: `translateY(${isJourneyVisible ? 0 : '20px'})` }}
                        >
                            <ArrowRight className="h-8 w-8 text-primary"/>
                        </div>
                    </div>
                </div>
                
                {/* Day 60 Card */}
                <div className={`flex-shrink-0 bg-white p-8 rounded-2xl shadow-xl border-2 border-primary w-72 text-center transition-all duration-800 delay-400 ${isJourneyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    <p className="text-sm font-bold text-primary uppercase">Day 60</p>
                    <p className="text-primary font-mono text-5xl font-bold mt-2">#{latestPost.metrics.rank}</p>
                    <p className="text-muted text-sm mt-2">{latestPost.metrics.clicks} Clicks, {latestPost.metrics.impressions} Impressions</p>
                </div>
            </div>
        </div>
      </section>
      
      {/* Performance Deep Dive */}
       <section ref={chartRef} className={`py-24 bg-light animate-on-scroll ${isChartVisible ? 'is-visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">Performance Deep Dive</h2>
                <p className="mt-4 text-lg text-muted max-w-3xl mx-auto">
                    Hover over the chart to explore how rank and impressions evolved over the entire 60-day period.
                </p>
            </div>
            <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200 relative">
                <svg viewBox={`0 0 ${chartData.svgWidth} ${chartData.svgHeight}`} className="w-full h-auto" onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)}>
                    <defs>
                        <linearGradient id="impressionGradientResults" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#6B7280" stopOpacity={0.1}/><stop offset="100%" stopColor="#6B7280" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="rankGradientResults" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.1}/><stop offset="100%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                         <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                        </marker>
                    </defs>
                    
                    <line x1={chartData.padding.left} y1={chartData.svgHeight - chartData.padding.bottom} x2={chartData.svgWidth - chartData.padding.right} y2={chartData.svgHeight - chartData.padding.bottom} stroke="#D1D5DB" />
                    <text x={chartData.padding.left - 10} y={chartData.padding.top} dy="0.3em" textAnchor="end" className="text-xs fill-muted font-semibold">{chartData.maxImpressions}</text>
                    <text x={chartData.padding.left - 10} y={chartData.svgHeight - chartData.padding.bottom} textAnchor="end" className="text-xs fill-muted font-semibold">0</text>
                    <text x={10} y={chartData.svgHeight/2} className="text-xs fill-muted font-bold" transform={`rotate(-90 10,${chartData.svgHeight/2})`}>Impressions</text>
                    
                    <text x={chartData.svgWidth-chartData.padding.right + 10} y={chartData.padding.top} dy="0.3em" textAnchor="start" className="text-xs fill-primary font-semibold">1</text>
                    <text x={chartData.svgWidth-chartData.padding.right + 10} y={chartData.svgHeight - chartData.padding.bottom} textAnchor="start" className="text-xs fill-primary font-semibold">{'>'}100</text>
                    <text x={chartData.svgWidth - 15} y={chartData.svgHeight/2} className="text-xs fill-primary font-bold" transform={`rotate(90 ${chartData.svgWidth-15},${chartData.svgHeight/2})`}>Rank (Higher is Better)</text>
                    
                    <path d={`M${chartData.points[0].x},${chartData.svgHeight - chartData.padding.bottom} L${chartData.impressionLinePoints} L${chartData.points[chartData.points.length-1].x},${chartData.svgHeight - chartData.padding.bottom} Z`} fill="url(#impressionGradientResults)" />
                    <polyline points={chartData.impressionLinePoints} fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: 'stroke-draw 2s 0.5s ease-out forwards' }} />
                    
                    <path d={`M${chartData.points[0].x},${chartData.svgHeight - chartData.padding.bottom} L${chartData.rankLinePoints} L${chartData.points[chartData.points.length-1].x},${chartData.svgHeight - chartData.padding.bottom} Z`} fill="url(#rankGradientResults)" />
                    <polyline points={chartData.rankLinePoints} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: 'stroke-draw 2s ease-out forwards' }}/>

                    {chartData.annotations.map((note, i) => (
                        <g key={i} className="fade-in" style={{ animationDelay: `${2 + i * 0.3}s` }}>
                            <line x1={note.x} y1={note.y} x2={note.x} y2={note.y - 40} stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3"/>
                            <circle cx={note.x} cy={note.y} r="5" fill="#10B981" stroke="white" strokeWidth="2" />
                            <text x={note.x + (i % 2 === 0 ? -8 : 8)} y={note.y - 45} textAnchor={i % 2 === 0 ? "end" : "start"} className="text-xs font-bold fill-emerald-600 bg-white" filter="url(#solid)">{note.label}</text>
                        </g>
                    ))}

                    {tooltip && (
                        <>
                            <line x1={tooltip.x} y1={chartData.padding.top} x2={tooltip.x} y2={chartData.svgHeight - chartData.padding.bottom} stroke="#9CA3AF" strokeDasharray="3,3" />
                            <circle cx={tooltip.x} cy={chartData.points.find(p => p.post.id === tooltip.post.id)?.yImpressions} r="5" fill="white" stroke="#6B7280" strokeWidth="2" />
                            <circle cx={tooltip.x} cy={chartData.points.find(p => p.post.id === tooltip.post.id)?.yRank} r="5" fill="white" stroke="#F59E0B" strokeWidth="2" />
                        </>
                    )}
                </svg>

                {tooltip && (
                    <div className="absolute bg-dark text-white p-3 rounded-lg shadow-xl text-xs w-48 pointer-events-none transition-all duration-100" style={{ top: `${tooltip.y - 120}px`, left: tooltip.x > chartData.svgWidth / 2 ? `${tooltip.x - 200}px` : `${tooltip.x + 10}px` }}>
                        <p className="font-bold border-b border-gray-600 pb-1 mb-1">{tooltip.post.date}</p>
                        <p className="font-semibold">{tooltip.post.title}</p>
                        <p className="mt-2"><span className="text-primary font-semibold">Rank:</span> {tooltip.post.metrics.rank}</p>
                        <p><span className="text-muted font-semibold">Clicks:</span> {tooltip.post.metrics.clicks}</p>
                        <p><span className="text-muted font-semibold">Impressions:</span> {tooltip.post.metrics.impressions}</p>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Key Learnings Section */}
      <section ref={learningsRef} className={`py-24 bg-white animate-on-scroll ${isLearningsVisible ? 'is-visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">From Data to Decisions: Key Takeaways</h2>
                <p className="mt-4 text-lg text-muted max-w-3xl mx-auto">
                    Success is more than numbers. It's about the actionable insights gained along the way.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {keyLearnings.map((learning, index) => (
                    <div key={learning.title} className="relative bg-gradient-to-br from-white to-light p-8 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group animate-on-scroll is-visible" style={{ transitionDelay: `${200 + index * 150}ms`}}>
                        <span className="absolute top-4 right-6 text-[100px] font-extrabold text-gray-200/60 transition-transform duration-300 group-hover:scale-105">0{index+1}</span>
                        <div className="relative z-10">
                            <learning.icon className="h-10 w-10 text-primary" />
                            <h3 className="mt-4 text-xl font-bold text-dark">{learning.title}</h3>
                            <p className="mt-2 text-muted">{learning.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

       {/* CTA Section */}
      <section ref={ctaRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-on-scroll ${isCtaVisible ? 'is-visible' : ''}`}>
        <div className="bg-secondary text-white rounded-2xl p-12 text-center relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full"></div>
             <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-primary/20 rounded-full"></div>
             <div className="relative z-10">
                <h2 className="text-3xl font-extrabold">Ready to Replicate These Results for Your Brand?</h2>
                <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                    The same data-driven, transparent process that powered this challenge can be applied to grow your business. Let's talk about your goals.
                </p>
                <div className="mt-8">
                    <Link to="/work-with-me" className="group inline-flex items-center justify-center bg-primary text-dark font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:brightness-95">
                        Let's Work Together
                        <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
      </section>

    </div>
    );
};

export default ResultsPage;