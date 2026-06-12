import React, { useState } from 'react';
import { useHue } from './HueEngine';
import { Copy, Check, Sparkles, Terminal, Code2, Layers, Cpu, Compass } from 'lucide-react';

interface Prompt {
  id: string;
  title: string;
  description: string;
  code: string;
  badge: string;
  icon: React.ComponentType<any>;
}

export const CopyPromptDepot: React.FC = () => {
  const { hue } = useHue();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const prompts: Prompt[] = [
    {
      id: 'prompt-a',
      title: 'Prompt A — Hue Engine System',
      badge: 'Logic & Time',
      icon: Cpu,
      description: 'The core synchronizer of the app: establishing an requestAnimationFrame loop running delta timing to smoothly increment HSL coordinates, pausing automatically when the browser tab becomes hidden using the Document Visibility API, and respecting systems prefers-reduced-motion triggers.',
      code: `// CORE ENGINE SPECIFICATION (PROMPT A)
// Create a global or state-provider animation system driving the CSS custom property --live-hue:
- Utilize requestAnimationFrame for an incremental loop.
- Implement delta timing to ensure uniform speed on high refresh rate displays.
- Listen and capture preferences from window.matchMedia('(prefers-reduced-motion: reduce)') to freeze updates on systems.
- Bind the Page Visibility API ('visibilitychange') to automatically release requestAnimationFrame cycles when inactive.
- Inject update values directly on document.documentElement.style.setProperty('--live-hue', String(hue)).`
    },
    {
      id: 'prompt-b',
      title: 'Prompt B — Canvas Aurora Atmosphere',
      badge: 'Visual Backdrop',
      icon: Layers,
      description: 'Five organic, soft, overlapping radial gradient nodes vectoring along independent orbits using offset sine and cosine coordinate math. It sets composite filters to lighter or screen modes to combine and blend overlaps beautifully, softened with dynamic scale boundaries.',
      code: `// CANVASES BACKGROUND AMBIENCE (PROMPT B)
- Render an HTML5 scale canvas behind workspace structures.
- Coordinate 5 separate organic radial gradients drifting asynchronously on trigonometric pathways:
  * x = centerX + Math.sin(time * speedX + phaseX) * offsetFactor;
  * y = centerY + Math.cos(time * speedY + phaseY) * offsetFactor;
- Compositing blend mode set toctx.globalCompositeOperation = 'lighter' or 'screen'.
- Integrate a high performance ResizeObserver to redraw and bind canvas size without visual jarring.`
    },
    {
      id: 'prompt-c',
      title: 'Prompt C — Organic Morphing SVG Blobs',
      badge: 'Shapes & Vectors',
      icon: Compass,
      description: 'An organic, fluid-like vector mesh situated in the Hero workspace. It transitions smoothly between four distinct hand-crafted SVG closed-bezier path strings on an-automated timeframe cycle or user hover states, styled using standard transition matrices.',
      code: `// SVG CLOSED-BEZIER SHAPES MORPH (PROMPT C)
- Implement an SVG morphing shape inside the viewport container.
- Configure four distinct custom closed liquid curves:
  * Path 1 (tall egg), Path 2 (flat pool), Path 3 (indented heart), Path 4 (even starburst).
- Animate and transition the 'd' element smoothly using cubic-bezier matrices or Framer Motion.
- Connect linear gradients linked directly to the live hue: stopColor={\`hsl(\${hue}, 85%, 65%)\`}.`
    },
    {
      id: 'prompt-d',
      title: 'Prompt D — Tint Blending & Parallax Decorators',
      badge: 'Graphics Filters',
      icon: Code2,
      description: 'A dynamic image layout decorator that applies a mix-blend-mode filter over graphics, tinting them to match whichever color is dominant in the current Hue Engine state. It provides blurred image load states alongside scroll-triggered parallax offsets.',
      code: `// TINTING MIX LAYERS & MOVEMENT (PROMPT D)
- Setup full responsive image covers inside article headers.
- Mount an overlaying visual glass layer directly over photographs:
  * Mix-blend-mode: color; opacity: 0.8;
  * Background Color: hsl(var(--live-hue), 85%, 50%);
- This seamlessly tints any photographic asset to match the active color of the site's atmosphere.
- Bind blurred load callbacks to transition image sharp states.`
    },
    {
      id: 'prompt-e',
      title: 'Prompt E — Floating Dust Particles',
      badge: 'Micro Particles',
      icon: Terminal,
      description: 'Up to 60 micro-pixels floating steadily upwards. They wrap around visual borders and feature gentle individual sine opacity pulsing frequencies. Each particle is configured with a slight hue offset, making dense clusters shimmer like a color cloud.',
      code: `// PARTICULATE EMITTER CLOUD (PROMPT E)
- Render micro starry spec points on a transparent overlay canvas.
- Coordinate coordinates to drift steadily upwards (speedY < 0).
- Add slight custom color offsets to the master hue:
  * Particle Hue = (Master Hue + Local Offset) % 360;
  * This guarantees clusters shimmer with rich spectrums of adjacent colors (e.g. teals, greens, indigos).
- Recycle particles as they cross boundaries; wrap borders smoothly.`
    },
    {
      id: 'prompt-f',
      title: 'Prompt F — Chromatic Text & Progression Gradients',
      badge: 'Typography Shimmer',
      icon: Sparkles,
      description: 'Text headlines styled with CSS clipping layers and dynamic gradients that update seamlessly as the hue ticks. It coordinates reading-progress tracks isochronously, and gives category filters static offsets to keep them distinct while cycling.',
      code: `// CHROMATIC GRADIENTS AND TRACKS (PROMPT F)
- Style display headings utilizing text clippings and dynamic directions:
  * background-image: linear-gradient(135deg, hsl(var(--live-hue), 85%, 65%), hsl(calc(var(--live-hue) + 60), 75%, 55%));
- Bind article progression trackers and scroll bars to matches the dominant live hue.
- Category filters get incrementing static offsets (e.g., Hue + Index * 40), so tabs look elegantly distinct but cycle together as one coordinated ecosystem.`
    }
  ];

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6" id="prompt-depot-grid">
      
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white">Prompts Depot &amp; Engineering Center</h2>
        <p className="text-xs text-slate-400">Copy ready-made prompts directly to feed your favorite AI coding assistant (like Claude, Gemini, or cursor agents).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompts.map((p) => {
          const Icon = p.icon;
          const isCopied = copiedId === p.id;
          
          return (
            <div 
              key={p.id} 
              className="bg-slate-950 border border-slate-880 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-black uppercase text-slate-400">
                    {p.badge}
                  </span>
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>

                <h3 className="text-sm font-extrabold text-white">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
              </div>

              {/* Code Previews structure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold font-mono">
                  <span>SPEC SHEET</span>
                  <button
                    onClick={() => handleCopyCode(p.code, p.id)}
                    className={`px-2.5 py-1 rounded bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all text-[9px] cursor-pointer`}
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-450" /> : <Copy className="w-3 h-3" />}
                    {isCopied ? 'Copied Prompt' : 'Copy Spec Prompt'}
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-850 rounded p-3 overflow-x-auto">
                  <pre className="text-[10px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {p.code}
                  </pre>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
