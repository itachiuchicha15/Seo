

import React from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Layers, PenTool, BarChart3, Megaphone, CheckCircle, ArrowRight } from 'lucide-react';

const ChallengePage: React.FC = () => {
  const processSteps = [
    {
      number: 1,
      title: "Foundation & Setup",
      content: "The challenge begins with a clean slate. This involves purchasing a new domain, setting up a fast, lightweight website, and installing essential tracking tools to create a solid technical foundation.",
      icon: Layers
    },
    {
      number: 2,
      title: "Content Creation & On-Page SEO",
      content: "This is the core of the strategy. I will be regularly publishing high-quality, relevant content, with each piece meticulously optimized with on-page SEO best practices (titles, metas, headers, etc.).",
      icon: PenTool
    },
    {
      number: 3,
      title: "Tracking & Analysis",
      content: "Data drives every decision. I'll constantly monitor keyword rankings, organic traffic, and user engagement metrics. This allows for agile adjustments to the strategy based on what the data reveals.",
      icon: BarChart3
    },
    {
      number: 4,
      title: "Public Updates & Transparency",
      content: "Every significant step, success, or failure will be documented in the Challenge Log. This commitment to transparency is key to the project's goal of being an educational resource and an honest portfolio piece.",
      icon: Megaphone
    }
  ];
  
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
             <div className="relative">
                {/* Vertical line: centered on desktop, on the left for mobile */}
                <div className="absolute top-0 left-8 md:left-1/2 w-0.5 h-full bg-gray-200 -translate-x-1/2" aria-hidden="true"></div>
                <div className="space-y-16">
                    {processSteps.map((step, index) => {
                        const isLeftDesktop = index % 2 === 0;
                        const [stepRef, isStepVisible] = useIntersectionObserver({ threshold: 0.3 });
                        return (
                            <div key={step.number} ref={stepRef} className={`relative animate-on-scroll ${isStepVisible ? 'is-visible' : ''}`}>
                                {/* The icon on the timeline */}
                                <div className="absolute top-8 left-8 md:left-1/2 -translate-x-1/2 z-10">
                                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-primary shadow-lg">
                                        <step.icon className="h-8 w-8 text-primary z-10" />
                                    </div>
                                </div>
                                {/* Content Card Wrapper */}
                                <div className={`pl-24 md:pl-0 md:w-1/2 ${isLeftDesktop ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}>
                                    <div className={`p-6 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 border-t-4 border-transparent hover:border-t-primary text-left ${isLeftDesktop ? 'md:text-right' : ''}`}>
                                        <h3 className="text-2xl font-bold text-dark">{step.title}</h3>
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