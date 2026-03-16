import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Radar, Square, Loader2 } from 'lucide-react';

interface ScanButtonProps {
  isScanning: boolean;
  scanPhase: 'idle' | 'detecting' | 'classifying' | 'saving';
  onStart: () => void;
  onStop: () => void;
}

const phaseLabels: Record<string, string> = {
  idle: 'Run Scan',
  detecting: 'Detecting — Agents scanning...',
  classifying: 'Classifying — AI analyzing...',
  saving: 'Saving — Writing to Risk Register...',
};

export function ScanButton({ isScanning, scanPhase, onStart, onStop }: ScanButtonProps) {
  if (isScanning) {
    return (
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Radar className="h-5 w-5 text-red-400" />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-red-400">{phaseLabels[scanPhase]}</span>
          <PhaseProgress phase={scanPhase} />
        </div>
        <Button variant="outline" size="sm" onClick={onStop} className="ml-2">
          <Square className="h-3 w-3 mr-1" />
          Stop
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={onStart}
      className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40"
      size="lg"
    >
      <Radar className="h-5 w-5" />
      Run Regulatory Scan
    </Button>
  );
}

function PhaseProgress({ phase }: { phase: string }) {
  const steps = ['detecting', 'classifying', 'saving'];
  const currentIndex = steps.indexOf(phase);

  return (
    <div className="flex items-center gap-1 mt-1">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index < currentIndex
                ? 'w-6 bg-green-500'
                : index === currentIndex
                ? 'w-6 bg-red-400 animate-pulse'
                : 'w-6 bg-muted'
            }`}
          />
        </div>
      ))}
    </div>
  );
}
