"use client";

import React from 'react';
import Link from 'next/link'; // Added for navigation
import { 
  Github, 
  Linkedin, 
  Mail, 
  Send, 
  Rocket, 
  Cpu, 
  Database, 
  Layout, 
  Server, 
  Target,
  ArrowLeft // Added for the back button
} from 'lucide-react';

const teamMembers = [
  {
    name: "Senghong Sokhon",
    role: "Full-Stack Developer",
    bio: "Final year student in Web and Mobile App Development. Specializing in Frontend architecture and advanced technical problem solving.",
    image: "/images/team/senghong.jpg",
    github: "https://github.com/CelixenZ",
    linkedin: "https://www.linkedin.com/in/senghong-sokhon-200565332",
    telegram: "https://t.me/hongstillyoung",
    email: "sokhonsenghong8@gmail.com",
    tech: ["Next.js 16", "TypeScript", "TailwindCSS"]
  },
  {
    name: "Chantha Makara",
    role: "Full-Stack Developer",
    bio: "Final year student in Web and Mobile App Development. Focused on building scalable Backend systems and efficient database modeling.",
    image: "/images/team/makara.jpg",
    github: "https://github.com/makara17092020/",
    linkedin: "https://www.linkedin.com/in/makara-chantha-30278738b/",
    telegram: "https://t.me/M_akaara",
    email: "chanthamakara.info@gmail.com",
    tech: ["Next.js API", "Prisma", "PostgreSQL"]
  }
];

export default function AboutUs() {
  return (
    <div className="bg-[#0A0F1D] min-h-screen text-slate-300 relative">
      
      {/* --- Back to Home Button --- */}
      <div className="absolute top-8 left-4 md:left-10 z-50">
        <Link 
          href="/" 
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-md hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
        >
          <ArrowLeft size={18} className="text-slate-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Back to Home</span>
        </Link>
      </div>

      {/* --- Dark Hero Section --- */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-indigo-950 text-indigo-300 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 uppercase tracking-wider">
            <Target size={18} className="text-indigo-400" />
            NEXTGENDEV • FINAL YEAR PROJECT
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tighter leading-tight">
            The Team Behind <br />
            <span className="text-indigo-400">AI Academy</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
            We are final year Web and Mobile App Development students, 
            dedicating our daily efforts to building a full-stack intelligent LMS 
            designed to redefine education through technology.
          </p>
        </div>
      </section>

      {/* --- Team Section --- */}
      <section className="py-10 px-4 max-w-7xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 gap-16">
          {teamMembers.map((member, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-4 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-[40px] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 z-0" />
              
              <div className="relative flex flex-col items-center text-center p-12 rounded-[40px] bg-[#131B31] border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 z-10 shadow-xl">
                {/* Photo Area */}
                <div className="w-64 h-64 shrink-0 relative mb-10">
                  <div className="absolute -inset-2 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700 blur-sm"></div>
                  
                  <div className="absolute inset-0 w-64 h-64 bg-[#1E293B] rounded-full overflow-hidden border-4 border-[#0F172A] shadow-2xl relative z-10">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.name}&background=6366f1&color=fff&size=256`;
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
                    {member.name}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {member.tech.map(t => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-400 mb-8 leading-relaxed italic text-lg px-4">
                    "{member.bio}"
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center gap-4">
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-2xl text-slate-300 hover:text-white hover:bg-indigo-600 transition-all border border-slate-700 shadow-lg">
                      <Github size={22} />
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-2xl text-slate-300 hover:text-white hover:bg-indigo-600 transition-all border border-slate-700 shadow-lg">
                      <Linkedin size={22} />
                    </a>
                    <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-2xl text-slate-300 hover:text-white hover:bg-sky-500 transition-all border border-slate-700 shadow-lg">
                      <Send size={22} />
                    </a>
                    <a href={`mailto:${member.email}`} className="p-3 bg-slate-800 rounded-2xl text-slate-300 hover:text-white hover:bg-sky-500 transition-all border border-slate-700 shadow-lg">
                      <Mail size={22} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Tech-Stack Project Card --- */}
      <section className="py-24 bg-[#0F172A] mx-4 md:mx-10 rounded-[50px] mb-24 p-12 text-center shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-green-500/20">
            <Rocket size={14} className="animate-pulse"/>
            NEXT.JS FULL-STACK
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-10 tracking-tight">Our Development Stack</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-8 bg-[#131B31] rounded-3xl border border-slate-800">
              <Layout className="text-indigo-400 mb-4" size={32} />
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">Frontend Engine</h4>
              <p className="text-slate-400 text-sm">Built with Next.js 16 and React 19, utilizing Turbopack for lightning-fast development.</p>
            </div>
            <div className="p-8 bg-[#131B31] rounded-3xl border border-slate-800">
              <Server className="text-purple-400 mb-4" size={32} />
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">Server & API</h4>
              <p className="text-slate-400 text-sm">Next.js API Routes coupled with Prisma ORM and PostgreSQL for type-safe data handling.</p>
            </div>
            <div className="p-8 bg-[#131B31] rounded-3xl border border-slate-800">
              <Cpu className="text-green-400 mb-4" size={32} />
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">AI Core</h4>
              <p className="text-slate-400 text-sm">Direct Google Gemini API integration to power intelligent study plans and automated grading.</p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="pb-20 text-center text-slate-600 text-xs font-bold uppercase tracking-[0.4em]">
        NextGenDev • Final Project 2026
      </div>
    </div>
  );
}