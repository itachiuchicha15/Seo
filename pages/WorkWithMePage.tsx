import React from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Search, Wrench, LineChart, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const WorkWithMePage: React.FC = () => {
  const [headerRef, isHeaderVisible] = useIntersectionObserver();
  const [processRef, isProcessVisible] = useIntersectionObserver();
  const [fitRef, isFitVisible] = useIntersectionObserver();
  const [ctaRef, isCtaVisible] = useIntersectionObserver();
  
  const processSteps = [
    {
      icon: Search,
      title: "1. Discovery & Audit",
      description: "We start by diving deep into your brand, your audience, and your competition. I conduct a thorough technical and content audit to establish a baseline and identify the highest-impact opportunities.",
      deliverables: ["Full Technical SEO Audit", "Competitor Analysis Report", "Initial Keyword Research", "Goal-Setting Workshop"]
    },
    {
      icon: Wrench,
      title: "2. Strategy & Execution",
      description: "Using the insights from our discovery phase, I build a custom, data-driven SEO roadmap. This is where we create and optimize content, fix technical issues, and build your site's authority.",
      deliverables: ["60-Day Content Calendar", "On-Page Optimization Plan", "Technical Fix Implementation", "Authority Building Initiatives"]
    },
    {
      icon: LineChart,
      title: "3. Reporting & Growth",
      description: "SEO is a long-term game. You'll receive clear, concise monthly reports tracking our progress against our goals. We'll have regular check-ins to analyze results and adapt our strategy for continuous growth.",
      deliverables: ["Monthly Performance Reports", "Keyword Rank Tracking", "Bi-Weekly Strategy Calls", "Quarterly Business Reviews"]
    }
  ]

  return (
    <div className="bg-light pb-24 fade-in">
      {/* Hero Section */}
      <section ref={headerRef} className={`bg-white py-24 sm:py-32 animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="animate-on-scroll is-visible" style={{ transitionDelay: '100ms' }}>
                    <h1 className="text-4xl font-extrabold text-dark sm:text-6xl">Let's Build Your Authority.</h1>
                    <p className="mt-6 text-xl text-muted max-w-xl">
                        This challenge proves a methodology. Now, let's apply that same data-driven, transparent process to elevate your brand above the noise.
                    </p>
                </div>
                <div className="flex justify-center lg:justify-end animate-on-scroll is-visible" style={{ transitionDelay: '300ms' }}>
                    <div className="text-center p-8 bg-light rounded-2xl border-2 border-primary/20 shadow-lg max-w-md">
                         <img
                            className="h-24 w-24 rounded-full mx-auto shadow-md ring-4 ring-white"
                            src="https://picsum.photos/seed/avatar/200/200"
                            alt="Alex Doe"
                        />
                        <p className="mt-6 text-2xl text-secondary font-medium leading-tight">
                            "If I can rank myself from scratch, imagine what I can do for your established brand."
                        </p>
                        <p className="mt-4 font-bold text-dark">- Alex Doe</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={processRef} className={`py-24 animate-on-scroll ${isProcessVisible ? 'is-visible' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">How It Works: A Proven Process</h2>
                <p className="mt-4 text-lg text-muted">A partnership built on clarity, strategy, and measurable results.</p>
            </div>

            <div className="relative">
                <div className="absolute left-1/2 -ml-px w-0.5 h-full bg-gray-200" aria-hidden="true"></div>
                <div className="space-y-16">
                    {processSteps.map((step, index) => {
                        const [stepRef, isStepVisible] = useIntersectionObserver({ threshold: 0.4 });
                        return (
                           <div key={step.title} ref={stepRef} className={`relative flex items-start animate-on-scroll ${isStepVisible ? 'is-visible' : ''}`}>
                                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-primary shadow-lg">
                                        <step.icon className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <div className={`w-[calc(50%-2rem)] transition-all duration-500 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left ml-auto'}`}>
                                    <div className={`p-8 bg-white rounded-2xl shadow-md border border-gray-200 animate-on-scroll ${isStepVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
                                        <h3 className="text-2xl font-bold text-dark">{step.title}</h3>
                                        <p className="mt-3 text-muted">{step.description}</p>
                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <h4 className="font-bold text-secondary text-sm uppercase tracking-wide">What's Included</h4>
                                            <ul className="mt-3 space-y-2">
                                                {step.deliverables.map((item, i) => (
                                                    <li key={item} className={`flex items-center gap-3 animate-on-scroll ${isStepVisible ? 'is-visible' : ''} ${index % 2 === 0 ? 'justify-end' : ''}`} style={{ transitionDelay: `${400 + i * 100}ms`}}>
                                                        {index % 2 === 0 && <span className="text-muted text-sm">{item}</span>}
                                                        <CheckCircle className="h-5 w-5 text-primary/80" />
                                                        {index % 2 !== 0 && <span className="text-muted text-sm">{item}</span>}
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
                <h2 className="text-3xl font-extrabold text-dark sm:text-4xl">Is This The Right Fit For You?</h2>
                <p className="mt-4 text-lg text-muted">My approach works best with partners who are ready for sustainable, long-term growth.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-8 bg-light rounded-2xl border-2 border-green-200 animate-on-scroll ${isFitVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <h3 className="text-2xl font-bold text-dark">You're a great fit if...</h3>
                    </div>
                    <ul className="mt-6 space-y-3 list-disc list-inside text-muted">
                        <li>You see SEO as a long-term investment, not a quick fix.</li>
                        <li>You have an established business and are ready to scale.</li>
                        <li>You value a transparent process and data-driven decisions.</li>
                        <li>You are ready to collaborate on content and strategy.</li>
                    </ul>
                </div>
                <div className={`p-8 bg-light rounded-2xl border-2 border-red-200 animate-on-scroll ${isFitVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '400ms' }}>
                    <div className="flex items-center gap-3">
                        <XCircle className="h-8 w-8 text-red-500" />
                        <h3 className="text-2xl font-bold text-dark">This might not be for you if...</h3>
                    </div>
                    <ul className="mt-6 space-y-3 list-disc list-inside text-muted">
                        <li>You need guaranteed first-page rankings in 30 days.</li>
                        <li>You're looking for the cheapest possible SEO provider.</li>
                        <li>Your business is brand new with no existing content or traffic.</li>
                        <li>You aren't able to invest time in collaboration.</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section ref={ctaRef} className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-on-scroll ${isCtaVisible ? 'is-visible' : ''}`}>
        <div className="bg-secondary text-white rounded-2xl p-12 text-center relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full"></div>
             <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-primary/20 rounded-full"></div>
             <div className="relative z-10">
                <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Build Your Authority?</h2>
                <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                    Let's discuss how my proven, transparent approach to SEO can help you achieve your business goals. The first step is a free, no-obligation discovery call.
                </p>
                <div className="mt-8">
                    <Link to="/contact" className="group inline-flex items-center justify-center bg-primary text-dark font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:brightness-95">
                        Book Your Free Discovery Call
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