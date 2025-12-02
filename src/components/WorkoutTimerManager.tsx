import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExerciseBuilder, Exercise } from './ExerciseBuilder';
import { WorkoutTimerSession } from './WorkoutTimerSession';
import { useWorkoutTimers } from '@/hooks/useWorkoutTimers';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Play, Trash2, Edit, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const workoutSchema = z.object({
  name: z.string().trim().min(1, 'Workout name required').max(100),
});

export const WorkoutTimerManager = () => {
  const { user } = useAuth();
  const { timers, sessions, loading, saveTimer, updateTimer, deleteTimer, saveSession, getTodaySessions } = useWorkoutTimers();
  
  const [isCreating, setIsCreating] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeSession, setActiveSession] = useState<{ name: string; exercises: Exercise[] } | null>(null);

  const todaySessions = getTodaySessions();
  const totalExercisesToday = todaySessions.reduce((sum, s) => sum + s.exercises_completed, 0);

  const handleCreateWorkout = async () => {
    try {
      workoutSchema.parse({ name: workoutName });
      
      if (exercises.length === 0) {
        toast.error('Add at least one exercise');
        return;
      }

      const exercisesData = exercises.map((ex, idx) => ({
        name: ex.name,
        order_index: idx,
        duration: ex.duration,
        rest_after: ex.restAfter,
      }));

      await saveTimer(workoutName, {}, exercisesData);
      setWorkoutName('');
      setExercises([]);
      setIsCreating(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  };

  const handleStartSession = (timerName: string, timerExercises: Exercise[]) => {
    setActiveSession({ name: timerName, exercises: timerExercises });
  };

  const handleSessionComplete = async (exercisesCompleted: number, totalExercises: number, durationMinutes: number) => {
    if (!activeSession) return;
    
    await saveSession(
      null, // We'll link timer ID properly later
      activeSession.name,
      exercisesCompleted,
      totalExercises,
      durationMinutes
    );
    
    toast.success('Session saved!', { 
      description: `${exercisesCompleted}/${totalExercises} exercises completed` 
    });
    setActiveSession(null);
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Please log in to use workout timers</p>
      </Card>
    );
  }

  if (activeSession) {
    return (
      <div>
        <Button 
          variant="outline" 
          onClick={() => setActiveSession(null)}
          className="mb-4"
        >
          ← Back to Timers
        </Button>
        <WorkoutTimerSession
          workoutName={activeSession.name}
          exercises={activeSession.exercises}
          onComplete={handleSessionComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{todaySessions.length}</div>
              <div className="text-sm text-muted-foreground">Sessions Today</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalExercisesToday}</div>
              <div className="text-sm text-muted-foreground">Exercises Completed</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Play className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{timers.length}</div>
              <div className="text-sm text-muted-foreground">Saved Timers</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Create New Workout */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create New Workout Timer
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Workout Timer</DialogTitle>
            <DialogDescription>
              Name your workout and add exercises with durations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <Label>Workout Name</Label>
              <Input
                placeholder="e.g., Footwork Training, Speed Drills..."
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                maxLength={100}
              />
            </div>

            <ExerciseBuilder exercises={exercises} onChange={setExercises} />

            <div className="flex gap-2">
              <Button onClick={handleCreateWorkout} className="flex-1">
                Save Workout Timer
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Timers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Workout Timers</h3>
        {loading ? (
          <Card className="p-6 text-center text-muted-foreground">Loading...</Card>
        ) : timers.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No workout timers yet. Create your first one!
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timers.map((timer) => (
              <Card key={timer.id} className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">{timer.name}</h4>
                    <Badge variant="secondary" className="mt-1">
                      {/* We'll load exercises count later */}
                      Exercises
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleStartSession(timer.name, [])}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteTimer(timer.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
