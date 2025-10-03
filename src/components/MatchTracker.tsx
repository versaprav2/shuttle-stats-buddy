import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Trophy, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface Match {
  id: string;
  opponent: string;
  date: string;
  myScore: string;
  opponentScore: string;
  result: "won" | "lost";
  notes: string;
}

export const MatchTracker = () => {
  const [matches, setMatches] = useState<Match[]>([
    {
      id: "1",
      opponent: "Alex Chen",
      date: "2025-10-01",
      myScore: "21-18, 21-15",
      opponentScore: "18-21, 15-21",
      result: "won",
      notes: "Great backhand performance",
    },
    {
      id: "2",
      opponent: "Sarah Kim",
      date: "2025-09-28",
      myScore: "19-21, 18-21",
      opponentScore: "21-19, 21-18",
      result: "lost",
      notes: "Need to work on defense",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    opponent: "",
    date: "",
    myScore: "",
    opponentScore: "",
    result: "won" as "won" | "lost",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMatch: Match = {
      id: Date.now().toString(),
      ...formData,
    };
    setMatches([newMatch, ...matches]);
    setFormData({
      opponent: "",
      date: "",
      myScore: "",
      opponentScore: "",
      result: "won",
      notes: "",
    });
    setShowForm(false);
    toast.success("Match logged successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Match Tracker</h2>
          <p className="text-muted-foreground">Log and review your matches</p>
        </div>
        <Button
          variant="gradient"
          size="lg"
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Match
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border-2 border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opponent">Opponent Name</Label>
                <Input
                  id="opponent"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                  placeholder="Enter opponent name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Match Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="myScore">Your Score</Label>
                <Input
                  id="myScore"
                  value={formData.myScore}
                  onChange={(e) => setFormData({ ...formData, myScore: e.target.value })}
                  placeholder="e.g., 21-18, 21-15"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opponentScore">Opponent Score</Label>
                <Input
                  id="opponentScore"
                  value={formData.opponentScore}
                  onChange={(e) => setFormData({ ...formData, opponentScore: e.target.value })}
                  placeholder="e.g., 18-21, 15-21"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="result">Result</Label>
              <select
                id="result"
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value as "won" | "lost" })}
                className="w-full h-11 px-3 rounded-md border border-input bg-background"
              >
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes about the match..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="default" size="lg">
                Save Match
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {matches.map((match) => (
          <Card
            key={match.id}
            className={`p-6 border-2 transition-all duration-300 hover:shadow-lg ${
              match.result === "won"
                ? "border-primary/30 bg-primary/5"
                : "border-destructive/30 bg-destructive/5"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {match.result === "won" ? (
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                ) : (
                  <div className="p-2 bg-destructive/20 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-destructive" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">vs. {match.opponent}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  match.result === "won"
                    ? "bg-primary/20 text-primary"
                    : "bg-destructive/20 text-destructive"
                }`}
              >
                {match.result === "won" ? "Victory" : "Defeat"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                <p className="text-lg font-bold">{match.myScore}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Opponent Score</p>
                <p className="text-lg font-bold">{match.opponentScore}</p>
              </div>
            </div>

            {match.notes && (
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">{match.notes}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
