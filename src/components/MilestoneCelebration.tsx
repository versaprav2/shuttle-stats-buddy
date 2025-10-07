import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  type: "match" | "level" | "achievement" | "streak" | "training";
  title: string;
  message: string;
  xp?: number;
  icon?: string;
}

interface MilestoneCelebrationProps {
  milestone: Milestone | null;
  onClose: () => void;
  onShare?: () => void;
}

export const MilestoneCelebration = ({ milestone, onClose, onShare }: MilestoneCelebrationProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (milestone) {
      // Generate confetti particles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setConfetti(particles);
    }
  }, [milestone]);

  if (!milestone) return null;

  const getIcon = () => {
    switch (milestone.type) {
      case "match":
        return <Trophy className="w-16 h-16 text-primary" />;
      case "level":
        return <Star className="w-16 h-16 text-secondary" />;
      case "achievement":
        return <Zap className="w-16 h-16 text-accent" />;
      case "streak":
        return <span className="text-6xl">🔥</span>;
      case "training":
        return <span className="text-6xl">💪</span>;
      default:
        return <Trophy className="w-16 h-16 text-primary" />;
    }
  };

  return (
    <Dialog open={!!milestone} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-2 border-primary/20 overflow-hidden">
        {/* Confetti Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-primary rounded-full animate-in fade-in slide-in-from-top-10"
              style={{
                left: `${particle.x}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: "1.5s",
                top: "-10px",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center space-y-6 py-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <div className="p-6 bg-primary/10 rounded-full">
              {getIcon()}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {milestone.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {milestone.message}
            </p>
          </div>

          {/* XP Badge */}
          {milestone.xp && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border-2 border-primary/20 rounded-full animate-in zoom-in duration-500 delay-300">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-primary">+{milestone.xp} XP</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            {onShare && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={onShare}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            )}
            <Button onClick={onClose} className="gap-2">
              Continue
            </Button>
          </div>

          {/* Celebration Text */}
          <p className="text-sm text-muted-foreground animate-in fade-in duration-500 delay-500">
            Keep up the amazing work! 🎉
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to check and trigger milestones
export const checkMilestones = (): Milestone | null => {
  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const userXP = parseInt(localStorage.getItem("userXP") || "0");
  const currentStreak = parseInt(localStorage.getItem("currentStreak") || "0");
  const lastChecked = localStorage.getItem("lastMilestoneCheck");
  const today = new Date().toDateString();

  // Only check once per day
  if (lastChecked === today) return null;

  // Check match milestones (every 5 matches)
  if (matches.length > 0 && matches.length % 5 === 0) {
    const milestone: Milestone = {
      id: `match-${matches.length}`,
      type: "match",
      title: `${matches.length} Matches Logged!`,
      message: "You're building an impressive match history!",
      xp: 100,
    };
    localStorage.setItem("lastMilestoneCheck", today);
    return milestone;
  }

  // Check level milestones (every 500 XP)
  const level = Math.floor(userXP / 500) + 1;
  const prevLevel = Math.floor((userXP - 50) / 500) + 1;
  if (level > prevLevel) {
    const milestone: Milestone = {
      id: `level-${level}`,
      type: "level",
      title: `Level ${level} Reached!`,
      message: "Your dedication is paying off!",
      xp: 200,
    };
    localStorage.setItem("lastMilestoneCheck", today);
    return milestone;
  }

  // Check streak milestones
  if (currentStreak >= 7 && currentStreak % 7 === 0) {
    const milestone: Milestone = {
      id: `streak-${currentStreak}`,
      type: "streak",
      title: `${currentStreak} Day Streak!`,
      message: "You're on fire! Keep the momentum going!",
      xp: 150,
    };
    localStorage.setItem("lastMilestoneCheck", today);
    return milestone;
  }

  return null;
};
