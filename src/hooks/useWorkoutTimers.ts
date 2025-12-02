import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface WorkoutTimer {
  id: string;
  name: string;
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface WorkoutTimerExercise {
  id: string;
  workout_timer_id: string;
  name: string;
  order_index: number;
  duration: number;
  rest_after: number;
}

export interface WorkoutTimerSession {
  id: string;
  workout_timer_id: string | null;
  workout_timer_name: string;
  completed_at: string;
  exercises_completed: number;
  total_exercises: number;
  duration_minutes: number;
  linked_workout_id: string | null;
  notes: string | null;
}

export const useWorkoutTimers = () => {
  const { user } = useAuth();
  const [timers, setTimers] = useState<WorkoutTimer[]>([]);
  const [sessions, setSessions] = useState<WorkoutTimerSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTimers();
      loadSessions();
    }
  }, [user]);

  const loadTimers = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_timers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimers(data || []);
    } catch (error) {
      console.error('Error loading workout timers:', error);
      toast.error('Failed to load workout timers');
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_timer_sessions')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading workout sessions:', error);
    }
  };

  const saveTimer = async (name: string, settings: any, exercises: Omit<WorkoutTimerExercise, 'id' | 'workout_timer_id'>[]) => {
    if (!user) return null;

    try {
      // Save workout timer
      const { data: timerData, error: timerError } = await supabase
        .from('workout_timers')
        .insert({
          user_id: user.id,
          name,
          settings
        })
        .select()
        .single();

      if (timerError) throw timerError;

      // Save exercises
      if (exercises.length > 0) {
        const exercisesData = exercises.map(ex => ({
          workout_timer_id: timerData.id,
          name: ex.name,
          order_index: ex.order_index,
          duration: ex.duration,
          rest_after: ex.rest_after
        }));

        const { error: exercisesError } = await supabase
          .from('workout_timer_exercises')
          .insert(exercisesData);

        if (exercisesError) throw exercisesError;
      }

      await loadTimers();
      toast.success('Workout timer saved');
      return timerData.id;
    } catch (error) {
      console.error('Error saving workout timer:', error);
      toast.error('Failed to save workout timer');
      return null;
    }
  };

  const updateTimer = async (id: string, name: string, exercises: Omit<WorkoutTimerExercise, 'id' | 'workout_timer_id'>[]) => {
    if (!user) return false;

    try {
      // Update timer name
      const { error: updateError } = await supabase
        .from('workout_timers')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      // Delete old exercises
      const { error: deleteError } = await supabase
        .from('workout_timer_exercises')
        .delete()
        .eq('workout_timer_id', id);

      if (deleteError) throw deleteError;

      // Insert new exercises
      if (exercises.length > 0) {
        const exercisesData = exercises.map(ex => ({
          workout_timer_id: id,
          name: ex.name,
          order_index: ex.order_index,
          duration: ex.duration,
          rest_after: ex.rest_after
        }));

        const { error: insertError } = await supabase
          .from('workout_timer_exercises')
          .insert(exercisesData);

        if (insertError) throw insertError;
      }

      await loadTimers();
      toast.success('Workout timer updated');
      return true;
    } catch (error) {
      console.error('Error updating workout timer:', error);
      toast.error('Failed to update workout timer');
      return false;
    }
  };

  const deleteTimer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workout_timers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadTimers();
      toast.success('Workout timer deleted');
    } catch (error) {
      console.error('Error deleting workout timer:', error);
      toast.error('Failed to delete workout timer');
    }
  };

  const saveSession = async (
    timerId: string | null,
    timerName: string,
    exercisesCompleted: number,
    totalExercises: number,
    durationMinutes: number,
    notes?: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('workout_timer_sessions')
        .insert({
          user_id: user.id,
          workout_timer_id: timerId,
          workout_timer_name: timerName,
          exercises_completed: exercisesCompleted,
          total_exercises: totalExercises,
          duration_minutes: durationMinutes,
          notes: notes || null
        })
        .select()
        .single();

      if (error) throw error;

      await loadSessions();
      return data.id;
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save workout session');
      return null;
    }
  };

  const linkSessionToWorkout = async (sessionId: string, workoutId: string) => {
    try {
      const { error } = await supabase
        .from('workout_timer_sessions')
        .update({ linked_workout_id: workoutId })
        .eq('id', sessionId);

      if (error) throw error;

      await loadSessions();
      toast.success('Session linked to workout');
    } catch (error) {
      console.error('Error linking session:', error);
      toast.error('Failed to link session');
    }
  };

  const getTodaySessions = () => {
    const today = new Date().toDateString();
    return sessions.filter(s => 
      new Date(s.completed_at).toDateString() === today
    );
  };

  const getSessionsByTimer = (timerId: string) => {
    return sessions.filter(s => s.workout_timer_id === timerId);
  };

  return {
    timers,
    sessions,
    loading,
    saveTimer,
    updateTimer,
    deleteTimer,
    saveSession,
    linkSessionToWorkout,
    getTodaySessions,
    getSessionsByTimer,
    refresh: () => {
      loadTimers();
      loadSessions();
    }
  };
};
