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
    <div className="min-h-screen bg-farm-grey text-farm-ink font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-miraa-dark text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="text-miraa-light" />
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

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Dashboard Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-miraa-dark">Jambo, Farmer</h1>
          <p className="text-farm-ink/60 text-sm">Welcome to your one-stop agricultural assistant.</p>
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
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-miraa-light/20">
                <div className="flex items-center gap-2 mb-4 text-miraa-dark">
                  <MessageSquare size={20} />
                  <h2 className="font-bold">Price Negotiator</h2>
                </div>
                <form onSubmit={handleSubmit} className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Miraa prices in Maua or Muguka in Nairobi..."
                    className="w-full min-h-[100px] p-4 rounded-xl bg-farm-grey border-none focus:ring-2 focus:ring-miraa-fresh/20 resize-none text-base"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={startVoiceInput}
                      className={cn(
                        "p-2 rounded-full transition-all",
                        isListening ? "bg-red-500 text-white animate-pulse" : "bg-white text-miraa-dark shadow-sm hover:bg-miraa-light/10"
                      )}
                    >
                      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="bg-miraa-fresh text-white p-2 rounded-full hover:bg-miraa-dark disabled:opacity-50 transition-all"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                    </button>
                  </div>
                </form>
              </section>

              {/* Results Section */}
              {advice && (
                <div className="space-y-4">
                  {typeof advice === 'string' ? (
                    <div className="bg-white p-6 rounded-2xl border border-miraa-light/20 shadow-sm italic">
                      {advice}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Main Insight */}
                      <div className="md:col-span-3 bg-miraa-dark text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
                        <div>
                          <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Market Insight</p>
                          <h3 className="text-2xl font-bold">Sell {advice.crop}</h3>
                        </div>
                        <button 
                          onClick={() => speakAdvice(`Suggested price for ${advice.crop} is ${advice.suggestedPrice}. Best day to sell: ${advice.bestDayToSell}.`)}
                          className="p-3 bg-white/10 rounded-full hover:bg-white/20 border border-white/10"
                        >
                          <Volume2 size={24} />
                        </button>
                      </div>

                      {/* Price Card */}
                      <div className="bg-white p-5 rounded-2xl border border-miraa-light/20 shadow-sm">
                        <div className="flex items-center gap-2 text-miraa-fresh mb-2">
                          <DollarSign size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Fair Price</span>
                        </div>
                        <p className="text-xl font-bold text-miraa-dark">{advice.suggestedPrice}</p>
                      </div>

                      {/* Best Day Card */}
                      <div className="bg-white p-5 rounded-2xl border border-miraa-light/20 shadow-sm">
                        <div className="flex items-center gap-2 text-miraa-fresh mb-2">
                          <Calendar size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Best Day</span>
                        </div>
                        <p className="text-xl font-bold text-miraa-dark">{advice.bestDayToSell}</p>
                      </div>

                      {/* Health Tip Card */}
                      <div className="bg-miraa-light/10 p-5 rounded-2xl border border-miraa-light/30 shadow-sm">
                        <div className="flex items-center gap-2 text-miraa-dark mb-2">
                          <HeartPulse size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Crop Health</span>
                        </div>
                        <p className="text-sm font-medium text-miraa-dark/80">{advice.healthTip}</p>
                      </div>

                      {/* Detailed Reasoning */}
                      <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-miraa-light/20 shadow-sm">
                        <div className="flex items-center gap-2 text-miraa-dark mb-3">
                          <TrendingUp size={18} />
                          <h4 className="font-bold">Regional Guidance</h4>
                        </div>
                        <p className="text-sm text-farm-ink/70 leading-relaxed mb-4">
                          {advice.reasoning}
                        </p>
                        <div className="pt-4 border-t border-farm-grey">
                          <p className="text-[10px] uppercase font-bold text-farm-ink/40 mb-2">Market Outlook</p>
                          <p className="text-xs text-farm-ink/60">{advice.marketTrends}</p>
                        </div>
                      </div>

                      {/* Sources */}
                      {advice.sources && advice.sources.length > 0 && (
                        <div className="md:col-span-3 flex flex-wrap gap-2 px-2">
                          {advice.sources.map((s: any, i: number) => (
                            <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-[10px] text-miraa-accent hover:underline flex items-center gap-1">
                              {s.title} <ExternalLink size={8} />
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
              className="space-y-4"
            >
              <div className="bg-white p-6 rounded-2xl border border-miraa-light/20 shadow-sm">
                <h2 className="text-xl font-bold text-miraa-dark mb-4 flex items-center gap-2">
                  <ShoppingBag /> Digital Marketplace
                </h2>
                <div className="space-y-3">
                  {[
                    { crop: 'Miraa (Grade A)', price: 'Ksh 1,200 - 1,500', trend: 'up', region: 'Maua' },
                    { crop: 'Miraa (Grade B)', price: 'Ksh 800 - 1,000', trend: 'stable', region: 'Meru' },
                    { crop: 'Muguka (Medium Bag)', price: 'Ksh 2,500 - 3,200', trend: 'up', region: 'Embu' },
                    { crop: 'Muguka (Small Bag)', price: 'Ksh 1,200 - 1,500', trend: 'down', region: 'Nairobi' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-farm-grey rounded-xl">
                      <div>
                        <p className="font-bold text-sm">{item.crop}</p>
                        <p className="text-[10px] text-farm-ink/50">{item.region}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-miraa-fresh">{item.price}</p>
                        <p className={cn("text-[10px] font-bold uppercase", item.trend === 'up' ? "text-green-600" : item.trend === 'down' ? "text-red-600" : "text-farm-ink/40")}>
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
              className="bg-white p-6 rounded-2xl border border-miraa-light/20 shadow-sm"
            >
              <h2 className="text-xl font-bold text-miraa-dark mb-4 flex items-center gap-2">
                <HeartPulse /> Crop Health Advisor
              </h2>
              <p className="text-sm text-farm-ink/60 mb-6 italic">
                Get instant advice on pests, diseases, and soil health.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 bg-miraa-light/10 rounded-xl border border-miraa-light/30 text-left hover:bg-miraa-light/20 transition-all group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-miraa-dark">Pest Identification</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-farm-ink/50">Describe symptoms or upload a photo to identify pests.</p>
                </button>
                <button className="p-4 bg-miraa-light/10 rounded-xl border border-miraa-light/30 text-left hover:bg-miraa-light/20 transition-all group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-miraa-dark">Soil Analysis</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-farm-ink/50">Get fertilizer recommendations based on your region.</p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Quick Info Bar */}
      <footer className="max-w-4xl mx-auto p-4 md:px-8 pb-12">
        <div className="bg-miraa-dark/5 p-4 rounded-xl flex items-start gap-3 border border-miraa-dark/10">
          <Info size={16} className="text-miraa-dark mt-0.5 shrink-0" />
          <p className="text-[10px] text-miraa-dark/60 leading-relaxed">
            JabaAi uses real-time market data to provide transparent pricing. Always confirm with your local cooperative or buyer before final sale.
          </p>
        </div>
      </footer>
    </div>
  );
}
