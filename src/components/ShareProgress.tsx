import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, Share2, Trophy, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface ShareProgressProps {
  open: boolean;
  onClose: () => void;
  data: {
    type: "weekly" | "achievement" | "milestone" | "streak";
    stats?: {
      matches?: number;
      wins?: number;
      xp?: number;
      streak?: number;
      level?: number;
    };
    achievement?: {
      name: string;
      description: string;
      icon?: string;
    };
  };
}

export const ShareProgress = ({ open, onClose, data }: ShareProgressProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      // Use html2canvas for better quality
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `badmintontrain-${data.type}-${Date.now()}.png`;
      link.href = url;
      link.click();

      toast.success("Progress card saved!");
    } catch (error) {
      toast.error("Failed to save image");
    }
  };

  const handleCopyText = () => {
    let text = "";
    
    if (data.type === "weekly" && data.stats) {
      text = `This week on BadmintonTrain 🏸\n\n`;
      text += `📊 Matches: ${data.stats.matches || 0}\n`;
      text += `🏆 Wins: ${data.stats.wins || 0}\n`;
      text += `⭐ XP Earned: ${data.stats.xp || 0}\n`;
      text += `🔥 Current Streak: ${data.stats.streak || 0} days\n\n`;
      text += `Track your badminton journey!`;
    } else if (data.type === "achievement" && data.achievement) {
      text = `🎯 Achievement Unlocked!\n\n`;
      text += `${data.achievement.icon || "🏆"} ${data.achievement.name}\n`;
      text += `${data.achievement.description}\n\n`;
      text += `#BadmintonTrain #Achievement`;
    } else if (data.type === "milestone") {
      text = `🎉 Milestone Reached!\n\n`;
      text += `Level ${data.stats?.level || "Up"}!\n`;
      text += `Total XP: ${data.stats?.xp || 0}\n\n`;
      text += `Leveling up my game! 🏸`;
    } else if (data.type === "streak") {
      text = `🔥 ${data.stats?.streak || 0} Day Streak!\n\n`;
      text += `Consistency is key! Keep training every day.\n\n`;
      text += `#BadmintonTrain #Consistency`;
    }

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const renderCard = () => {
    switch (data.type) {
      case "weekly":
        return (
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-2 border-primary/20 rounded-2xl p-8 space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">My Week on BadmintonTrain</h3>
              <p className="text-muted-foreground">Tracking my progress 🏸</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-4 text-center border">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{data.stats?.matches || 0}</div>
                <div className="text-sm text-muted-foreground">Matches</div>
              </div>
              <div className="bg-card rounded-xl p-4 text-center border">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{data.stats?.wins || 0}</div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
              <div className="bg-card rounded-xl p-4 text-center border">
                <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-3xl font-bold">{data.stats?.xp || 0}</div>
                <div className="text-sm text-muted-foreground">XP Earned</div>
              </div>
              <div className="bg-card rounded-xl p-4 text-center border">
                <span className="text-3xl mb-2 block">🔥</span>
                <div className="text-3xl font-bold">{data.stats?.streak || 0}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              BadmintonTrain • Track Your Journey
            </div>
          </div>
        );

      case "achievement":
        return (
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-primary/20 via-background to-accent/20 border-2 border-primary/30 rounded-2xl p-8 space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="text-6xl">{data.achievement?.icon || "🏆"}</div>
              <h3 className="text-2xl font-bold">Achievement Unlocked!</h3>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-primary">{data.achievement?.name}</p>
                <p className="text-muted-foreground">{data.achievement?.description}</p>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              BadmintonTrain • Achieve Your Goals
            </div>
          </div>
        );

      case "milestone":
        return (
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-secondary/20 via-background to-primary/20 border-2 border-secondary/30 rounded-2xl p-8 space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-bold">Level {data.stats?.level} Reached!</h3>
              <div className="bg-card rounded-xl p-6 border">
                <Star className="w-12 h-12 text-secondary mx-auto mb-2" />
                <div className="text-4xl font-bold text-secondary">{data.stats?.xp || 0}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              BadmintonTrain • Level Up Your Game
            </div>
          </div>
        );

      case "streak":
        return (
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-destructive/20 via-background to-secondary/20 border-2 border-destructive/30 rounded-2xl p-8 space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="text-6xl">🔥</div>
              <h3 className="text-2xl font-bold">{data.stats?.streak || 0} Day Streak!</h3>
              <p className="text-lg text-muted-foreground">
                Consistency is the key to improvement
              </p>
              <div className="bg-card rounded-xl p-6 border">
                <div className="text-4xl font-bold text-destructive">{data.stats?.streak}</div>
                <div className="text-sm text-muted-foreground">Days in a row</div>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              BadmintonTrain • Build Your Streak
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Progress
          </DialogTitle>
          <DialogDescription>
            Download or copy your progress to share with friends!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {renderCard()}

          <div className="flex gap-2">
            <Button onClick={handleDownload} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Download Image
            </Button>
            <Button onClick={handleCopyText} variant="outline" className="flex-1 gap-2">
              <Copy className="w-4 h-4" />
              Copy Text
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
