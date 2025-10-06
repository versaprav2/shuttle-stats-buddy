import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, TrendingUp, CheckCircle2, Lock, Play } from "lucide-react";
import { toast } from "sonner";

interface PlanWeek {
  week: number;
  focus: string;
  sessions: Session[];
}

interface Session {
  day: string;
  type: string;
  duration: string;
  drills: string[];
  completed?: boolean;
}

interface TrainingPlan {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  description: string;
  goals: string[];
  weeks: PlanWeek[];
}

const trainingPlans: TrainingPlan[] = [
  {
    id: "weekly-beginner",
    name: "Foundation Week",
    level: "beginner",
    duration: "1 Week",
    description: "Build basic skills and court awareness",
    goals: ["Master basic footwork", "Develop consistent serves", "Improve stamina"],
    weeks: [
      {
        week: 1,
        focus: "Basics & Fundamentals",
        sessions: [
          {
            day: "Monday",
            type: "Footwork",
            duration: "45 min",
            drills: ["Shadow footwork - 6 corners", "Forward/backward movement", "Side-to-side shuffle"]
          },
          {
            day: "Wednesday",
            type: "Serves & Clears",
            duration: "60 min",
            drills: ["Short serve practice", "High serve technique", "Clear to backcourt"]
          },
          {
            day: "Friday",
            type: "Rally Practice",
            duration: "60 min",
            drills: ["Half-court clears", "Drop shot introduction", "Match simulation"]
          }
        ]
      }
    ]
  },
  {
    id: "monthly-intermediate",
    name: "Skill Builder",
    level: "intermediate",
    duration: "4 Weeks",
    description: "Enhance technique and tactical awareness",
    goals: ["Master attacking shots", "Improve court positioning", "Build match stamina"],
    weeks: [
      {
        week: 1,
        focus: "Attacking Fundamentals",
        sessions: [
          { day: "Mon", type: "Smash Training", duration: "60 min", drills: ["Jump smash technique", "Smash placement", "Power development"] },
          { day: "Wed", type: "Net Play", duration: "45 min", drills: ["Net kill practice", "Tight net shots", "Net interception"] },
          { day: "Fri", type: "Game Practice", duration: "90 min", drills: ["Singles match", "Point-based drills", "Tactical scenarios"] }
        ]
      },
      {
        week: 2,
        focus: "Defensive Skills",
        sessions: [
          { day: "Mon", type: "Defense", duration: "60 min", drills: ["Block returns", "Lift technique", "Court coverage"] },
          { day: "Wed", type: "Footwork Speed", duration: "45 min", drills: ["Multi-shuttle drills", "Speed footwork", "Reaction training"] },
          { day: "Fri", type: "Match Play", duration: "90 min", drills: ["Competitive matches", "Scenario practice", "Endurance training"] }
        ]
      },
      {
        week: 3,
        focus: "Combination Play",
        sessions: [
          { day: "Mon", type: "Attack Combos", duration: "60 min", drills: ["Drop-smash patterns", "Cross-court attacks", "Deception shots"] },
          { day: "Wed", type: "Doubles Tactics", duration: "60 min", drills: ["Front-back formation", "Side-by-side defense", "Rotation drills"] },
          { day: "Fri", type: "Tournament Prep", duration: "90 min", drills: ["Match simulation", "Strategy implementation", "Mental training"] }
        ]
      },
      {
        week: 4,
        focus: "Integration & Testing",
        sessions: [
          { day: "Mon", type: "Full Skills Review", duration: "60 min", drills: ["All-around practice", "Weak point focus", "Speed drills"] },
          { day: "Wed", type: "Match Tactics", duration: "60 min", drills: ["Opponent analysis", "Strategy practice", "Adaptability drills"] },
          { day: "Fri", type: "Challenge Matches", duration: "90 min", drills: ["Best of 3 matches", "Performance tracking", "Goal assessment"] }
        ]
      }
    ]
  },
  {
    id: "3month-progressive",
    name: "Championship Path",
    level: "intermediate",
    duration: "12 Weeks",
    description: "Systematic progression to competitive level",
    goals: ["Tournament readiness", "Advanced shot mastery", "Peak fitness", "Mental toughness"],
    weeks: [
      { week: 1, focus: "Phase 1: Foundation Reset", sessions: [] },
      { week: 2, focus: "Phase 1: Technique Refinement", sessions: [] },
      { week: 3, focus: "Phase 1: Consistency Building", sessions: [] },
      { week: 4, focus: "Phase 2: Power Development", sessions: [] },
      { week: 5, focus: "Phase 2: Speed Training", sessions: [] },
      { week: 6, focus: "Phase 2: Tactical Awareness", sessions: [] },
      { week: 7, focus: "Phase 3: Match Preparation", sessions: [] },
      { week: 8, focus: "Phase 3: Tournament Simulation", sessions: [] },
      { week: 9, focus: "Phase 3: Mental Training", sessions: [] },
      { week: 10, focus: "Phase 4: Peak Performance", sessions: [] },
      { week: 11, focus: "Phase 4: Competition Week", sessions: [] },
      { week: 12, focus: "Phase 4: Recovery & Analysis", sessions: [] }
    ]
  },
  {
    id: "yearly-mastery",
    name: "Annual Excellence",
    level: "advanced",
    duration: "52 Weeks",
    description: "Complete development program for serious players",
    goals: ["National-level skills", "Complete tactical mastery", "Elite fitness", "Coaching capability"],
    weeks: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      focus: `Month ${i + 1}: Progressive Development`,
      sessions: []
    }))
  }
];

