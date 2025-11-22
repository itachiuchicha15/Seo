
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Layers, PenTool, BarChart3, Megaphone, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { ChallengePhase } from '../types';

const ChallengePage: React.FC = () => {
  const [phases, setPhases] = useState<ChallengePhase[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Refs to calculate the height of the active line
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
               // Suppress missing table errors from Supabase
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

  // Content mapping
  const processStepContent = [
    {
      icon: Layers,
      defaultTitle: "Foundation & Setup",
      content: "The challenge begins with a clean slate. This involves purchasing a new domain, setting up a fast, lightweight website, and installing essential tracking tools to create a solid technical foundation.",
    },
    {
      icon: PenTool,
      defaultTitle: "Content Creation & On-Page SEO",
      content: "This is the core of the strategy. I will be regularly publishing high-quality, relevant content, with each piece meticulously optimized with on-page SEO best practices (titles, metas, headers, etc.).",
    },
    {
      icon: BarChart3,
      defaultTitle: "Tracking & Analysis",
      content: "Data drives every decision. I'll constantly monitor keyword rankings, organic traffic, and user engagement metrics. This allows for agile adjustments to the strategy based on what the data reveals.",
    },
    {
      icon: Megaphone,
      defaultTitle: "Public Updates & Transparency",
      content: "Every significant step, success, or failure will be documented in the Challenge Log. This commitment to transparency is key to the project's goal of being an educational resource and an honest portfolio piece.",
    }
  ];

  // Combine DB data with static content
  const steps = processStepContent.map((staticStep, index) => {
      const dbPhase = phases.length > index ? phases[index] : null;
      return {
          ...staticStep,
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
        
        // Find the last completed step index
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
                // Center of the step icon relative to container
                const stepTop = stepEl.getBoundingClientRect().top;
                const relativeTop = stepTop - containerTop;
                // Add half the icon height (40px roughly) to reach the center
                setLineHeight(relativeTop + 40); 
            }
        } else {
            setLineHeight(0);
        }
      };

      // Run calculation initially and on resize
      calculateHeight();
      window.addEventListener('resize', calculateHeight);
      // Delay slightly to ensure layout is settled
      const timeoutId = setTimeout(calculateHeight, 500);
      
      return () => {
          window.removeEventListener('resize', calculateHeight);
          clearTimeout(timeoutId);
      };
  }, [steps, loading]);

  
  const demonstratedSkills = [
      "Advanced keyword research and search intent analysis",
      "On-page SEO optimization and semantic structuring",
      "Content creation, topic clustering, and internal linking",
      "Organic growth strategies across search, social, and communities",
      "Analytics monitoring, impression tracking, and rank movement analysis",
      "Iteration, testing, creativity, and problem-solving in real time"
  ];

  const [headerRef, isHeaderVisible] = useIntersectionObserver();
  const [whyRef, isWhyVisible] = useIntersectionObserver();
  const [processRef, isProcessVisible] = useIntersectionObserver();
  const [missionRef, isMissionVisible] = useIntersectionObserver();
  const [ctaRef, isCtaVisible] = useIntersectionObserver();

  return (
    <div className="bg-white py-24 fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`text-center animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
          <p className="text-lg font-semibold text-primary uppercase tracking-wider">An Open Portfolio</p>
          <h1 className="mt-4 text-4xl font-extrabold text-dark sm:text-5xl">The 60-Day SEO Challenge</h1>
          <p className="mt-6 text-xl text-muted max-w-3xl mx-auto">
            “Search Me If You Can” is a personal experiment to rank a new brand from absolute zero in 60 days, using only pure SEO strategy and consistent execution.
          </p>
        </div>

        <div ref={whyRef} className={`mt-20 prose prose-lg max-w-none prose-gray space-y-6 animate-on-scroll ${isWhyVisible ? 'is-visible' : ''}`}>
          <h2 className="text-3xl font-extrabold text-dark">Why Take On Such a Difficult Challenge?</h2>
          <p>
            Because I want to prove something simple yet powerful: <strong className="text-secondary">If I can rank myself starting from nothing, I can rank your brand too.</strong>
          </p>
          <p>
            The online world is crowded with self-proclaimed “experts” who speak in theories but rarely demonstrate their abilities with transparent, real-time results. This challenge is my open portfolio. Instead of showing static case studies, I’m showing a live demonstration of my skillset.
          </p>
           <div className="bg-light p-6 rounded-2xl border border-gray-200">
               <h3 className="text-xl font-bold text-dark !mt-0">Skills on Display:</h3>
               <ul className="!mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                   {demonstratedSkills.map(skill => (
                       <li key={skill} className="flex items-start gap-3">
                           <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                           <span>{skill}</span>
                       </li>
                   ))}
               </ul>
           </div>
          <p>
            Every success, every setback, every experiment and every ranking movement is documented in the open. The challenge isn’t just about gaining visibility. It’s about showcasing end-to-end SEO thinking, transparency, and digital growth in a way most marketers never attempt.
          </p>
        </div>

        <div ref={processRef} className={`mt-20 pt-16 border-t border-gray-200 animate-on-scroll ${isProcessVisible ? 'is-visible' : ''}`}>
           <div className="text-center">
             <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">The Challenge Process</h2>
             <p className="mt-4 text-xl text-muted max-w-2xl mx-auto">
               A step-by-step breakdown of how this challenge is structured.
             </p>
           </div>
           <div className="mt-20">
             <div className="relative" ref={containerRef}>
                {/* Background Line */}
                <div className="absolute left-8 md:left-1/2 top-0 w-0.5 h-full bg-gray-200 -translate-x-1/2" aria-hidden="true"></div>
                
                {/* Dynamic Progress Line (Primary Color) */}
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
                                ref={(el) => {
                                    // Simplified logic handled by useEffect for line height
                                }}
                                className={`relative animate-on-scroll ${isStepVisible ? 'is-visible' : ''}`}
                            >
                                <div ref={stepInViewRef} className="absolute inset-0 pointer-events-none"></div>
                                
                                {/* The icon on the timeline */}
                                <div 
                                    ref={el => { stepRefs.current[index] = el }}
                                    className="absolute top-0 left-8 md:left-1/2 -translate-x-1/2 z-10"
                                >
                                    <div 
                                        className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 shadow-lg transition-all duration-700 ${
                                            step.isCompleted 
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
                                
                                {/* Content Card Wrapper */}
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
            <h2 className="text-3xl font-extrabold text-dark">The Bigger Picture: Mission & Purpose</h2>
            <p>
                This website is more than a portfolio it’s a digital laboratory. A place where I test ideas, share insights, document challenges, and showcase the power of consistent, strategic digital marketing. The 60-Day SEO Challenge is just the beginning. My goal is to turn this space into a resource for marketers, creators, business owners, freelancers, and anyone looking to grow online.
            </p>
            <p>
                Whether you're here out of curiosity, inspiration, or interest in working with me, I want this platform to provide something valuable knowledge, clarity, or simply the confidence that you’re witnessing real skills in action.
            </p>
            <blockquote className="border-l-4 border-primary bg-light p-6 rounded-r-lg">
                <p className="!mt-0">My mission is simple but powerful: To help brands grow using creativity, strategy, and full-stack digital execution. I want to empower businesses big or small to build strong digital identities, develop meaningful relationships with their audience, and achieve sustainable growth through organic visibility.</p>
            </blockquote>
             <p className="font-semibold text-dark">
                If I can create my own authority from scratch in 60 days, imagine what I can build for someone who already has a story, vision, and product worth discovering.
            </p>
        </div>

        <section ref={ctaRef} className={`mt-24 animate-on-scroll ${isCtaVisible ? 'is-visible' : ''}`}>
            <div className="bg-secondary text-white rounded-2xl p-12 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full"></div>
                <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-primary/20 rounded-full"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold">Follow The Journey</h2>
                    <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                        See the day-by-day progress, learnings, and real-time data from the challenge.
                    </p>
                    <div className="mt-8 flex justify-center gap-4 flex-wrap">
                        <Link to="/blog" className="group inline-flex items-center justify-center bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:brightness-95">
                            Read the Challenge Log
                            <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                         <Link to="/results" className="group inline-flex items-center justify-center bg-white/10 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-white/20">
                            See The Final Results
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
