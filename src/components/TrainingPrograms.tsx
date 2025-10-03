import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Zap, Target, Footprints, Dumbbell } from "lucide-react";
import { toast } from "sonner";

interface Drill {
  name: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: React.ReactNode;
  description: string;
}

const drills: Drill[] = [
  {
    name: "Footwork Fundamentals",
    duration: "30 min",
    difficulty: "beginner",
    icon: <Footprints className="w-6 h-6" />,
    description: "Master basic court movement patterns and stepping techniques",
  },
  {
    name: "Smash Power Training",
    duration: "45 min",
    difficulty: "intermediate",
    icon: <Zap className="w-6 h-6" />,
    description: "Develop explosive smash power with targeted exercises",
  },
  {
    name: "Advanced Drop Shots",
    duration: "40 min",
    difficulty: "advanced",
    icon: <Target className="w-6 h-6" />,
    description: "Perfect your drop shot accuracy and deception",
  },
  {
    name: "Endurance Building",
    duration: "60 min",
    difficulty: "intermediate",
    icon: <Dumbbell className="w-6 h-6" />,
    description: "Increase stamina for longer, more intense matches",
  },
  {
    name: "Net Play Mastery",
    duration: "35 min",
    difficulty: "advanced",
    icon: <CheckCircle2 className="w-6 h-6" />,
    description: "Refine net shots, lifts, and front-court dominance",
  },
  {
    name: "Defensive Tactics",
    duration: "40 min",
    difficulty: "intermediate",
    icon: <Target className="w-6 h-6" />,
    description: "Learn to read opponents and respond defensively",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-primary/20 text-primary border-primary/30";
    case "intermediate":
      return "bg-secondary/20 text-secondary border-secondary/30";
    case "advanced":
      return "bg-destructive/20 text-destructive border-destructive/30";
    default:
      return "";
  }
};

export const TrainingPrograms = () => {
  const handleStartDrill = (drillName: string) => {
    toast.success(`Starting "${drillName}" training!`, {
      description: "Get ready to improve your game!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Training Programs</h2>
        <p className="text-muted-foreground">
          Structured drills to elevate your badminton skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drills.map((drill, index) => (
          <Card
            key={index}
            className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
          >
            <div className="mb-4">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                {drill.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{drill.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{drill.description}</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {drill.duration}
              </div>
              <Badge variant="outline" className={getDifficultyColor(drill.difficulty)}>
                {drill.difficulty}
              </Badge>
            </div>

            <Button
              variant="outline"
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
              onClick={() => handleStartDrill(drill.name)}
            >
              Start Training
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Create Custom Training</h3>
            <p className="text-muted-foreground mb-4">
              Want a personalized training program? Combine drills and set your own goals.
            </p>
            <Button variant="gradient" size="lg">
              Build My Program
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
