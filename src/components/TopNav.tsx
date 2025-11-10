import { useState } from "react";
import {
  Activity,
  Trophy,
  Target,
  Timer,
  Calendar,
  Award,
  BarChart3,
  Flame,
  Flag,
  Home,
  LogOut,
  User,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  Video,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type View =
  | "home"
  | "dashboard"
  | "progress"
  | "challenges"
  | "goals"
  | "matches"
  | "plans"
  | "fundamentals"
  | "timer"
  | "achievements"
  | "periodization"
  | "coach"
  | "recommendations"
  | "video-review";

interface TopNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function TopNav({ currentView, onViewChange }: TopNavProps) {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success(t("nav.loggedOut"));
  };

  const mainItems = [
    { id: "home" as View, labelKey: "nav.home", icon: Home },
    { id: "dashboard" as View, labelKey: "nav.dashboard", icon: Activity },
    { id: "progress" as View, labelKey: "nav.progress", icon: BarChart3 },
  ];

  const trainingItems = [
    { id: "periodization" as View, labelKey: "nav.periodization", icon: TrendingUp },
    { id: "plans" as View, labelKey: "nav.trainingPlans", icon: Calendar },
    { id: "fundamentals" as View, labelKey: "nav.fundamentals", icon: Target },
    { id: "timer" as View, labelKey: "nav.timer", icon: Timer },
  ];

  const trackingItems = [
    { id: "matches" as View, labelKey: "nav.matches", icon: Trophy },
    { id: "challenges" as View, labelKey: "nav.challenges", icon: Flame },
    { id: "goals" as View, labelKey: "nav.goals", icon: Flag },
    { id: "achievements" as View, labelKey: "nav.achievements", icon: Award },
  ];

  const coachingItems = [
    { id: "coach" as View, labelKey: "nav.coach", icon: MessageSquare },
    { id: "recommendations" as View, labelKey: "nav.recommendations", icon: Lightbulb },
    { id: "video-review" as View, labelKey: "nav.videoReview", icon: Video },
  ];

  const allItems = [...mainItems, ...trainingItems, ...trackingItems, ...coachingItems];

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "space-y-2" : "flex items-center gap-1"}>
      {mainItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            size={mobile ? "default" : "sm"}
            onClick={() => {
              onViewChange(item.id);
              setMobileMenuOpen(false);
            }}
            className={mobile ? "w-full justify-start" : ""}
          >
            <Icon className="w-4 h-4 mr-2" />
            {t(item.labelKey)}
          </Button>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onViewChange("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
              BadmintonTrain
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavItems />
            
            {/* Dropdowns for other sections */}
            <div className="flex items-center gap-1">
              {[...trainingItems, ...trackingItems, ...coachingItems].map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {t(item.labelKey)}
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle - Desktop */}
            <div className="hidden md:flex items-center gap-2 mr-2">
              <Languages className="w-4 h-4" />
              <Label htmlFor="lang-toggle" className="text-sm cursor-pointer">
                {language === "en" ? "EN" : "DE"}
              </Label>
              <Switch
                id="lang-toggle"
                checked={language === "de"}
                onCheckedChange={(checked) => {
                  setLanguage(checked ? "de" : "en");
                  toast.success(
                    checked
                      ? "Sprache auf Deutsch geändert"
                      : "Language changed to English"
                  );
                }}
              />
            </div>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <User className="w-4 h-4" />
                <span className="text-sm truncate max-w-[150px]">{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{t("nav.menu")}</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Main */}
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                      {t("nav.main")}
                    </h3>
                    <div className="space-y-1">
                      {mainItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={currentView === item.id ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => {
                              onViewChange(item.id);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {t(item.labelKey)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Training */}
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                      {t("nav.training")}
                    </h3>
                    <div className="space-y-1">
                      {trainingItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={currentView === item.id ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => {
                              onViewChange(item.id);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {t(item.labelKey)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Track & Compete */}
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                      {t("nav.trackCompete")}
                    </h3>
                    <div className="space-y-1">
                      {trackingItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={currentView === item.id ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => {
                              onViewChange(item.id);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {t(item.labelKey)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Coaching */}
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                      {t("nav.coachingAnalysis")}
                    </h3>
                    <div className="space-y-1">
                      {coachingItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={currentView === item.id ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => {
                              onViewChange(item.id);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {t(item.labelKey)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Language Toggle - Mobile */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        <Label htmlFor="lang-toggle-mobile" className="text-sm cursor-pointer">
                          {language === "en" ? "English" : "Deutsch"}
                        </Label>
                      </div>
                      <Switch
                        id="lang-toggle-mobile"
                        checked={language === "de"}
                        onCheckedChange={(checked) => {
                          setLanguage(checked ? "de" : "en");
                          toast.success(
                            checked
                              ? "Sprache auf Deutsch geändert"
                              : "Language changed to English"
                          );
                        }}
                      />
                    </div>
                  </div>

                  {/* User Info - Mobile */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                      <User className="w-4 h-4" />
                      <span className="text-sm truncate">{user?.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("nav.logout")}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
