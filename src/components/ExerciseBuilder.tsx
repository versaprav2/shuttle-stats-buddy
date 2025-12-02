import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { badmintonDrillCategories } from '@/lib/badmintonDrills';
import { Plus, Trash2, GripVertical, Search } from 'lucide-react';
import { z } from 'zod';

export interface Exercise {
  id: string;
  name: string;
  duration: number;
  restAfter: number;
}

const exerciseSchema = z.object({
  name: z.string().trim().min(1, 'Exercise name required').max(100),
  duration: z.number().min(5).max(3600),
  restAfter: z.number().min(0).max(600),
});

interface ExerciseBuilderProps {
  exercises: Exercise[];
  onChange: (exercises: Exercise[]) => void;
}

export const ExerciseBuilder = ({ exercises, onChange }: ExerciseBuilderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof badmintonDrillCategories>('footwork');
  const [customName, setCustomName] = useState('');
  const [duration, setDuration] = useState(30);
  const [restAfter, setRestAfter] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const addExercise = (name: string) => {
    try {
      exerciseSchema.parse({ name, duration, restAfter });
      
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: name.trim(),
        duration,
        restAfter,
      };
      
      onChange([...exercises, newExercise]);
      setCustomName('');
      setIsOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors[0].message);
      }
    }
  };

  const removeExercise = (id: string) => {
    onChange(exercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    onChange(exercises.map(ex => ex.id === id ? { ...ex, ...updates } : ex));
  };

  const filteredDrills = badmintonDrillCategories[selectedCategory].filter(drill =>
    drill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Exercises ({exercises.length})</Label>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Exercise</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Duration and Rest Settings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min={5}
                    max={3600}
                  />
                </div>
                <div>
                  <Label>Rest After (seconds)</Label>
                  <Input
                    type="number"
                    value={restAfter}
                    onChange={(e) => setRestAfter(Number(e.target.value))}
                    min={0}
                    max={600}
                  />
                </div>
              </div>

              {/* Custom Exercise Name */}
              <div className="space-y-2">
                <Label>Custom Exercise Name</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom exercise name..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    maxLength={100}
                  />
                  <Button
                    onClick={() => customName && addExercise(customName)}
                    disabled={!customName.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or select from library</span>
                </div>
              </div>

              {/* Drill Library */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={(v: any) => setSelectedCategory(v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="footwork">Footwork</SelectItem>
                      <SelectItem value="technique">Technique</SelectItem>
                      <SelectItem value="speed">Speed</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="coordination">Coordination</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search drills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                  {filteredDrills.map((drill) => (
                    <Button
                      key={drill}
                      variant="outline"
                      size="sm"
                      onClick={() => addExercise(drill)}
                      className="justify-start h-auto py-2"
                    >
                      {drill}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Exercise List */}
      {exercises.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          No exercises yet. Click "Add Exercise" to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="flex items-center gap-2 p-3 border rounded-lg bg-card"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Input
                  value={exercise.name}
                  onChange={(e) => updateExercise(exercise.id, { name: e.target.value })}
                  className="font-medium"
                  maxLength={100}
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="secondary">{exercise.duration}s</Badge>
                {exercise.restAfter > 0 && (
                  <Badge variant="outline">Rest: {exercise.restAfter}s</Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeExercise(exercise.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
