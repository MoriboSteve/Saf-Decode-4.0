/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Volume2, 
  ArrowRight,
  Loader2,
  ExternalLink,
  LayoutDashboard,
  ShoppingBag,
  HeartPulse,
  Info,
  ChevronRight
} from 'lucide-react';
import { getMarketAdvice, speakAdvice, type MarketAdvice } from './services/geminiService';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'negotiator' | 'marketplace' | 'health';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('negotiator');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setAdvice(null);
    
    const result = await getMarketAdvice(input);
    setAdvice(result);
    setLoading(false);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <div className="min-h-screen text-farm-ink font-sans relative">
      {/* Live Background */}
      <div className="live-bg">
        <div className="live-bg-image" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="bg-miraa-dark/90 backdrop-blur-md text-white p-4 sticky top-0 z-50 shadow-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-miraa-light rounded-lg">
              <Sprout className="text-miraa-dark" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">JabaAi</span>
          </div>
          <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider">
            <button 
              onClick={() => setActiveTab('negotiator')}
              className={cn("pb-1 border-b-2 transition-all", activeTab === 'negotiator' ? "border-miraa-light text-white" : "border-transparent text-white/60")}
            >
              Negotiator
            </button>
            <button 
              onClick={() => setActiveTab('marketplace')}
              className={cn("pb-1 border-b-2 transition-all", activeTab === 'marketplace' ? "border-miraa-light text-white" : "border-transparent text-white/60")}
            >
              Market
            </button>
            <button 
              onClick={() => setActiveTab('health')}
              className={cn("pb-1 border-b-2 transition-all", activeTab === 'health' ? "border-miraa-light text-white" : "border-transparent text-white/60")}
            >
              Health
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
        {/* Dashboard Header */}
        <header className="space-y-2 py-4">
          <h1 className="text-4xl font-bold text-miraa-dark drop-shadow-sm">Jambo, Farmer</h1>
          <p className="text-miraa-dark/70 font-medium text-sm">Welcome to your one-stop Miraa & Muguka assistant.</p>
        </header>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'negotiator' && (
            <motion.div
              key="negotiator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Input Section */}
              <section className="glass-card rounded-[32px] p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-6 text-miraa-dark">
                  <div className="p-2 bg-miraa-dark text-white rounded-xl">
                    <MessageSquare size={20} />
                  </div>
                  <h2 className="font-bold text-xl">Price Negotiator</h2>
                </div>
                <form onSubmit={handleSubmit} className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Miraa prices in Maua or Muguka in Nairobi..."
                    className="w-full min-h-[140px] p-6 rounded-2xl bg-white/50 border border-miraa-dark/10 focus:ring-4 focus:ring-miraa-fresh/20 resize-none text-lg placeholder:text-miraa-dark/30 transition-all"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-3">
                    <button
                      type="button"
                      onClick={startVoiceInput}
                      className={cn(
                        "p-3 rounded-full transition-all shadow-lg",
                        isListening ? "bg-red-500 text-white animate-pulse" : "bg-white text-miraa-dark hover:bg-miraa-light/20"
                      )}
                    >
                      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="bg-miraa-dark text-white p-3 rounded-full hover:bg-miraa-fresh disabled:opacity-50 transition-all shadow-lg"
                    >
                      {loading ? <Loader2 size={24} className="animate-spin" /> : <ArrowRight size={24} />}
                    </button>
                  </div>
                </form>
              </section>

              {/* Results Section */}
              {advice && (
                <div className="space-y-6">
                  {typeof advice === 'string' ? (
                    <div className="glass-card p-8 rounded-[32px] italic text-lg text-miraa-dark/80">
                      {advice}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Main Insight */}
                      <div className="md:col-span-3 bg-miraa-dark text-white p-8 rounded-[32px] shadow-2xl flex justify-between items-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                          <Sprout size={120} />
                        </div>
                        <div className="relative z-10">
                          <p className="text-xs uppercase tracking-[0.2em] font-bold text-miraa-light mb-2">Market Insight</p>
                          <h3 className="text-4xl font-bold">Sell {advice.crop}</h3>
                        </div>
                        <button 
                          onClick={() => speakAdvice(`Suggested price for ${advice.crop} is ${advice.suggestedPrice}. Best day to sell: ${advice.bestDayToSell}.`)}
                          className="relative z-10 p-4 bg-white/10 rounded-full hover:bg-white/20 border border-white/20 transition-all shadow-lg"
                        >
                          <Volume2 size={32} />
                        </button>
                      </div>

                      {/* Price Card */}
                      <div className="glass-card p-6 rounded-[32px] flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-miraa-fresh mb-3">
                          <DollarSign size={20} />
                          <span className="text-xs font-bold uppercase tracking-widest">Fair Price</span>
                        </div>
                        <p className="text-3xl font-bold text-miraa-dark">{advice.suggestedPrice}</p>
                      </div>

                      {/* Best Day Card */}
                      <div className="glass-card p-6 rounded-[32px] flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-miraa-fresh mb-3">
                          <Calendar size={20} />
                          <span className="text-xs font-bold uppercase tracking-widest">Best Day</span>
                        </div>
                        <p className="text-3xl font-bold text-miraa-dark">{advice.bestDayToSell}</p>
                      </div>

                      {/* Health Tip Card */}
                      <div className="bg-miraa-fresh text-white p-6 rounded-[32px] shadow-lg">
                        <div className="flex items-center gap-2 text-miraa-light mb-3">
                          <HeartPulse size={20} />
                          <span className="text-xs font-bold uppercase tracking-widest">Freshness Tip</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{advice.healthTip}</p>
                      </div>

                      {/* Detailed Reasoning */}
                      <div className="md:col-span-3 glass-card p-8 rounded-[32px]">
                        <div className="flex items-center gap-2 text-miraa-dark mb-4">
                          <TrendingUp size={24} />
                          <h4 className="font-bold text-xl">Regional Guidance</h4>
                        </div>
                        <p className="text-lg text-miraa-dark/80 leading-relaxed mb-6">
                          {advice.reasoning}
                        </p>
                        <div className="pt-6 border-t border-miraa-dark/10">
                          <p className="text-xs uppercase font-bold text-miraa-dark/40 mb-3 tracking-widest">Market Outlook</p>
                          <p className="text-sm text-miraa-dark/60 italic leading-relaxed">{advice.marketTrends}</p>
                        </div>
                      </div>

                      {/* Sources */}
                      {advice.sources && advice.sources.length > 0 && (
                        <div className="md:col-span-3 flex flex-wrap gap-3 px-4">
                          {advice.sources.map((s: any, i: number) => (
                            <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-xs text-miraa-accent hover:text-miraa-dark flex items-center gap-1 transition-colors">
                              {s.title} <ExternalLink size={10} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="glass-card p-8 rounded-[32px]">
                <h2 className="text-2xl font-bold text-miraa-dark mb-6 flex items-center gap-3">
                  <div className="p-2 bg-miraa-dark text-white rounded-xl">
                    <ShoppingBag size={24} />
                  </div>
                  Digital Marketplace
                </h2>
                <div className="space-y-4">
                  {[
                    { crop: 'Miraa (Grade A)', price: 'Ksh 1,200 - 1,500', trend: 'up', region: 'Maua' },
                    { crop: 'Miraa (Grade B)', price: 'Ksh 800 - 1,000', trend: 'stable', region: 'Meru' },
                    { crop: 'Muguka (Medium Bag)', price: 'Ksh 2,500 - 3,200', trend: 'up', region: 'Embu' },
                    { crop: 'Muguka (Small Bag)', price: 'Ksh 1,200 - 1,500', trend: 'down', region: 'Nairobi' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-white/40 rounded-2xl border border-miraa-dark/5 hover:bg-white/60 transition-all cursor-default">
                      <div>
                        <p className="font-bold text-lg text-miraa-dark">{item.crop}</p>
                        <p className="text-xs text-miraa-dark/40 font-medium">{item.region}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-miraa-fresh">{item.price}</p>
                        <p className={cn("text-[10px] font-bold uppercase tracking-widest", item.trend === 'up' ? "text-green-600" : item.trend === 'down' ? "text-red-600" : "text-miraa-dark/30")}>
                          {item.trend}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8 rounded-[32px]"
            >
              <h2 className="text-2xl font-bold text-miraa-dark mb-6 flex items-center gap-3">
                <div className="p-2 bg-miraa-dark text-white rounded-xl">
                  <HeartPulse size={24} />
                </div>
                Crop Health Advisor
              </h2>
              <p className="text-miraa-dark/60 mb-8 italic text-lg">
                Get instant advice on pests, diseases, and soil health for your khat crop.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="p-6 bg-white/40 rounded-2xl border border-miraa-dark/5 text-left hover:bg-miraa-light/20 transition-all group shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-xl text-miraa-dark">Pest Identification</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform text-miraa-dark" />
                  </div>
                  <p className="text-sm text-miraa-dark/50 leading-relaxed">Describe symptoms or upload a photo to identify pests affecting your Miraa or Muguka.</p>
                </button>
                <button className="p-6 bg-white/40 rounded-2xl border border-miraa-dark/5 text-left hover:bg-miraa-light/20 transition-all group shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-xl text-miraa-dark">Soil Analysis</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform text-miraa-dark" />
                  </div>
                  <p className="text-sm text-miraa-dark/50 leading-relaxed">Get fertilizer recommendations based on the specific soil conditions in Meru and Embu.</p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Quick Info Bar */}
      <footer className="max-w-4xl mx-auto p-4 md:px-8 pb-16 relative z-10">
        <div className="bg-miraa-dark text-white p-6 rounded-[32px] flex items-start gap-4 shadow-2xl border border-white/10">
          <Info size={24} className="text-miraa-light mt-0.5 shrink-0" />
          <p className="text-xs text-white/70 leading-relaxed">
            JabaAi uses real-time market data to provide transparent pricing for the khat community. Always confirm with your local cooperative or buyer before final sale.
          </p>
        </div>
      </footer>
    </div>
  );
}
