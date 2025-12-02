import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { Exercise } from './ExerciseBuilder';

interface WorkoutTimerSessionProps {
  workoutName: string;
  exercises: Exercise[];
  onComplete: (exercisesCompleted: number, totalExercises: number, durationMinutes: number) => void;
}

type Phase = 'prep' | 'work' | 'rest' | 'completed';

export const WorkoutTimerSession = ({ workoutName, exercises, onComplete }: WorkoutTimerSessionProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('prep');
  const [timeRemaining, setTimeRemaining] = useState(5); // 5 sec prep
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<boolean[]>(
    new Array(exercises.length).fill(false)
  );
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [soundEnabled]);

  const playBeep = (frequency: number, duration: number = 0.2) => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          if (newTime === 3 || newTime === 2 || newTime === 1) {
            playBeep(800, 0.1);
          }
          
          if (newTime === 0) {
            playBeep(1200, 0.3);
          }
          
          return newTime;
        });
      }, 1000);
    }

    if (timeRemaining === 0 && isRunning) {
      handlePhaseChange();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, phase, currentExerciseIndex]);

  const handlePhaseChange = () => {
    if (phase === 'prep') {
      setPhase('work');
      setTimeRemaining(exercises[0].duration);
      setSessionStartTime(Date.now());
      speak(`Starting ${exercises[0].name}`);
      toast.info(`Exercise 1/${exercises.length}`, { description: exercises[0].name });
    } else if (phase === 'work') {
      const newCompleted = [...completedExercises];
      newCompleted[currentExerciseIndex] = true;
      setCompletedExercises(newCompleted);
      
      if (currentExerciseIndex < exercises.length - 1) {
        const currentExercise = exercises[currentExerciseIndex];
        if (currentExercise.restAfter > 0) {
          setPhase('rest');
          setTimeRemaining(currentExercise.restAfter);
          speak('Rest');
          toast.success('Rest Time');
        } else {
          moveToNextExercise();
        }
      } else {
        // All exercises completed
        const durationMinutes = sessionStartTime 
          ? Math.round((Date.now() - sessionStartTime) / 60000) 
          : 0;
        setPhase('completed');
        setIsRunning(false);
        onComplete(newCompleted.filter(Boolean).length, exercises.length, durationMinutes);
        speak('Workout complete! Amazing work!');
        toast.success('Workout Complete! 🎉', { description: 'Great job!' });
      }
    } else if (phase === 'rest') {
      moveToNextExercise();
    }
  };

  const moveToNextExercise = () => {
    const nextIndex = currentExerciseIndex + 1;
    setCurrentExerciseIndex(nextIndex);
    setPhase('work');
    setTimeRemaining(exercises[nextIndex].duration);
    speak(`${exercises[nextIndex].name}`);
    toast.info(`Exercise ${nextIndex + 1}/${exercises.length}`, { description: exercises[nextIndex].name });
  };

  const handleStart = () => {
    if (phase === 'completed') {
      handleReset();
    }
    playBeep(1000, 0.3);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentExerciseIndex(0);
    setPhase('prep');
    setTimeRemaining(5);
    setCompletedExercises(new Array(exercises.length).fill(false));
    setSessionStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'prep': return 'text-blue-500';
      case 'work': return 'text-green-500';
      case 'rest': return 'text-amber-500';
      case 'completed': return 'text-purple-500';
    }
  };

  const currentExercise = exercises[currentExerciseIndex];
  const completedCount = completedExercises.filter(Boolean).length;
  const progress = (completedCount / exercises.length) * 100;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">{workoutName}</h3>
          <Badge variant="secondary">
            {completedCount}/{exercises.length} exercises completed
          </Badge>
        </div>

        <div className="text-center space-y-4">
          <div className={`text-6xl md:text-8xl font-bold tabular-nums ${getPhaseColor()}`}>
            {formatTime(timeRemaining)}
          </div>

          <div>
            {phase === 'prep' && <Badge variant="outline" className="text-lg px-4 py-2">Get Ready</Badge>}
            {phase === 'work' && currentExercise && (
              <div className="space-y-2">
                <Badge className="text-lg px-4 py-2">
                  {currentExerciseIndex + 1}/{exercises.length}
                </Badge>
                <div className="text-xl font-semibold">{currentExercise.name}</div>
              </div>
            )}
            {phase === 'rest' && <Badge variant="outline" className="text-lg px-4 py-2">Rest</Badge>}
            {phase === 'completed' && <Badge variant="outline" className="text-lg px-4 py-2 bg-green-500/10">Complete!</Badge>}
          </div>

          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
          {exercises.map((ex, idx) => (
            <div
              key={ex.id}
              className={`flex items-center gap-2 p-2 rounded-md border text-sm ${
                idx === currentExerciseIndex && phase === 'work'
                  ? 'bg-primary/10 border-primary'
                  : completedExercises[idx]
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-muted'
              }`}
            >
              {completedExercises[idx] ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className="truncate">{ex.name}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <Button size="lg" onClick={handleStart} className="px-8">
              <Play className="w-5 h-5 mr-2" />
              {phase === 'completed' ? 'Restart' : 'Start'}
            </Button>
          ) : (
            <Button size="lg" variant="outline" onClick={handlePause} className="px-8">
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={handleReset}>
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};
