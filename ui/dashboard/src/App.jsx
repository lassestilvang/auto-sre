import React, { useEffect, useMemo, useReducer } from 'react';
import { 
  Zap, 
  Shield, 
  Activity, 
  Terminal, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  BarChart3
} from 'lucide-react';
import { LazyMotion, MotionConfig, domAnimation, m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from './lib/utils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon size={20} className="text-white" />
      </div>
      <span className="text-slate-500 text-sm font-medium">{title}</span>
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
  </div>
);

const formatEventTime = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleTimeString();
};

const TimelineEvent = ({ event }) => {
  const reduceMotion = useReducedMotion();
  return (
    <m.div 
      initial={reduceMotion ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 mb-6 relative"
    >
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-3 h-3 rounded-full z-10",
        event.type === 'chaos' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
        event.type === 'alert' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
        event.type === 'mitigation' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
        'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
      )} />
      <div className="w-px h-full bg-slate-800 absolute top-3" />
    </div>
    <div className="pb-2">
      <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">
        {formatEventTime(event.time)}
      </div>
      <div className="text-white font-medium">{event.message}</div>
      <div className="text-slate-500 text-sm">{event.description}</div>
    </div>
    </m.div>
  );
};

const initialState = {
  resilienceScore: 100,
  status: 'Healthy',
  events: [
    { id: 'init', time: new Date().toISOString(), type: 'system', message: 'System Initialized', description: 'AutoSRE monitoring active and watching Azure Container Apps.' }
  ],
  isChaosRunning: false,
  apiOnline: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'merge': {
      const next = { ...state };
      Object.entries(action.payload || {}).forEach(([key, value]) => {
        if (value !== undefined) next[key] = value;
      });
      return next;
    }
    default:
      return state;
  }
}

function App() {
  const reduceMotionPref = useReducedMotion();
  const mediaReduceMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  const reduceMotion = reduceMotionPref || mediaReduceMotion;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { resilienceScore, status, events, isChaosRunning, apiOnline } = state;
  const barKeys = useMemo(() => Array.from({ length: 20 }, (_, i) => `bar-${i}`), []);

  const refreshFromApi = async () => {
    try {
      const [stateRes, eventsRes] = await Promise.all([
        fetch(`${API_BASE}/state`),
        fetch(`${API_BASE}/events?limit=50`)
      ]);
      if (!stateRes.ok || !eventsRes.ok) {
        throw new Error('API error');
      }
      const state = await stateRes.json();
      const data = await eventsRes.json();
      dispatch({
        type: 'merge',
        payload: {
          resilienceScore: state.resilienceScore ?? 100,
          status: state.status ?? 'Healthy',
          isChaosRunning: Boolean(state.chaosRunning),
          events: Array.isArray(data.events) && data.events.length > 0 ? data.events : undefined,
          apiOnline: true,
        },
      });
    } catch (error) {
      dispatch({ type: 'merge', payload: { apiOnline: false } });
    }
  };

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      if (!mounted) return;
      await refreshFromApi();
    };
    poll();
    const interval = setInterval(poll, 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const triggerChaos = async () => {
    try {
      dispatch({ type: 'merge', payload: { isChaosRunning: true } });
      const response = await fetch(`${API_BASE}/cpu-spike?duration=60`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to trigger chaos');
      }
    } catch (error) {
      dispatch({ type: 'merge', payload: { isChaosRunning: false } });
    }
  };

  return (
    <LazyMotion features={domAnimation}>
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Zap className="text-white" size={24} fill="currentColor" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">AutoSRE</h1>
            </div>
            <p className="text-slate-500 font-medium">Agentic DevOps Control Plane</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={cn(
              "px-4 py-2 rounded-full border flex items-center gap-2 font-semibold transition-all duration-500",
              !apiOnline
                ? "bg-slate-800/40 border-slate-700 text-slate-400"
                : status === 'Healthy' 
                  ? "bg-green-500/10 border-green-500/20 text-green-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
            )}>
              <Activity size={16} />
              {!apiOnline ? 'Offline' : status}
            </div>
            <button 
              onClick={triggerChaos}
              disabled={isChaosRunning || !apiOnline}
              className={cn(
                "px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2",
                (isChaosRunning || !apiOnline)
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                  : "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20 active:scale-95"
              )}
            >
              <RotateCcw size={18} className={isChaosRunning && !reduceMotion ? "animate-spin" : ""} />
              Trigger Chaos
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats */}
          <div className="space-y-6">
            <StatCard 
              title="Resilience Score" 
              value={`${resilienceScore}/100`} 
              icon={Shield} 
              color="bg-blue-600" 
            />
            <StatCard 
              title="Active Incidents" 
              value={!apiOnline || status === 'Healthy' ? "0" : "1"} 
              icon={AlertTriangle} 
              color={!apiOnline || status === 'Healthy' ? "bg-slate-700" : "bg-red-600"} 
            />
            <StatCard 
              title="Avg. Recovery Time" 
              value="42s" 
              icon={Clock} 
              color="bg-purple-600" 
            />
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-400" />
                Service Health
              </h3>
              <div className="h-40 flex items-end gap-1 px-2">
                {barKeys.map((key, i) => (
                  <div 
                    key={key} 
                    className={cn(
                      "flex-1 rounded-t-sm transition-all duration-500",
                      status === 'Healthy' ? "bg-blue-500/40" : "bg-red-500/40",
                      i > 15 && status !== 'Healthy' ? "h-full" : "h-[30%]"
                    )}
                    style={{ height: `${status === 'Healthy' ? 30 + Math.random() * 20 : 60 + Math.random() * 40}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Timeline & Engine Logs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Terminal size={18} className="text-green-400" />
                  Incident Timeline
                </h3>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Live Feed</span>
              </div>
              <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                  {events.map((event) => (
                    <TimelineEvent key={event.id ?? `${event.time}-${event.message}`} event={event} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-2xl">
              <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                <Shield size={14} />
                SRE Agent Knowledge Integration
              </h4>
              <p className="text-slate-400 text-sm italic leading-relaxed">
                "Azure SRE Agent is currently monitoring 'demo-service' on Azure Container Apps. 
                Root cause analysis is enabled via Log Analytics integration."
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
    </MotionConfig>
    </LazyMotion>
  );
}

export default App;
