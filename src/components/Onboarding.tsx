import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trophy, Target, Heart, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const totalSteps = 4;

  const handleComplete = () => {
    localStorage.setItem("onboardingComplete", "true");
    if (goal) {
      localStorage.setItem("userGoal", goal);
    }
    onComplete();
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
          </div>
          <DialogTitle className="text-2xl">
            {step === 1 && "Welcome to BadmintonTrain! 🏸"}
            {step === 2 && "What's your main goal?"}
            {step === 3 && "Key Features"}
            {step === 4 && "You're all set!"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <DialogDescription className="text-base">
                Your ultimate companion for tracking matches, training sessions, and achieving your badminton goals.
              </DialogDescription>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">What you can do:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Track matches and analyze your performance
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Follow structured training plans
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Earn achievements and level up
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Share your progress with others
                  </li>
                </ul>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <DialogDescription>
                Let's personalize your experience. What brings you here?
              </DialogDescription>
              <RadioGroup value={goal} onValueChange={setGoal}>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="compete" id="compete" />
                  <Label htmlFor="compete" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Win Tournaments</div>
                      <div className="text-sm text-muted-foreground">Competitive training focus</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="improve" id="improve" />
                  <Label htmlFor="improve" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Target className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-semibold">Improve Skills</div>
                      <div className="text-sm text-muted-foreground">Master the fundamentals</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="fitness" id="fitness" />
                  <Label htmlFor="fitness" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <Heart className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <div className="font-semibold">Stay Active & Fit</div>
                      <div className="text-sm text-muted-foreground">Fitness and recreation</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <DialogDescription>
                Here's what makes BadmintonTrain special:
              </DialogDescription>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Smart Analytics
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Track win rates, identify patterns, and get personalized insights to improve faster.
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Gamification
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Earn XP, unlock achievements, complete challenges, and level up your game.
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🏋️</span>
                    Training Plans
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Follow structured weekly, monthly, and yearly plans tailored to your level.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <DialogDescription className="text-base">
                You're ready to start your badminton journey!
              </DialogDescription>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-medium">Quick tip:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the Quick Actions button (bottom-right corner) to quickly log matches, start timers, or complete drills.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-0">
          {step > 1 && step < totalSteps && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleComplete}>
            Skip
          </Button>
          <Button onClick={handleNext}>
            {step === totalSteps ? "Get Started" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
