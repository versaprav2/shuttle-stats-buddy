import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Target, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Coach = () => {
  const coachingInsights = [
    {
      category: "Technique",
      icon: Target,
      insights: [
        "Focus on footwork drills - your court coverage can improve by 15-20%",
        "Practice net play for 20 minutes daily to sharpen reactions",
        "Work on backhand clear technique - aim for deeper shots"
      ],
      priority: "high"
    },
    {
      category: "Strategy",
      icon: Lightbulb,
      insights: [
        "Vary your shot placement to keep opponents guessing",
        "Use more deceptive shots in the frontcourt",
        "Improve serve variation - mix short and long serves"
      ],
      priority: "medium"
    },
    {
      category: "Physical",
      icon: TrendingUp,
      insights: [
        "Add 2 cardio sessions per week for better endurance",
        "Incorporate plyometric exercises for explosive power",
        "Focus on core strength for better stability and rotation"
      ],
      priority: "medium"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Coach</h2>
        <p className="text-muted-foreground">Personalized coaching insights and guidance</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          These insights are based on your training history, performance data, and current goals.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {coachingInsights.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{section.category}</CardTitle>
                    <CardDescription>Areas to focus on</CardDescription>
                  </div>
                </div>
                <Badge variant={getPriorityColor(section.priority)}>
                  {section.priority} priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {section.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Focus</CardTitle>
          <CardDescription>Recommended training emphasis for this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Technique Drills</span>
              <span className="font-medium">40%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '40%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Match Play</span>
              <span className="font-medium">30%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '30%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Physical Conditioning</span>
              <span className="font-medium">20%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '20%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Recovery</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '10%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Schedule Coaching Session</Button>
      </div>
    </div>
  );
};
