import { useState } from "react";
import { Plus, Trophy, Timer, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  onAction: (action: "match" | "timer" | "drill") => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: "match" as const, label: "Log Match", icon: Trophy, color: "bg-primary" },
    { id: "timer" as const, label: "Start Timer", icon: Timer, color: "bg-secondary" },
    { id: "drill" as const, label: "Complete Drill", icon: Target, color: "bg-accent" },
  ];

  const handleAction = (actionId: "match" | "timer" | "drill") => {
    onAction(actionId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div
        className={cn(
          "flex flex-col-reverse gap-3 mb-3 transition-all duration-300",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {actions.map((action, index) => (
          <Button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={cn(
              "gap-2 shadow-lg hover:shadow-xl transition-all duration-200",
              "animate-in slide-in-from-bottom-4",
              action.color
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
            size="lg"
          >
            <action.icon className="w-5 h-5" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-primary hover:bg-primary/90",
          isOpen && "rotate-45"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
