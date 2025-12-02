import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Trophy, Timer, Calendar, Award } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { Dashboard } from "@/components/Dashboard";
import { MatchTracker } from "@/components/MatchTracker";
import { TrainingPrograms } from "@/components/TrainingPrograms";
import { TrainingPlans } from "@/components/TrainingPlans";
import { WorkoutTimerManager } from "@/components/WorkoutTimerManager";
import { Achievements } from "@/components/Achievements";
import { Onboarding } from "@/components/Onboarding";
import { QuickActions } from "@/components/QuickActions";
import { MilestoneCelebration, checkMilestones } from "@/components/MilestoneCelebration";
import { ShareProgress } from "@/components/ShareProgress";
import { ProgressHub } from "@/components/ProgressHub";
import Challenges from "@/components/Challenges";
import { Goals } from "@/components/Goals";
import { PeriodizationHub } from "@/components/PeriodizationHub";
import { Coach } from "@/components/Coach";
import { Recommendations } from "@/components/Recommendations";
import { VideoReview } from "@/components/VideoReview";
import heroImage from "@/assets/hero-badminton.jpg";
import { toast } from "sonner";
import { useGamification } from "@/hooks/useGamification";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

type View = "home" | "dashboard" | "progress" | "challenges" | "goals" | "matches" | "plans" | "fundamentals" | "timer" | "achievements" | "periodization" | "coach" | "recommendations" | "video-review";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [milestone, setMilestone] = useState<any>(null);
  const [shareData, setShareData] = useState<any>(null);
  const { addXP, updateStreak } = useGamification();
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if onboarding completed
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }

    // Check for milestones
    const detectedMilestone = checkMilestones();
    if (detectedMilestone) {
      setMilestone(detectedMilestone);
      if (detectedMilestone.xp) {
        addXP(detectedMilestone.xp);
      }
    }

    // Update streak
    updateStreak();
  }, []);

  const handleQuickAction = (action: "match" | "timer" | "drill") => {
    switch (action) {
      case "match":
        setCurrentView("matches");
        toast.info("Quick log a match!");
        break;
      case "timer":
        setCurrentView("timer");
        toast.info("Timer ready!");
        break;
      case "drill":
        setCurrentView("fundamentals");
        toast.info("Choose a drill to complete!");
        break;
    }
  };

  const handleShareMilestone = () => {
    if (milestone) {
      setShareData({
        type: milestone.type === "level" ? "milestone" : milestone.type,
        stats: milestone.xp ? { xp: milestone.xp, level: Math.floor(parseInt(localStorage.getItem("userXP") || "0") / 500) + 1 } : {},
        achievement: milestone.type === "achievement" ? { name: milestone.title, description: milestone.message } : undefined,
      });
    }
  };


  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "progress":
        return <ProgressHub />;
      case "challenges":
        return <Challenges />;
      case "goals":
        return <Goals />;
      case "matches":
        return <MatchTracker />;
      case "plans":
        return <TrainingPlans />;
      case "fundamentals":
        return <TrainingPrograms />;
      case "timer":
        return <WorkoutTimerManager />;
      case "achievements":
        return <Achievements />;
      case "periodization":
        return <PeriodizationHub />;
      case "coach":
        return <Coach />;
      case "recommendations":
        return <Recommendations />;
      case "video-review":
        return <VideoReview />;
      default:
        return (
          <div className="space-y-8 sm:space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90 z-10" />
              <img
                src={heroImage}
                alt="Badminton training"
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center space-y-4 sm:space-y-6 px-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-lg">
                    {t("home.hero.title")}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto">
                    {t("home.hero.subtitle")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Button
                      variant="energy"
                      size="lg"
                      onClick={() => setCurrentView("plans")}
                      className="text-base sm:text-lg w-full sm:w-auto"
                    >
                      {t("home.hero.viewPlans")}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentView("fundamentals")}
                      className="text-base sm:text-lg bg-white/10 text-white border-white hover:bg-white hover:text-primary backdrop-blur-sm w-full sm:w-auto"
                    >
                      {t("home.hero.practiceDrills")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer group" onClick={() => setCurrentView("plans")}>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl w-fit mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{t("home.features.plans.title")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("home.features.plans.desc")}
                </p>
              </Card>

              <Card className="p-4 sm:p-6 border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl cursor-pointer group" onClick={() => setCurrentView("fundamentals")}>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-secondary/10 to-orange-500/10 rounded-xl w-fit mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{t("home.features.fundamentals.title")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("home.features.fundamentals.desc")}
                </p>
              </Card>

              <Card className="p-4 sm:p-6 border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl cursor-pointer group sm:col-span-2 lg:col-span-1" onClick={() => setCurrentView("achievements")}>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl w-fit mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{t("home.features.achievements.title")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("home.features.achievements.desc")}
                </p>
              </Card>
            </div>

            {/* CTA Section */}
            <Card className="p-6 sm:p-8 md:p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-2 border-primary/20 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t("home.cta.title")}</h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">
                {t("home.cta.subtitle")}
              </p>
              <Button variant="gradient" size="lg" onClick={() => setCurrentView("dashboard")} className="text-base sm:text-lg w-full sm:w-auto">
                {t("home.cta.button")}
              </Button>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-primary/5 to-background">
      <TopNav currentView={currentView} onViewChange={setCurrentView} />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 sm:py-6 mt-8 sm:mt-12">
        <div className="container mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>{t("footer.copyright")}</p>
        </div>
      </footer>

      {/* Quick Actions FAB */}
      <QuickActions onAction={handleQuickAction} />

      {/* Onboarding Modal */}
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

      {/* Milestone Celebration */}
      <MilestoneCelebration
        milestone={milestone}
        onClose={() => setMilestone(null)}
        onShare={handleShareMilestone}
      />

      {/* Share Progress Dialog */}
      {shareData && (
        <ShareProgress
          open={!!shareData}
          onClose={() => setShareData(null)}
          data={shareData}
        />
      )}
    </div>
  );
};

export default Index;
