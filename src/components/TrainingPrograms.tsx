import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Zap, Target, Footprints, Dumbbell, Info } from "lucide-react";
import { toast } from "sonner";
import { WorkoutTimer } from "./WorkoutTimer";
import { DrillDetailModal } from "./DrillDetailModal";

interface Drill {
  name: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: React.ReactNode;
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

const drills: Drill[] = [
  {
    name: "Footwork Fundamentals",
    duration: "30 min",
    difficulty: "beginner",
    icon: <Footprints className="w-6 h-6" />,
    description: "Master basic court movement patterns and stepping techniques",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    detailedInfo: {
      objective: "Develop efficient court coverage through proper footwork patterns, enabling quick transitions between all court positions while maintaining balance and readiness.",
      keyPoints: [
        "Always return to center court position after each shot",
        "Use small, quick steps rather than large strides",
        "Maintain a low, athletic stance with knees bent",
        "Lead with the correct foot for each direction",
        "Keep your weight on the balls of your feet",
      ],
      instructions: [
        "Start in center court with feet shoulder-width apart and knees slightly bent",
        "Practice moving to all six corners (front left/right, mid left/right, back left/right)",
        "Use a split-step just before moving to any position",
        "Push off with the opposite foot to your direction of movement",
        "Perform 3 sets of 10 repetitions to each corner",
        "Focus on speed and accuracy, returning to center each time",
        "Rest 30 seconds between sets",
      ],
      benefits: [
        "Improved court coverage and reach",
        "Reduced energy expenditure during matches",
        "Better positioning for shot execution",
        "Enhanced reaction time to opponent's shots",
        "Decreased risk of ankle and knee injuries",
      ],
      commonMistakes: [
        "Taking too large steps that compromise balance",
        "Forgetting to return to center position",
        "Keeping feet flat instead of staying on toes",
        "Looking down at feet instead of watching the shuttle",
        "Moving with straight legs instead of maintaining bent knees",
      ],
    },
  },
  {
    name: "Basic Serving Technique",
    duration: "20 min",
    difficulty: "beginner",
    icon: <Target className="w-6 h-6" />,
    description: "Learn proper short and long serve fundamentals",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    detailedInfo: {
      objective: "Master both short and long serve techniques to control rally initiation and put pressure on opponents from the first shot.",
      keyPoints: [
        "Contact shuttle below waist height (rule requirement)",
        "Use a relaxed grip for better control",
        "Follow through in direction of intended target",
        "Vary serve placement to keep opponent guessing",
        "Maintain consistent serve motion to disguise intention",
      ],
      instructions: [
        "Stand with non-racket foot forward, about 1 meter from service line",
        "Hold shuttle by feathers at chest height with non-racket hand",
        "Start with racket behind you, arm relaxed",
        "Drop shuttle and swing racket forward smoothly",
        "For short serve: contact high with gentle push, aim just over net",
        "For long serve: contact lower with full swing, aim deep to back line",
        "Practice 20 short serves, then 20 long serves",
        "Alternate between short and long for final 20 serves",
      ],
      benefits: [
        "Control of rally pace and positioning",
        "Ability to target opponent's weaknesses",
        "Reduced unforced errors on serves",
        "Tactical advantage at rally start",
        "Confidence in match pressure situations",
      ],
      commonMistakes: [
        "Contacting shuttle above waist (fault)",
        "Telegraphing serve type with body language",
        "Inconsistent release point of shuttle",
        "Too much power on short serves",
        "Not following through properly",
      ],
    },
  },
  {
    name: "Clear Shot Practice",
    duration: "25 min",
    difficulty: "beginner",
    icon: <Zap className="w-6 h-6" />,
    description: "Develop consistent overhead clear technique",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    detailedInfo: {
      objective: "Perfect the overhead clear shot to send the shuttle high and deep to the back of the opponent's court.",
      keyPoints: ["High contact point above head", "Full arm extension", "Wrist snap at contact", "Follow through toward target", "Weight transfer from back to front"],
      instructions: ["Start in ready position at mid-court", "Track shuttle overhead", "Position sideways with non-racket shoulder forward", "Reach up high for contact", "Snap wrist and follow through", "Repeat 50 times"],
      benefits: ["Better defensive positioning", "Increased shot power", "Improved accuracy", "More time to recover"],
      commonMistakes: ["Hitting from too low", "Flat swing path", "Poor timing", "No follow through"],
    },
  },
  {
    name: "Grip Mastery",
    duration: "15 min",
    difficulty: "beginner",
    icon: <CheckCircle2 className="w-6 h-6" />,
    description: "Perfect forehand and backhand grip transitions",
    videoUrl: "https://www.youtube.com/watch?v=example4",
    detailedInfo: {
      objective: "Master quick and efficient grip changes between forehand and backhand for all shot types.",
      keyPoints: ["Relaxed grip between shots", "Quick rotation", "Correct thumb placement", "Consistent grip pressure", "Natural transitions"],
      instructions: ["Hold racket in forehand grip", "Practice rotation to backhand", "Feel thumb position change", "Repeat 100 times slowly", "Gradually increase speed", "Add shot simulation"],
      benefits: ["Faster shot response", "Better shot control", "Reduced arm fatigue", "More shot variety"],
      commonMistakes: ["Gripping too tight", "Slow transitions", "Incorrect thumb placement", "Inconsistent pressure"],
    },
  },
  {
    name: "Shadow Badminton",
    duration: "25 min",
    difficulty: "beginner",
    icon: <Footprints className="w-6 h-6" />,
    description: "Practice movement patterns without a shuttlecock",
    videoUrl: "https://www.youtube.com/watch?v=example5",
    detailedInfo: {
      objective: "Improve footwork speed, accuracy and shot technique through shadow practice without a shuttle.",
      keyPoints: ["Full movement patterns", "Realistic shot motions", "Quick returns to center", "Proper stance", "Sustained intensity"],
      instructions: ["Simulate full rally movements", "Add shot strokes at each position", "Maintain rally pace", "Practice for 2-minute intervals", "Rest 30 seconds between", "Complete 10 intervals"],
      benefits: ["Enhanced muscle memory", "Better conditioning", "Improved technique", "Increased speed"],
      commonMistakes: ["Half movements", "Slow pace", "Poor shot form", "Not returning to center"],
    },
  },
  {
    name: "Smash Power Training",
    duration: "45 min",
    difficulty: "intermediate",
    icon: <Zap className="w-6 h-6" />,
    description: "Develop explosive smash power with targeted exercises",
    videoUrl: "https://www.youtube.com/watch?v=example6",
    detailedInfo: {
      objective: "Build explosive power for devastating smash shots through strength and technique training.",
      keyPoints: ["Jump timing", "Full body rotation", "Wrist snap", "Contact at highest point", "Core engagement"],
      instructions: ["Warm up shoulders", "Practice jump timing", "Focus on contact point", "Do 30 smash repetitions", "Rest between sets", "Add resistance training"],
      benefits: ["Increased smash speed", "Better attack options", "Match dominance", "Opponent pressure"],
      commonMistakes: ["All arm power", "Poor timing", "Low contact", "No body rotation"],
    },
  },
  {
    name: "Drive Shot Drills",
    duration: "30 min",
    difficulty: "intermediate",
    icon: <Target className="w-6 h-6" />,
    description: "Master fast-paced flat drives at mid-court",
    videoUrl: "https://www.youtube.com/watch?v=example7",
    detailedInfo: {
      objective: "Perfect fast, flat drives for aggressive mid-court exchanges and quick attacks.",
      keyPoints: ["Compact swing", "Flat trajectory", "Quick recovery", "Forehand and backhand", "Pace control"],
      instructions: ["Partner feeds at chest height", "Drive with compact motion", "Alternate forehand/backhand", "Maintain rally", "Increase speed gradually", "30 minute session"],
      benefits: ["Faster exchanges", "Attack opportunities", "Opponent pressure", "Rally control"],
      commonMistakes: ["Too much lift", "Slow swing", "Poor positioning", "Inconsistent contact"],
    },
  },
  {
    name: "Net Kill Practice",
    duration: "35 min",
    difficulty: "intermediate",
    icon: <CheckCircle2 className="w-6 h-6" />,
    description: "Sharpen your net kill and interception skills",
    videoUrl: "https://www.youtube.com/watch?v=example8",
    detailedInfo: {
      objective: "Develop sharp net kills and quick interception skills at the front court.",
      keyPoints: ["Early contact", "Wrist control", "Steep angle", "Quick recovery", "Anticipation"],
      instructions: ["Position at net", "Partner lifts shuttles", "Kill with steep angle", "Focus on placement", "Practice both sides", "100 repetitions"],
      benefits: ["More winners", "Front court control", "Quick points", "Opponent pressure"],
      commonMistakes: ["Late contact", "Poor angle", "Slow reaction", "Weak wrist"],
    },
  },
  {
    name: "Endurance Building",
    duration: "60 min",
    difficulty: "intermediate",
    icon: <Dumbbell className="w-6 h-6" />,
    description: "Increase stamina for longer, more intense matches",
    videoUrl: "https://www.youtube.com/watch?v=example9",
    detailedInfo: {
      objective: "Build cardiovascular endurance and muscular stamina for sustained high-level performance.",
      keyPoints: ["Progressive intervals", "Consistent pace", "Full court coverage", "Recovery management", "Mental toughness"],
      instructions: ["Interval training", "Multi-shuttle drills", "Court sprints", "Rally simulations", "Active recovery", "60 minute session"],
      benefits: ["Better late-game performance", "Faster recovery", "Sustained intensity", "Mental strength"],
      commonMistakes: ["Starting too fast", "Inadequate recovery", "Poor pacing", "Giving up"],
    },
  },
  {
    name: "Defensive Tactics",
    duration: "40 min",
    difficulty: "intermediate",
    icon: <Target className="w-6 h-6" />,
    description: "Learn to read opponents and respond defensively",
    videoUrl: "https://www.youtube.com/watch?v=example10",
    detailedInfo: {
      objective: "Master defensive positioning, shot selection, and court coverage under pressure.",
      keyPoints: ["Low stance", "Quick returns", "Shot selection", "Court awareness", "Patience"],
      instructions: ["Practice defensive clears", "Low drives", "Net lifts", "Recovery positioning", "Pattern recognition", "Full session"],
      benefits: ["Better defense", "Fewer errors", "Rally control", "Opponent frustration"],
      commonMistakes: ["Standing too high", "Panicking", "Weak returns", "Poor positioning"],
    },
  },
  {
    name: "Multi-Shuttle Training",
    duration: "50 min",
    difficulty: "intermediate",
    icon: <Zap className="w-6 h-6" />,
    description: "High-intensity drill with continuous shuttle feeding",
    videoUrl: "https://www.youtube.com/watch?v=example11",
    detailedInfo: {
      objective: "Build explosive power and endurance through rapid-fire shuttle feeding drills.",
      keyPoints: ["Continuous movement", "Quick reactions", "Technique maintenance", "High intensity", "Focus"],
      instructions: ["Feeder with multiple shuttles", "Rapid feeding pattern", "Hit all shots properly", "30 second intervals", "15 second rest", "Repeat 20 times"],
      benefits: ["Explosive power", "Quick reactions", "Mental toughness", "Match simulation"],
      commonMistakes: ["Technique breakdown", "Slow reactions", "Poor footwork", "Giving up"],
    },
  },
  {
    name: "Advanced Drop Shots",
    duration: "40 min",
    difficulty: "advanced",
    icon: <Target className="w-6 h-6" />,
    description: "Perfect your drop shot accuracy and deception",
    videoUrl: "https://www.youtube.com/watch?v=example12",
    detailedInfo: {
      objective: "Master deceptive drop shots with pinpoint accuracy and disguise.",
      keyPoints: ["Smash disguise", "Soft touch", "Steep angle", "Placement variety", "Deception"],
      instructions: ["Practice smash motion", "Slow at contact", "Aim near net", "Vary placement", "Add slice", "200 repetitions"],
      benefits: ["Winning shots", "Opponent confusion", "Point control", "Match advantage"],
      commonMistakes: ["Obvious preparation", "Too high", "No disguise", "Poor placement"],
    },
  },
  {
    name: "Net Play Mastery",
    duration: "35 min",
    difficulty: "advanced",
    icon: <CheckCircle2 className="w-6 h-6" />,
    description: "Refine net shots, lifts, and front-court dominance",
    videoUrl: "https://www.youtube.com/watch?v=example13",
    detailedInfo: {
      objective: "Dominate front-court play with precise net shots, tumbles, and lifts.",
      keyPoints: ["Soft hands", "Tight spins", "Quick reactions", "Shot variety", "Court positioning"],
      instructions: ["Net shot variations", "Spinning net", "Tumbling shots", "Lift practice", "Partner drills", "Full session"],
      benefits: ["Front court dominance", "Pressure creation", "Shot variety", "Rally control"],
      commonMistakes: ["Too hard", "Predictable", "Poor touch", "Slow movement"],
    },
  },
  {
    name: "Deceptive Shots",
    duration: "45 min",
    difficulty: "advanced",
    icon: <Target className="w-6 h-6" />,
    description: "Master slice drops, reverse slices, and feints",
    videoUrl: "https://www.youtube.com/watch?v=example14",
    detailedInfo: {
      objective: "Develop advanced deception techniques to confuse and outmaneuver opponents.",
      keyPoints: ["Body disguise", "Racket control", "Slice technique", "Reverse slice", "Timing"],
      instructions: ["Standard shot motion", "Last-second change", "Practice slices", "Add reverse", "Combine techniques", "Advanced drills"],
      benefits: ["Opponent confusion", "More winners", "Tactical advantage", "Match control"],
      commonMistakes: ["Obvious tell", "Poor execution", "Wrong timing", "No variation"],
    },
  },
  {
    name: "Jump Smash Technique",
    duration: "40 min",
    difficulty: "advanced",
    icon: <Zap className="w-6 h-6" />,
    description: "Develop power and control in jump smashes",
    videoUrl: "https://www.youtube.com/watch?v=example15",
    detailedInfo: {
      objective: "Perfect the explosive jump smash for maximum power and intimidation.",
      keyPoints: ["Jump timing", "Peak contact", "Body control", "Landing safety", "Power generation"],
      instructions: ["Approach footwork", "Jump mechanics", "Contact timing", "Safe landing", "Power development", "Controlled practice"],
      benefits: ["Maximum power", "Attack dominance", "Opponent pressure", "Spectacular shots"],
      commonMistakes: ["Poor timing", "Unsafe landing", "Low contact", "No control"],
    },
  },
  {
    name: "Match Simulation",
    duration: "90 min",
    difficulty: "advanced",
    icon: <Dumbbell className="w-6 h-6" />,
    description: "Full match scenarios with pressure situations",
    videoUrl: "https://www.youtube.com/watch?v=example16",
    detailedInfo: {
      objective: "Simulate real match conditions with pressure, tactics, and endurance challenges.",
      keyPoints: ["Match intensity", "Tactical play", "Pressure management", "Full duration", "Recovery practice"],
      instructions: ["Best of 3 games", "Use all shots", "Practice tactics", "Manage pressure", "Analyze performance", "Full simulation"],
      benefits: ["Match readiness", "Tactical experience", "Mental toughness", "Performance testing"],
      commonMistakes: ["Not match intensity", "Poor tactics", "Giving up", "No analysis"],
    },
  },
  {
    name: "Court Coverage Optimization",
    duration: "50 min",
    difficulty: "advanced",
    icon: <Footprints className="w-6 h-6" />,
    description: "Maximize efficiency in court movement and recovery",
    videoUrl: "https://www.youtube.com/watch?v=example17",
    detailedInfo: {
      objective: "Optimize movement patterns for maximum court coverage with minimal energy expenditure.",
      keyPoints: ["Efficient paths", "Quick recovery", "Center position", "Energy conservation", "Pattern recognition"],
      instructions: ["Analyze movement", "Optimize paths", "Practice patterns", "Reduce steps", "Quick center return", "Efficiency focus"],
      benefits: ["Better coverage", "Energy savings", "Faster recovery", "Consistent positioning"],
      commonMistakes: ["Wasted movement", "Slow recovery", "Poor paths", "No center return"],
    },
  },
  {
    name: "Advanced Serve Variations",
    duration: "30 min",
    difficulty: "advanced",
    icon: <Target className="w-6 h-6" />,
    description: "Master flick serves, drive serves, and serve placement",
    videoUrl: "https://www.youtube.com/watch?v=example18",
    detailedInfo: {
      objective: "Master all serve variations including flick, drive, and placement serves for tactical advantage.",
      keyPoints: ["Serve variety", "Deception", "Placement precision", "Timing variation", "Tactical usage"],
      instructions: ["Practice flick serve", "Drive serve technique", "Placement drills", "Disguise practice", "Tactical combinations", "Match scenarios"],
      benefits: ["Serve dominance", "Tactical options", "Opponent confusion", "Rally control"],
      commonMistakes: ["Predictable", "Poor disguise", "Bad placement", "Wrong timing"],
    },
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
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [drillModalOpen, setDrillModalOpen] = useState(false);
  const [completedDrills, setCompletedDrills] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load completed drills from localStorage
    const completed = new Set<string>();
    drills.forEach(drill => {
      const saved = localStorage.getItem(`drill_progress_${drill.name}`);
      if (saved) {
        const progress = JSON.parse(saved);
        if (progress.completed) {
          completed.add(drill.name);
        }
      }
    });
    setCompletedDrills(completed);
  }, [drillModalOpen]);

  const handleViewDrill = (drill: Drill) => {
    setSelectedDrill(drill);
    setDrillModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Training Programs</h2>
        <p className="text-muted-foreground">
          Structured drills to elevate your badminton skills
        </p>
      </div>

      <WorkoutTimer />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drills.map((drill, index) => {
          const isCompleted = completedDrills.has(drill.name);
          return (
            <Card
              key={index}
              className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group relative"
            >
              {isCompleted && (
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                    <CheckCircle2 className="w-3 h-3" />
                  </Badge>
                </div>
              )}
              
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
                onClick={() => handleViewDrill(drill)}
              >
                <Info className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Training Progress</h3>
            <p className="text-muted-foreground mb-4">
              You've completed {completedDrills.size} out of {drills.length} drills. Keep training!
            </p>
            <div className="w-full bg-muted rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedDrills.size / drills.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <DrillDetailModal 
        drill={selectedDrill}
        open={drillModalOpen}
        onOpenChange={setDrillModalOpen}
      />
    </div>
  );
};