export const TrainingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [activePlans, setActivePlans] = useState<{ [key: string]: number }>({});
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("activePlans");
    if (saved) setActivePlans(JSON.parse(saved));
    
    const savedSessions = localStorage.getItem("completedSessions");
    if (savedSessions) setCompletedSessions(new Set(JSON.parse(savedSessions)));
  }, []);

  const startPlan = (plan: TrainingPlan) => {
    const updated = { ...activePlans, [plan.id]: 0 };
    setActivePlans(updated);
    localStorage.setItem("activePlans", JSON.stringify(updated));
    setSelectedPlan(plan);
    toast.success(`Started: ${plan.name}`);
  };

  const completeSession = (planId: string, weekIndex: number, sessionIndex: number) => {
    const sessionKey = `${planId}-${weekIndex}-${sessionIndex}`;
    const updated = new Set(completedSessions);
    updated.add(sessionKey);
    setCompletedSessions(updated);
    localStorage.setItem("completedSessions", JSON.stringify(Array.from(updated)));
    toast.success("Session completed! 🏆");
  };

  const calculateProgress = (plan: TrainingPlan): number => {
    if (!plan.weeks.length) return 0;
    let total = 0;
    let completed = 0;
    
    plan.weeks.forEach((week, wi) => {
      week.sessions.forEach((_, si) => {
        total++;
        if (completedSessions.has(`${plan.id}-${wi}-${si}`)) completed++;
      });
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-accent/10 text-accent border-accent/20";
      case "intermediate": return "bg-secondary/10 text-secondary border-secondary/20";
      case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Training Plans
          </h1>
          <p className="text-muted-foreground">Structured programs designed by expert coaches</p>
        </div>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Plans</p>
              <p className="text-2xl font-bold">{Object.keys(activePlans).length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="3month">3-Month</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          {trainingPlans
            .filter(p => p.duration === "1 Week")
            .map(plan => (
              <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <Badge className={getLevelColor(plan.level)}>{plan.level}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {plan.goals.map((goal, idx) => (
                        <Badge key={idx} variant="outline" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {activePlans[plan.id] !== undefined ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{calculateProgress(plan)}%</span>
                      </div>
                      <Progress value={calculateProgress(plan)} className="h-2" />
                    </div>

                    {plan.weeks[0].sessions.map((session, idx) => {
                      const sessionKey = `${plan.id}-0-${idx}`;
                      const isCompleted = completedSessions.has(sessionKey);
                      
                      return (
                        <Card key={idx} className={`p-4 ${isCompleted ? 'bg-primary/5 border-primary/20' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{session.day} - {session.type}</h4>
                                {isCompleted && <CheckCircle2 className="w-5 h-5 text-primary" />}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{session.duration}</p>
                              <div className="space-y-1">
                                {session.drills.map((drill, di) => (
                                  <p key={di} className="text-sm">• {drill}</p>
                                ))}
                              </div>
                            </div>
                            {!isCompleted && (
                              <Button
                                onClick={() => completeSession(plan.id, 0, idx)}
                                variant="outline"
                                size="sm"
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Button onClick={() => startPlan(plan)} className="gap-2">
                    <Play className="w-4 h-4" />
                    Start This Plan
                  </Button>
                )}
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          {trainingPlans
            .filter(p => p.duration === "4 Weeks")
            .map(plan => (
              <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <Badge className={getLevelColor(plan.level)}>{plan.level}</Badge>
                      <Badge variant="outline">{plan.duration}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {plan.goals.map((goal, idx) => (
                        <Badge key={idx} variant="outline" className="gap-1">
                          <Target className="w-3 h-3" />
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {activePlans[plan.id] !== undefined ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-muted-foreground">{calculateProgress(plan)}%</span>
                      </div>
                      <Progress value={calculateProgress(plan)} className="h-2" />
                    </div>

                    <div className="grid gap-4">
                      {plan.weeks.map((week, weekIdx) => (
                        <Card key={weekIdx} className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Week {week.week}: {week.focus}</h4>
                          </div>
                          <div className="space-y-2">
                            {week.sessions.map((session, sessionIdx) => {
                              const sessionKey = `${plan.id}-${weekIdx}-${sessionIdx}`;
                              const isCompleted = completedSessions.has(sessionKey);
                              
                              return (
                                <div key={sessionIdx} className={`flex items-center justify-between p-3 rounded-lg border ${isCompleted ? 'bg-primary/5 border-primary/20' : ''}`}>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm">{session.day}</span>
                                      <span className="text-sm text-muted-foreground">•</span>
                                      <span className="text-sm">{session.type}</span>
                                      <span className="text-sm text-muted-foreground">({session.duration})</span>
                                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                    </div>
                                  </div>
                                  {!isCompleted && (
                                    <Button
                                      onClick={() => completeSession(plan.id, weekIdx, sessionIdx)}
                                      variant="ghost"
                                      size="sm"
                                    >
                                      Complete
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => startPlan(plan)} className="gap-2">
                    <Play className="w-4 h-4" />
                    Start 4-Week Program
                  </Button>
                )}
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="3month" className="space-y-4">
          {trainingPlans
            .filter(p => p.duration === "12 Weeks")
            .map(plan => (
              <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <Badge className={getLevelColor(plan.level)}>{plan.level}</Badge>
                      <Badge variant="outline" className="gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {plan.duration}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {plan.goals.map((goal, idx) => (
                        <Badge key={idx} variant="outline" className="gap-1 justify-start">
                          <Target className="w-3 h-3" />
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {activePlans[plan.id] !== undefined ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">12-Week Progress</span>
                        <span className="text-sm text-muted-foreground">{Math.round((activePlans[plan.id] / 12) * 100)}%</span>
                      </div>
                      <Progress value={(activePlans[plan.id] / 12) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {plan.weeks.map((week, idx) => (
                        <Card
                          key={idx}
                          className={`p-3 text-center cursor-pointer transition-all ${
                            idx <= activePlans[plan.id]
                              ? 'bg-primary/10 border-primary/20'
                              : 'opacity-50'
                          }`}
                        >
                          <div className="text-xs text-muted-foreground mb-1">Week {week.week}</div>
                          <div className="text-sm font-medium">{week.focus.split(':')[1] || week.focus}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => startPlan(plan)} className="gap-2">
                    <Play className="w-4 h-4" />
                    Begin 12-Week Journey
                  </Button>
                )}
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          {trainingPlans
            .filter(p => p.duration === "52 Weeks")
            .map(plan => (
              <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <Badge className={getLevelColor(plan.level)}>{plan.level}</Badge>
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="w-3 h-3" />
                        Full Year
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {plan.goals.map((goal, idx) => (
                        <Badge key={idx} variant="outline" className="gap-1 justify-start">
                          <Target className="w-3 h-3" />
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {activePlans[plan.id] !== undefined ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Annual Progress</span>
                        <span className="text-sm text-muted-foreground">Month {activePlans[plan.id] + 1}/12</span>
                      </div>
                      <Progress value={((activePlans[plan.id] + 1) / 12) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {plan.weeks.map((week, idx) => (
                        <Card
                          key={idx}
                          className={`p-4 cursor-pointer transition-all ${
                            idx <= activePlans[plan.id]
                              ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20'
                              : 'opacity-40'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {idx <= activePlans[plan.id] ? (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            ) : (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className="text-sm font-semibold">Month {idx + 1}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Progressive Training</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => startPlan(plan)} className="gap-2">
                    <Play className="w-4 h-4" />
                    Commit to Excellence
                  </Button>
                )}
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};