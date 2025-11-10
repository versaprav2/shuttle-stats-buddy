import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.progress": "Progress",
    "nav.main": "Main",
    "nav.training": "Training",
    "nav.periodization": "Periodization",
    "nav.trainingPlans": "Training Plans",
    "nav.fundamentals": "Fundamentals",
    "nav.timer": "Timer",
    "nav.trackCompete": "Track & Compete",
    "nav.matches": "Matches",
    "nav.challenges": "Challenges",
    "nav.goals": "Goals",
    "nav.achievements": "Achievements",
    "nav.coachingAnalysis": "Coaching & Analysis",
    "nav.coach": "Coach",
    "nav.recommendations": "Recommendations",
    "nav.videoReview": "Video Review",
    "nav.logout": "Logout",
    
    // Home page
    "home.hero.title": "Elevate Your Game",
    "home.hero.subtitle": "Track matches, follow structured training, and reach your badminton potential",
    "home.hero.viewPlans": "View Training Plans",
    "home.hero.practiceDrills": "Practice Drills",
    "home.features.plans.title": "Training Plans",
    "home.features.plans.desc": "Structured programs from weekly to yearly",
    "home.features.fundamentals.title": "Fundamentals",
    "home.features.fundamentals.desc": "Master essential badminton techniques",
    "home.features.achievements.title": "Achievements",
    "home.features.achievements.desc": "Unlock badges and track your progress",
    "home.cta.title": "Ready to become a better player?",
    "home.cta.subtitle": "Join thousands of badminton players who are tracking their progress and achieving their goals",
    "home.cta.button": "View Your Dashboard",
    
    // Coach page
    "coach.title": "Your Coach",
    "coach.subtitle": "Personalized coaching insights and guidance",
    "coach.alert": "These insights are based on your training history, performance data, and current goals.",
    "coach.technique": "Technique",
    "coach.strategy": "Strategy",
    "coach.physical": "Physical",
    "coach.priority.high": "high priority",
    "coach.priority.medium": "medium priority",
    "coach.areasToFocus": "Areas to focus on",
    "coach.weeklyFocus": "Weekly Focus",
    "coach.weeklyFocus.desc": "Recommended training emphasis for this week",
    "coach.techniques": "Technique Drills",
    "coach.matchPlay": "Match Play",
    "coach.conditioning": "Physical Conditioning",
    "coach.recovery": "Recovery",
    "coach.scheduleSession": "Schedule Coaching Session",
    
    // Coach insights
    "coach.insight.footwork": "Focus on footwork drills - your court coverage can improve by 15-20%",
    "coach.insight.netPlay": "Practice net play for 20 minutes daily to sharpen reactions",
    "coach.insight.backhand": "Work on backhand clear technique - aim for deeper shots",
    "coach.insight.shotPlacement": "Vary your shot placement to keep opponents guessing",
    "coach.insight.deceptive": "Use more deceptive shots in the frontcourt",
    "coach.insight.serve": "Improve serve variation - mix short and long serves",
    "coach.insight.cardio": "Add 2 cardio sessions per week for better endurance",
    "coach.insight.plyometric": "Incorporate plyometric exercises for explosive power",
    "coach.insight.core": "Focus on core strength for better stability and rotation",
    
    // Recommendations page
    "rec.title": "Recommendations",
    "rec.subtitle": "Personalized suggestions based on your progress and goals",
    "rec.whyRecommended": "Why recommended: ",
    "rec.startNow": "Start Now",
    "rec.saveForLater": "Save for Later",
    "rec.getMore": "Get More Recommendations",
    "rec.getMore.desc": "Connect with a coach or complete more training sessions to unlock personalized insights",
    "rec.updatePreferences": "Update Training Preferences",
    "rec.duration": "Duration",
    "rec.difficulty": "Difficulty",
    
    // Video Review page
    "video.title": "Video Review",
    "video.subtitle": "Upload and analyze your match recordings",
    "video.alert": "Video storage and AI analysis require Lovable Cloud. Enable Cloud in project settings to unlock full functionality.",
    "video.upload.title": "Upload Match Video",
    "video.upload.desc": "Upload a recording of your match for analysis and review",
    "video.upload.file": "Video File",
    "video.upload.opponent": "Opponent Name",
    "video.upload.opponentPlaceholder": "e.g., John Smith",
    "video.upload.matchDate": "Match Date",
    "video.upload.notes": "Notes & Observations",
    "video.upload.notesPlaceholder": "Add any notes about the match, areas to focus on, etc.",
    "video.upload.button": "Upload Video",
    "video.list.title": "Your Match Videos",
    "video.list.empty": "No videos uploaded yet",
    "video.list.emptyDesc": "Upload your first match video to get started",
    "video.list.watch": "Watch",
    "video.list.analysis": "View Analysis",
    "video.vs": "vs",
    
    // Footer
    "footer.copyright": "© 2025 BadmintonTrain. Train smarter, play better.",
    
    // Common
    "common.back": "Back",
    "common.next": "Next",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    
    // Navigation additions
    "nav.menu": "Menu",
    "nav.loggedOut": "Logged out successfully",
    
    // Dashboard
    "dashboard.title": "Performance Overview",
    "dashboard.subtitle": "Track your badminton journey",
    "dashboard.matchesPlayed": "Matches Played",
    "dashboard.winRate": "Win Rate",
    "dashboard.totalWins": "Total Wins",
    "dashboard.totalLosses": "Total Losses",
    "dashboard.winLossRatio": "Win/Loss Ratio",
    "dashboard.recentMatches": "Recent Matches",
    "dashboard.noMatches": "No matches logged yet. Start tracking your progress!",
    "dashboard.won": "Won",
    "dashboard.lost": "Lost",
    "dashboard.vs": "vs",
    "dashboard.score": "Score",
    
    // Progress Hub
    "progress.title": "Progress Hub",
    "progress.subtitle": "Your complete training overview and insights",
    "progress.momentum": "Momentum Score",
    "progress.basedOn": "Based on recent wins, activity, and consistency",
    "progress.thisWeek": "This Week",
    "progress.matches": "Matches",
    "progress.drills": "Drills",
    "progress.xpEarned": "XP Earned",
    "progress.smartInsights": "Smart Insights",
    "progress.activityHeatmap": "Activity Heatmap (Last 90 Days)",
    "progress.less": "Less",
    "progress.more": "More",
    "progress.winRateTrends": "Win Rate Trends",
    "progress.topOpponents": "Top Opponents",
    
    // Challenges
    "challenges.title": "Challenge Library",
    "challenges.subtitle": "Choose your path and push your limits",
    "challenges.active": "Active",
    "challenges.completed": "Completed",
    "challenges.availableXP": "Available XP",
    "challenges.rookie": "Rookie",
    "challenges.pro": "Pro",
    "challenges.elite": "Elite",
    "challenges.all": "All",
    "challenges.endurance": "Endurance",
    "challenges.speed": "Speed",
    "challenges.agility": "Agility",
    "challenges.consistency": "Consistency",
    "challenges.competition": "Competition",
    "challenges.activate": "Activate Challenge",
    "challenges.progress": "Progress",
    "challenges.timeLeft": "left",
    "challenges.claimReward": "Claim Reward",
    "challenges.claimed": "✓ Claimed!",
    "challenges.locked": "Locked",
    
    // Goals
    "goals.title": "Goals",
    "goals.subtitle": "Set and track your badminton goals",
    "goals.newGoal": "New Goal",
    "goals.createNew": "Create New Goal",
    "goals.createDesc": "Set a specific goal to work towards",
    "goals.goalTitle": "Goal Title",
    "goals.goalTitlePlaceholder": "e.g., Win 20 matches this month",
    "goals.goalType": "Goal Type",
    "goals.target": "Target",
    "goals.deadline": "Deadline",
    "goals.totalMatches": "Total Matches",
    "goals.matchWins": "Match Wins",
    "goals.trainingSessions": "Training Sessions",
    "goals.activityStreak": "Activity Streak",
    "goals.totalXP": "Total XP",
    "goals.activeGoals": "Active Goals",
    "goals.totalGoals": "Total Goals",
    "goals.goalAchieved": "Goal Achieved!",
    "goals.noGoals": "No goals yet",
    "goals.noGoalsDesc": "Create your first goal to start tracking your progress",
    "goals.createGoal": "Create Goal",
    "goals.achieved": "Achieved",
    
    // Match Tracker
    "matches.title": "Match Tracker",
    "matches.subtitle": "Log and analyze your matches",
    "matches.logMatch": "Log Match",
    "matches.opponent": "Opponent",
    "matches.yourScore": "Your Score",
    "matches.opponentScore": "Opponent Score",
    "matches.matchDate": "Match Date",
    "matches.notes": "Notes",
    "matches.matchType": "Match Type",
    "matches.practice": "Practice",
    "matches.tournament": "Tournament",
    "matches.casual": "Casual",
    "matches.duration": "Duration (minutes)",
    "matches.energyBefore": "Energy Before",
    "matches.energyAfter": "Energy After",
    "matches.addMatch": "Add Match",
    "matches.recentMatches": "Recent Matches",
    "matches.noMatches": "No matches recorded yet",
    "matches.startTracking": "Start tracking your matches to see your progress",
    
    // Training Plans
    "plans.title": "Training Plans",
    "plans.subtitle": "Structured programs to improve your game",
    "plans.weekly": "Weekly Plans",
    "plans.monthly": "Monthly Plans",
    "plans.longterm": "Long-term Plans",
    "plans.level": "Level",
    "plans.beginner": "Beginner",
    "plans.intermediate": "Intermediate",
    "plans.advanced": "Advanced",
    "plans.viewPlan": "View Plan",
    "plans.activatePlan": "Activate Plan",
  },
  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.dashboard": "Dashboard",
    "nav.progress": "Fortschritt",
    "nav.main": "Hauptmenü",
    "nav.training": "Training",
    "nav.periodization": "Periodisierung",
    "nav.trainingPlans": "Trainingspläne",
    "nav.fundamentals": "Grundlagen",
    "nav.timer": "Timer",
    "nav.trackCompete": "Verfolgen & Wettkampf",
    "nav.matches": "Matches",
    "nav.challenges": "Herausforderungen",
    "nav.goals": "Ziele",
    "nav.achievements": "Erfolge",
    "nav.coachingAnalysis": "Coaching & Analyse",
    "nav.coach": "Coach",
    "nav.recommendations": "Empfehlungen",
    "nav.videoReview": "Videoanalyse",
    "nav.logout": "Abmelden",
    
    // Home page
    "home.hero.title": "Verbessere Dein Spiel",
    "home.hero.subtitle": "Verfolge Matches, folge strukturiertem Training und erreiche dein Badminton-Potenzial",
    "home.hero.viewPlans": "Trainingspläne Ansehen",
    "home.hero.practiceDrills": "Übungen Praktizieren",
    "home.features.plans.title": "Trainingspläne",
    "home.features.plans.desc": "Strukturierte Programme von wöchentlich bis jährlich",
    "home.features.fundamentals.title": "Grundlagen",
    "home.features.fundamentals.desc": "Meistere wesentliche Badminton-Techniken",
    "home.features.achievements.title": "Erfolge",
    "home.features.achievements.desc": "Schalte Abzeichen frei und verfolge deinen Fortschritt",
    "home.cta.title": "Bereit, ein besserer Spieler zu werden?",
    "home.cta.subtitle": "Tausende Badminton-Spieler verfolgen bereits ihren Fortschritt und erreichen ihre Ziele",
    "home.cta.button": "Dein Dashboard Ansehen",
    
    // Coach page
    "coach.title": "Dein Coach",
    "coach.subtitle": "Personalisierte Coaching-Einblicke und Anleitung",
    "coach.alert": "Diese Einblicke basieren auf deiner Trainingshistorie, Leistungsdaten und aktuellen Zielen.",
    "coach.technique": "Technik",
    "coach.strategy": "Strategie",
    "coach.physical": "Körperlich",
    "coach.priority.high": "hohe Priorität",
    "coach.priority.medium": "mittlere Priorität",
    "coach.areasToFocus": "Fokus-Bereiche",
    "coach.weeklyFocus": "Wochenfokus",
    "coach.weeklyFocus.desc": "Empfohlener Trainingsschwerpunkt für diese Woche",
    "coach.techniques": "Technik-Übungen",
    "coach.matchPlay": "Match-Spiel",
    "coach.conditioning": "Körperliche Konditionierung",
    "coach.recovery": "Erholung",
    "coach.scheduleSession": "Coaching-Sitzung Planen",
    
    // Coach insights
    "coach.insight.footwork": "Fokus auf Beinarbeit - deine Platzabdeckung kann sich um 15-20% verbessern",
    "coach.insight.netPlay": "Übe täglich 20 Minuten Netzspiel, um Reaktionen zu schärfen",
    "coach.insight.backhand": "Arbeite an der Rückhand-Clear-Technik - ziele auf tiefere Schläge",
    "coach.insight.shotPlacement": "Variiere deine Schlagplatzierung, um Gegner zu überraschen",
    "coach.insight.deceptive": "Nutze mehr täuschende Schläge im Vorderfeld",
    "coach.insight.serve": "Verbessere Aufschlagvariation - mische kurze und lange Aufschläge",
    "coach.insight.cardio": "Füge 2 Cardio-Einheiten pro Woche für bessere Ausdauer hinzu",
    "coach.insight.plyometric": "Integriere plyometrische Übungen für explosive Kraft",
    "coach.insight.core": "Fokussiere auf Rumpfkraft für bessere Stabilität und Rotation",
    
    // Recommendations page
    "rec.title": "Empfehlungen",
    "rec.subtitle": "Personalisierte Vorschläge basierend auf deinem Fortschritt und deinen Zielen",
    "rec.whyRecommended": "Warum empfohlen: ",
    "rec.startNow": "Jetzt Starten",
    "rec.saveForLater": "Für Später Speichern",
    "rec.getMore": "Mehr Empfehlungen Erhalten",
    "rec.getMore.desc": "Verbinde dich mit einem Coach oder absolviere mehr Trainingseinheiten, um personalisierte Einblicke freizuschalten",
    "rec.updatePreferences": "Trainings-Einstellungen Aktualisieren",
    "rec.duration": "Dauer",
    "rec.difficulty": "Schwierigkeit",
    
    // Video Review page
    "video.title": "Videoanalyse",
    "video.subtitle": "Lade Match-Aufnahmen hoch und analysiere sie",
    "video.alert": "Videospeicherung und KI-Analyse erfordern Lovable Cloud. Aktiviere Cloud in den Projekteinstellungen, um die volle Funktionalität freizuschalten.",
    "video.upload.title": "Match-Video Hochladen",
    "video.upload.desc": "Lade eine Aufnahme deines Matches zur Analyse und Überprüfung hoch",
    "video.upload.file": "Video-Datei",
    "video.upload.opponent": "Gegner-Name",
    "video.upload.opponentPlaceholder": "z.B. Max Mustermann",
    "video.upload.matchDate": "Match-Datum",
    "video.upload.notes": "Notizen & Beobachtungen",
    "video.upload.notesPlaceholder": "Füge Notizen zum Match, Fokus-Bereiche usw. hinzu",
    "video.upload.button": "Video Hochladen",
    "video.list.title": "Deine Match-Videos",
    "video.list.empty": "Noch keine Videos hochgeladen",
    "video.list.emptyDesc": "Lade dein erstes Match-Video hoch, um zu beginnen",
    "video.list.watch": "Ansehen",
    "video.list.analysis": "Analyse Ansehen",
    "video.vs": "gegen",
    
    // Footer
    "footer.copyright": "© 2025 BadmintonTrain. Trainiere smarter, spiele besser.",
    
    // Common
    "common.back": "Zurück",
    "common.next": "Weiter",
    "common.close": "Schließen",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.delete": "Löschen",
    
    // Navigation additions
    "nav.menu": "Menü",
    "nav.loggedOut": "Erfolgreich abgemeldet",
    
    // Dashboard
    "dashboard.title": "Leistungsübersicht",
    "dashboard.subtitle": "Verfolge deine Badminton-Reise",
    "dashboard.matchesPlayed": "Gespielte Matches",
    "dashboard.winRate": "Siegquote",
    "dashboard.totalWins": "Gesamtsiege",
    "dashboard.totalLosses": "Gesamtverluste",
    "dashboard.winLossRatio": "Sieg/Niederlage-Verhältnis",
    "dashboard.recentMatches": "Letzte Matches",
    "dashboard.noMatches": "Noch keine Matches protokolliert. Beginne deinen Fortschritt zu verfolgen!",
    "dashboard.won": "Gewonnen",
    "dashboard.lost": "Verloren",
    "dashboard.vs": "gegen",
    "dashboard.score": "Punktzahl",
    
    // Progress Hub
    "progress.title": "Fortschritts-Hub",
    "progress.subtitle": "Deine vollständige Trainingsübersicht und Einblicke",
    "progress.momentum": "Momentum-Punktzahl",
    "progress.basedOn": "Basierend auf letzten Siegen, Aktivität und Beständigkeit",
    "progress.thisWeek": "Diese Woche",
    "progress.matches": "Matches",
    "progress.drills": "Übungen",
    "progress.xpEarned": "XP Verdient",
    "progress.smartInsights": "Smarte Einblicke",
    "progress.activityHeatmap": "Aktivitätskarte (Letzte 90 Tage)",
    "progress.less": "Weniger",
    "progress.more": "Mehr",
    "progress.winRateTrends": "Siegquoten-Trends",
    "progress.topOpponents": "Top-Gegner",
    
    // Challenges
    "challenges.title": "Herausforderungs-Bibliothek",
    "challenges.subtitle": "Wähle deinen Weg und überschreite deine Grenzen",
    "challenges.active": "Aktiv",
    "challenges.completed": "Abgeschlossen",
    "challenges.availableXP": "Verfügbare XP",
    "challenges.rookie": "Anfänger",
    "challenges.pro": "Profi",
    "challenges.elite": "Elite",
    "challenges.all": "Alle",
    "challenges.endurance": "Ausdauer",
    "challenges.speed": "Geschwindigkeit",
    "challenges.agility": "Agilität",
    "challenges.consistency": "Beständigkeit",
    "challenges.competition": "Wettkampf",
    "challenges.activate": "Herausforderung Aktivieren",
    "challenges.progress": "Fortschritt",
    "challenges.timeLeft": "übrig",
    "challenges.claimReward": "Belohnung Einfordern",
    "challenges.claimed": "✓ Eingefordert!",
    "challenges.locked": "Gesperrt",
    
    // Goals
    "goals.title": "Ziele",
    "goals.subtitle": "Setze und verfolge deine Badminton-Ziele",
    "goals.newGoal": "Neues Ziel",
    "goals.createNew": "Neues Ziel Erstellen",
    "goals.createDesc": "Setze ein spezifisches Ziel, auf das du hinarbeiten möchtest",
    "goals.goalTitle": "Zieltitel",
    "goals.goalTitlePlaceholder": "z.B. 20 Matches diesen Monat gewinnen",
    "goals.goalType": "Zieltyp",
    "goals.target": "Ziel",
    "goals.deadline": "Frist",
    "goals.totalMatches": "Gesamte Matches",
    "goals.matchWins": "Match-Siege",
    "goals.trainingSessions": "Trainingseinheiten",
    "goals.activityStreak": "Aktivitäts-Serie",
    "goals.totalXP": "Gesamt-XP",
    "goals.activeGoals": "Aktive Ziele",
    "goals.totalGoals": "Gesamtziele",
    "goals.goalAchieved": "Ziel Erreicht!",
    "goals.noGoals": "Noch keine Ziele",
    "goals.noGoalsDesc": "Erstelle dein erstes Ziel, um deinen Fortschritt zu verfolgen",
    "goals.createGoal": "Ziel Erstellen",
    "goals.achieved": "Erreicht",
    
    // Match Tracker
    "matches.title": "Match-Tracker",
    "matches.subtitle": "Protokolliere und analysiere deine Matches",
    "matches.logMatch": "Match Protokollieren",
    "matches.opponent": "Gegner",
    "matches.yourScore": "Deine Punktzahl",
    "matches.opponentScore": "Gegner-Punktzahl",
    "matches.matchDate": "Match-Datum",
    "matches.notes": "Notizen",
    "matches.matchType": "Match-Typ",
    "matches.practice": "Training",
    "matches.tournament": "Turnier",
    "matches.casual": "Freundschaft",
    "matches.duration": "Dauer (Minuten)",
    "matches.energyBefore": "Energie Vorher",
    "matches.energyAfter": "Energie Nachher",
    "matches.addMatch": "Match Hinzufügen",
    "matches.recentMatches": "Letzte Matches",
    "matches.noMatches": "Noch keine Matches aufgezeichnet",
    "matches.startTracking": "Beginne deine Matches zu verfolgen, um deinen Fortschritt zu sehen",
    
    // Training Plans
    "plans.title": "Trainingspläne",
    "plans.subtitle": "Strukturierte Programme zur Verbesserung deines Spiels",
    "plans.weekly": "Wochenpläne",
    "plans.monthly": "Monatspläne",
    "plans.longterm": "Langzeitpläne",
    "plans.level": "Niveau",
    "plans.beginner": "Anfänger",
    "plans.intermediate": "Fortgeschritten",
    "plans.advanced": "Experte",
    "plans.viewPlan": "Plan Ansehen",
    "plans.activatePlan": "Plan Aktivieren",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("appLanguage");
    return (saved === "de" || saved === "en") ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
