import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  Clock, 
  Play, 
  Target,
  ListChecks,
  Lightbulb,
  TrendingUp,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

interface DrillDetails {
  name: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  videoUrl?: string;
  detailedInfo: {
    objective: string;
    keyPoints: string[];
    instructions: string[];
    benefits: string[];
    commonMistakes: string[];
  };
}

interface DrillProgress {
  completed: boolean;
  completionCount: number;
  lastCompleted?: string;
  notes: string;
}

interface DrillDetailModalProps {
  drill: DrillDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DrillDetailModal = ({ drill, open, onOpenChange }: DrillDetailModalProps) => {
  const [progress, setProgress] = useState<DrillProgress>({
    completed: false,
    completionCount: 0,
    notes: "",
  });

  useEffect(() => {
    if (drill) {
      const saved = localStorage.getItem(`drill_progress_${drill.name}`);
      if (saved) {
        setProgress(JSON.parse(saved));
      } else {
        setProgress({
          completed: false,
          completionCount: 0,
          notes: "",
        });
      }
    }
  }, [drill]);

  const handleMarkComplete = () => {
    if (!drill) return;
    
    const newProgress = {
      ...progress,
      completed: true,
      completionCount: progress.completionCount + 1,
      lastCompleted: new Date().toISOString(),
    };
    
    setProgress(newProgress);
    localStorage.setItem(`drill_progress_${drill.name}`, JSON.stringify(newProgress));
    toast.success("Drill completed! 🎉", {
      description: `You've completed this drill ${newProgress.completionCount} times!`,
    });
  };

  const handleSaveNotes = () => {
    if (!drill) return;
    localStorage.setItem(`drill_progress_${drill.name}`, JSON.stringify(progress));
    toast.success("Notes saved!");
  };

  const getVideoEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    
    // Convert YouTube watch URL to embed URL
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };

  if (!drill) return null;

  const embedUrl = getVideoEmbedUrl(drill.videoUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{drill.name}</DialogTitle>
              <DialogDescription className="text-base">
                {drill.description}
              </DialogDescription>
            </div>
            {progress.completed && (
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed {progress.completionCount}x
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="text-sm">
              <Clock className="w-3 h-3 mr-1" />
              {drill.duration}
            </Badge>
            <Badge variant="outline" className="text-sm capitalize">
              {drill.difficulty}
            </Badge>
            {progress.lastCompleted && (
              <Badge variant="outline" className="text-sm text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                Last: {new Date(progress.lastCompleted).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Objective</h4>
                  <p className="text-sm text-muted-foreground">{drill.detailedInfo.objective}</p>
                </div>
              </div>
            </Card>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Key Points</h4>
              </div>
              <ul className="space-y-2">
                {drill.detailedInfo.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Benefits</h4>
              </div>
              <ul className="space-y-2">
                {drill.detailedInfo.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            {embedUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={embedUrl}
                  title={drill.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Play className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No video available for this drill</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="instructions" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Step-by-Step Instructions</h4>
              <ol className="space-y-3">
                {drill.detailedInfo.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-semibold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Card className="p-4 bg-destructive/5 border-destructive/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-destructive mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Common Mistakes to Avoid</h4>
                  <ul className="space-y-1">
                    {drill.detailedInfo.commonMistakes.map((mistake, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Your Progress</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion Count</span>
                    <span className="font-semibold">{progress.completionCount} times</span>
                  </div>
                  <Progress value={Math.min(progress.completionCount * 10, 100)} />
                </div>
                
                {progress.lastCompleted && (
                  <div className="text-sm text-muted-foreground">
                    Last completed: {new Date(progress.lastCompleted).toLocaleString()}
                  </div>
                )}
              </div>
            </Card>

            <div>
              <h4 className="font-semibold mb-2">Training Notes</h4>
              <Textarea
                placeholder="Add notes about your progress, challenges, or insights..."
                value={progress.notes}
                onChange={(e) => setProgress({ ...progress, notes: e.target.value })}
                rows={6}
                className="resize-none"
              />
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={handleSaveNotes}
              >
                Save Notes
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-4">
          <Button 
            variant="gradient" 
            className="flex-1"
            onClick={handleMarkComplete}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as Completed
          </Button>
          {embedUrl && (
            <Button 
              variant="outline"
              onClick={() => window.open(drill.videoUrl, "_blank")}
            >
              <Play className="w-4 h-4 mr-2" />
              Open Video
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
