import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const GradientBlob = ({ className }: { className?: string }) => (
  <div 
    // PERFORMANCE FIX: Added will-change to hint to the browser that these properties
    // will be animated, allowing it to optimize rendering by moving the element
    // to its own layer. This dramatically improves performance.
    className={`absolute rounded-full filter blur-[100px] opacity-40 dark:opacity-20 animate-soft-pulse will-change-[transform,opacity] transition-all duration-1000 ${className}`} 
  />
);

export function Landing() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-bg-base p-4">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <GradientBlob className="bg-terracotta/50 w-96 h-96 top-1/4 left-1/4" />
      <GradientBlob className="bg-sage/50 w-[500px] h-[500px] bottom-1/4 right-1/4 animation-delay-3000" />
      <GradientBlob className="bg-peach/60 w-80 h-80 top-10 right-1/3 animation-delay-5000" />

      <main 
        // PERFORMANCE FIX:
        // 1. Removed `backdrop-blur-md` - This is the main source of the lag.
        // 2. Changed `bg-bg-surface/60` to `bg-bg-surface/95` - This makes the card
        //    nearly opaque, ensuring text is always readable against the moving background
        //    without needing an expensive blur.
        // 3. Upgraded `shadow-xl` to `shadow-2xl` - This enhances the depth effect,
        //    compensating for the removal of the blur and making the card "pop".
        className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full bg-bg-surface/95 dark:bg-bg-surface/90 p-8 sm:p-12 rounded-3xl shadow-2xl border border-border-subtle animate-bubble-in"
      >
        <h1 className="text-5xl md:text-6xl font-medium text-text-primary leading-tight tracking-tight">
          A conversation with your future.
        </h1>
        <p className="mt-6 text-lg text-text-secondary">
          Kapsulle is a quiet place to capture who you are today. Through a simple conversation, create a time capsule that will reveal your own story of growth, change, and wisdom.
        </p>
        <Link to="/chat" className="mt-10">
          <button className="px-10 py-4 rounded-full font-bold text-cream dark:text-russet bg-accent-primary hover:bg-accent-light shadow-lg shadow-terracotta/30 dark:shadow-terracotta/20 focus:outline-none focus:ring-4 focus:ring-peach hover-lift">
            Begin Your Kapsulle
          </button>
        </Link>
      </main>
    </div>
  );
}