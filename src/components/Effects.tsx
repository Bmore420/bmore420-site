import { useEffect, useState } from 'react';

export default function Effects() {
  const [leaves, setLeaves] = useState<{ id: number; left: string; animDelay: string; dur: string }[]>([]);
  const [particles, setParticles] = useState<{ id: number; left: string; animDelay: string; dur: string; size: string }[]>([]);

  useEffect(() => {
    // Generate static effects data once on mount
    const newLeaves = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animDelay: `${Math.random() * 5}s`,
      dur: `${15 + Math.random() * 15}s`
    }));

    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animDelay: `${Math.random() * 10}s`,
      dur: `${15 + Math.random() * 20}s`,
      size: `${2 + Math.random() * 4}px`
    }));

    setLeaves(newLeaves);
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-black overflow-hidden">
      {/* Dark subtle glow behind fire */}
      <div 
        className="absolute inset-0 -z-10 opacity-0 animate-[fadeToGlow_4s_ease_forwards]"
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(60,30,0,0.15), #000 90%)' }}
      />
      {/* Subtle lens flare */}
      <div 
        className="absolute top-1/4 left-[35%] w-[120px] h-[120px] blur-[40px] animate-[flareMove_15s_ease-in-out_infinite_alternate]"
        style={{ background: 'radial-gradient(circle, rgba(255,140,50,0.2) 0%, transparent 70%)' }}
      />
      {/* Floating fire emojis / leaves */}
      {leaves.map(leaf => (
        <div
          key={`leaf-${leaf.id}`}
          className="absolute text-4xl opacity-0 animate-[leafRise_linear_infinite] text-center"
          style={{
            left: leaf.left,
            animationDelay: leaf.animDelay,
            animationDuration: leaf.dur,
          }}
        >
          🔥
        </div>
      ))}
      {/* Smoke particles */}
      {particles.map(p => (
        <div
          key={`part-${p.id}`}
          className="absolute bg-[#78ffa026] rounded-full opacity-0 animate-[particleRise_linear_infinite]"
          style={{
            left: p.left,
            animationDelay: p.animDelay,
            animationDuration: p.dur,
            width: p.size,
            height: p.size
          }}
        />
      ))}
    </div>
  );
}
