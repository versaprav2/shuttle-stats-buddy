import { Card } from "@/components/ui/card";
import { Activity, Target, TrendingUp, Trophy } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {value}
        </p>
        {trend && (
          <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
        {icon}
      </div>
    </div>
  </Card>
);

export const Dashboard = () => {
  const stats = [
    {
      title: "Matches Played",
      value: "24",
      icon: <Activity className="w-6 h-6 text-primary" />,
      trend: "+12% this month",
    },
    {
      title: "Win Rate",
      value: "67%",
      icon: <Trophy className="w-6 h-6 text-secondary" />,
      trend: "+5% improvement",
    },
    {
      title: "Training Hours",
      value: "18.5",
      icon: <Target className="w-6 h-6 text-accent" />,
      trend: "This week",
    },
    {
      title: "Current Streak",
      value: "5",
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      trend: "Wins in a row",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Performance</h2>
        <p className="text-muted-foreground">Track your progress and achievements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { date: "Today", activity: "Footwork drills", duration: "45 min" },
            { date: "Yesterday", activity: "Match vs. Alex Chen", duration: "Won 21-18, 21-15" },
            { date: "2 days ago", activity: "Smash training", duration: "30 min" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div>
                <p className="font-medium">{item.activity}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
              <p className="text-sm font-medium text-primary">{item.duration}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
