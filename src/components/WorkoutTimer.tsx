import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Volume2, 
  VolumeX,
  Timer as TimerIcon,
  Zap,
  Coffee
} from "lucide-react";
import { toast } from "sonner";

interface TimerSettings {
  timerName: string;
  workDuration: number;
  restDuration: number;
  rounds: number;
  prepTime: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  autoStart: boolean;
  workIntervals: number;
  longRestDuration: number;
  longRestAfter: number;
  countdownWarning: number;
  timerMode: "standard" | "tabata" | "emom" | "session" | "custom";
  sessionTotalMinutes: number;
  sessionIntervals: number;
  sessionPauseSeconds: number;
}

type TimerPhase = "prep" | "work" | "rest" | "longrest" | "completed";

export const WorkoutTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>({
    timerName: "My Workout",
    workDuration: 40,
    restDuration: 20,
    rounds: 8,
    prepTime: 10,
    soundEnabled: true,
    voiceEnabled: true,
    autoStart: true,
    workIntervals: 1,
    longRestDuration: 60,
    longRestAfter: 4,
    countdownWarning: 3,
    timerMode: "standard",
    sessionTotalMinutes: 45,
    sessionIntervals: 15,
    sessionPauseSeconds: 120,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>("prep");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(settings.prepTime);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (settings.soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [settings.soundEnabled]);

  const playBeep = (frequency: number, duration: number, delay: number = 0) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    
    const startTime = ctx.currentTime + delay;
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const playMultipleBeeps = (count: number, frequency: number) => {
    for (let i = 0; i < count; i++) {
      playBeep(frequency, 0.15, i * 0.3);
    }
  };

  const playStartSequence = () => {
    playBeep(600, 0.2, 0);
    playBeep(800, 0.2, 0.3);
    playBeep(1000, 0.3, 0.6);
  };

  const speak = (text: string) => {
    if (!settings.voiceEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // Warning beeps - 3 seconds before end
          if (newTime === 3) {
            playBeep(800, 0.1, 0);
          } else if (newTime === 2) {
            playBeep(800, 0.1, 0);
          } else if (newTime === 1) {
            playBeep(800, 0.1, 0);
          }
          
          // Phase end - 3 beeps
          if (newTime === 0) {
            playMultipleBeeps(3, 1200);
          }
          
          return newTime;
        });
      }, 1000);
    }

    if (timeRemaining === 0 && isRunning) {
      handlePhaseChange();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentPhase, currentRound, currentInterval]);

  const handlePhaseChange = () => {
    if (currentPhase === "prep") {
      setCurrentPhase("work");
      setTimeRemaining(settings.workDuration);
      toast.info("Work Time!", { description: "Give it your all!" });
      speak("Work time");
    } else if (currentPhase === "work") {
      if (currentInterval < settings.workIntervals) {
        setCurrentInterval(currentInterval + 1);
        setCurrentPhase("rest");
        setTimeRemaining(settings.restDuration);
        toast.success("Rest Time", { description: "Catch your breath" });
        speak("Rest");
      } else if (currentRound < settings.rounds) {
        const shouldTakeLongRest = 
          settings.longRestAfter > 0 && 
          currentRound % settings.longRestAfter === 0;
        
        if (shouldTakeLongRest) {
          setCurrentPhase("longrest");
          setTimeRemaining(settings.longRestDuration);
          toast.success("Long Rest", { description: "Well deserved break!" });
          speak("Long rest");
        } else {
          setCurrentPhase("rest");
          setTimeRemaining(settings.restDuration);
          toast.success("Rest Time", { description: "Catch your breath" });
          speak("Rest");
        }
      } else {
        setCurrentPhase("completed");
        setIsRunning(false);
        toast.success("Workout Complete! 🎉", { 
          description: "Great job! You crushed it!" 
        });
        speak("Workout complete! Great job!");
        playBeep(1000, 0.3);
        return;
      }
    } else if (currentPhase === "rest" || currentPhase === "longrest") {
      setCurrentRound(currentRound + 1);
      setCurrentInterval(1);
      if (settings.autoStart) {
        setCurrentPhase("work");
        setTimeRemaining(settings.workDuration);
        toast.info(`Round ${currentRound + 1}`, { description: "Let's go!" });
        speak(`Round ${currentRound + 1}`);
      } else {
        setIsRunning(false);
        setCurrentPhase("work");
        setTimeRemaining(settings.workDuration);
      }
    }
  };

  const handleStart = () => {
    if (currentPhase === "completed") {
      handleReset();
    }
    playStartSequence();
    setIsRunning(true);
    toast.success("Timer Started!", { description: "Let's go! 💪" });
    speak(`Starting ${settings.timerName}. Get ready!`);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhase("prep");
    setCurrentRound(1);
    setCurrentInterval(1);
    setTimeRemaining(settings.prepTime);
  };

  const calculateSessionSettings = () => {
    const totalSeconds = settings.sessionTotalMinutes * 60;
    const pauseSeconds = settings.sessionPauseSeconds;
    const intervals = settings.sessionIntervals;
    
    // Total pause time
    const totalPauseTime = pauseSeconds * (intervals - 1);
    // Remaining time for work intervals
    const totalWorkTime = totalSeconds - totalPauseTime;
    // Each work interval duration
    const workDuration = Math.floor(totalWorkTime / intervals);
    
    return {
      workDuration,
      restDuration: pauseSeconds,
      rounds: intervals,
    };
  };

  const applyPreset = (mode: string) => {
    switch (mode) {
      case "session":
        const sessionCalc = calculateSessionSettings();
        setSettings({
          ...settings,
          workDuration: sessionCalc.workDuration,
          restDuration: sessionCalc.restDuration,
          rounds: sessionCalc.rounds,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 0,
          timerMode: "session",
        });
        toast.success("Session Mode", {
          description: `${settings.sessionIntervals} intervals of ${Math.floor(sessionCalc.workDuration / 60)}m ${sessionCalc.workDuration % 60}s work + ${Math.floor(sessionCalc.restDuration / 60)}m pause`,
        });
        break;
      case "tabata":
        setSettings({
          ...settings,
          workDuration: 20,
          restDuration: 10,
          rounds: 8,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 0,
          timerMode: "tabata",
        });
        break;
      case "emom":
        setSettings({
          ...settings,
          workDuration: 60,
          restDuration: 0,
          rounds: 10,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 0,
          timerMode: "emom",
        });
        break;
      case "standard":
      default:
        setSettings({
          ...settings,
          workDuration: 40,
          restDuration: 20,
          rounds: 8,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 4,
          longRestDuration: 60,
          timerMode: "standard",
        });
    }
    handleReset();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "prep":
        return "text-accent";
      case "work":
        return "text-primary";
      case "rest":
        return "text-secondary";
      case "longrest":
        return "text-secondary";
      case "completed":
        return "text-primary";
      default:
        return "";
    }
  };

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case "work":
        return <Zap className="w-8 h-8" />;
      case "rest":
      case "longrest":
        return <Coffee className="w-8 h-8" />;
      default:
        return <TimerIcon className="w-8 h-8" />;
    }
  };

  const getProgress = () => {
    const totalTime = (() => {
      switch (currentPhase) {
        case "prep":
          return settings.prepTime;
        case "work":
          return settings.workDuration;
        case "rest":
          return settings.restDuration;
        case "longrest":
          return settings.longRestDuration;
        default:
          return 100;
      }
    })();
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  return (
    <Card className="p-8 border-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{settings.timerName}</h2>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
                <DialogDescription>
                  Customize your workout timer with all available options
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <Label>Timer Name</Label>
                  <Input
                    type="text"
                    value={settings.timerName}
                    onChange={(e) =>
                      setSettings({ ...settings, timerName: e.target.value })
                    }
                    placeholder="Enter timer name"
                  />
                </div>

                <div>
                  <Label>Timer Mode</Label>
                  <Select
                    value={settings.timerMode}
                    onValueChange={(value) => applyPreset(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Intervals</SelectItem>
                      <SelectItem value="session">Session Mode (Auto-calculate)</SelectItem>
                      <SelectItem value="tabata">Tabata (20/10)</SelectItem>
                      <SelectItem value="emom">EMOM (Every Minute)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.timerMode === "session" && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <h4 className="font-semibold mb-3">Session Settings</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Total Minutes</Label>
                        <Input
                          type="number"
                          value={settings.sessionTotalMinutes}
                          onChange={(e) => {
                            setSettings({ ...settings, sessionTotalMinutes: Number(e.target.value) });
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Intervals</Label>
                        <Input
                          type="number"
                          value={settings.sessionIntervals}
                          onChange={(e) => {
                            setSettings({ ...settings, sessionIntervals: Number(e.target.value) });
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Pause (sec)</Label>
                        <Input
                          type="number"
                          value={settings.sessionPauseSeconds}
                          onChange={(e) => {
                            setSettings({ ...settings, sessionPauseSeconds: Number(e.target.value) });
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => applyPreset("session")}
                    >
                      Calculate & Apply
                    </Button>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Work Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.workDuration}
                      onChange={(e) =>
                        setSettings({ ...settings, workDuration: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Rest Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.restDuration}
                      onChange={(e) =>
                        setSettings({ ...settings, restDuration: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Number of Rounds</Label>
                    <Input
                      type="number"
                      value={settings.rounds}
                      onChange={(e) =>
                        setSettings({ ...settings, rounds: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Preparation Time (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.prepTime}
                      onChange={(e) =>
                        setSettings({ ...settings, prepTime: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Work Intervals per Round</Label>
                    <Input
                      type="number"
                      value={settings.workIntervals}
                      onChange={(e) =>
                        setSettings({ ...settings, workIntervals: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Long Rest Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.longRestDuration}
                      onChange={(e) =>
                        setSettings({ ...settings, longRestDuration: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Long Rest After (rounds)</Label>
                    <Input
                      type="number"
                      value={settings.longRestAfter}
                      onChange={(e) =>
                        setSettings({ ...settings, longRestAfter: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Countdown Warning (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.countdownWarning}
                      onChange={(e) =>
                        setSettings({ ...settings, countdownWarning: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Sound Notifications</Label>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, soundEnabled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Voice Announcements</Label>
                    <Switch
                      checked={settings.voiceEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, voiceEnabled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Auto-start Next Round</Label>
                    <Switch
                      checked={settings.autoStart}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, autoStart: checked })
                      }
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => {
                    handleReset();
                    setSettingsOpen(false);
                    toast.success("Settings saved!");
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-center space-y-4">
          <div className={`flex items-center justify-center gap-3 ${getPhaseColor()}`}>
            {getPhaseIcon()}
            <Badge variant="outline" className="text-lg px-4 py-2">
              {currentPhase === "prep" && "Get Ready"}
              {currentPhase === "work" && `Work - Round ${currentRound}/${settings.rounds}`}
              {currentPhase === "rest" && "Rest"}
              {currentPhase === "longrest" && "Long Rest"}
              {currentPhase === "completed" && "Complete!"}
            </Badge>
          </div>

          <div className={`text-8xl font-bold tabular-nums ${getPhaseColor()}`}>
            {formatTime(timeRemaining)}
          </div>

          <Progress value={getProgress()} className="h-3" />

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div>Interval: {currentInterval}/{settings.workIntervals}</div>
            <div>•</div>
            <div>Round: {currentRound}/{settings.rounds}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <Button
              size="lg"
              variant="gradient"
              onClick={handleStart}
              className="px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              {currentPhase === "completed" ? "Restart" : "Start"}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={handlePause}
              className="px-8"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() =>
              setSettings({ ...settings, soundEnabled: !settings.soundEnabled })
            }
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
