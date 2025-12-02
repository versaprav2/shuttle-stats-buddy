// Library of common badminton drills and exercises
export const badmintonDrillCategories = {
  footwork: [
    "Plitstep",
    "Shadow footwork",
    "Six-corner footwork",
    "Forward-backward movement",
    "Lateral movement",
    "Multi-directional footwork",
    "Ladder drills",
    "Cone drills"
  ],
  technique: [
    "Clear practice",
    "Drop shot practice",
    "Smash practice",
    "Net shots",
    "Drive practice",
    "Backhand technique",
    "Forehand technique",
    "Serving practice"
  ],
  speed: [
    "Speed smash",
    "Rapid net kills",
    "Quick drives",
    "Fast exchanges",
    "Reaction drills",
    "Speed footwork",
    "Agility ladder",
    "Sprint intervals"
  ],
  endurance: [
    "Multi-shuttle feeding",
    "Continuous rallies",
    "Circuit training",
    "Interval training",
    "Long rallies",
    "Aerobic shuttles",
    "Stamina drills",
    "Cardio footwork"
  ],
  strength: [
    "Resistance band training",
    "Core exercises",
    "Jump training",
    "Leg strengthening",
    "Arm strengthening",
    "Shoulder stability",
    "Wrist strengthening",
    "Power training"
  ],
  coordination: [
    "Wall rallies",
    "Reaction ball",
    "Hand-eye coordination",
    "Balance drills",
    "Agility exercises",
    "Coordination ladder",
    "Multi-shuttle control",
    "Mirror drills"
  ]
};

export const getAllDrills = () => {
  return Object.values(badmintonDrillCategories).flat();
};

export const getDrillsByCategory = (category: keyof typeof badmintonDrillCategories) => {
  return badmintonDrillCategories[category] || [];
};
