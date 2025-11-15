const specialtiesWithFocusAreas = [
  {
    specialty: "Bipolar",
    focusAreas: ["Type I", "Type II", "Cyclothymia", "Rapid Cycling"],
  },
  {
    specialty: "LGBTQ",
    focusAreas: ["Coming Out", "Gender Identity", "Sexual Orientation", "Discrimination", "Family Acceptance"],
  },
  {
    specialty: "Medication/Prescribing",
    focusAreas: ["Antidepressants", "Mood Stabilizers", "Antipsychotics", "Anti-anxiety"],
  },
  {
    specialty: "Suicide History/Attempts",
    focusAreas: ["Crisis Intervention", "Safety Planning", "Ideation Management", "Post-attempt Support"],
  },
  {
    specialty: "General Mental Health",
    focusAreas: ["anxiety", "depression", "stress", "grief", "life transitions"],
  },
  {
    specialty: "Men's issues",
    focusAreas: ["Anger Management", "Work-Life Balance", "Fatherhood", "Masculinity", "Emotional Expression"],
  },
  {
    specialty: "Relationship Issues",
    focusAreas: ["family", "friends", "couple", "divorce", "communication"],
  },
  {
    specialty: "Trauma & PTSD",
    focusAreas: ["Combat", "Childhood Trauma", "Sexual Assault", "Natural Disasters", "Complex PTSD"],
  },
  {
    specialty: "Personality disorders",
    focusAreas: ["Borderline", "Narcissistic", "Antisocial", "Avoidant", "Dependent"],
  },
  {
    specialty: "Personal growth",
    focusAreas: ["Self-Esteem", "Goal Setting", "Mindfulness", "Self-Discovery", "Identity Development"],
  },
  {
    specialty: "Substance use/abuse",
    focusAreas: ["Alcohol", "Opioids", "Stimulants", "Cannabis", "Recovery Support", "Relapse Prevention"],
  },
  {
    specialty: "Pediatrics",
    focusAreas: ["Behavioral Issues", "Development", "School Problems", "Parenting Support", "Social Skills"],
  },
  {
    specialty: "Women's issues",
    focusAreas: ["post-partum", "infertility", "family planning", "menopause", "pregnancy"],
  },
  {
    specialty: "Chronic pain",
    focusAreas: ["Fibromyalgia", "Back Pain", "Migraines", "Pain Coping Strategies", "Neuropathy"],
  },
  {
    specialty: "Weight loss & nutrition",
    focusAreas: ["Meal Planning", "Behavioral Change", "Metabolic Health", "Exercise", "Portion Control"],
  },
  {
    specialty: "Eating disorders",
    focusAreas: ["Anorexia", "Bulimia", "Binge Eating", "Body Image", "Orthorexia"],
  },
  {
    specialty: "Diabetic Diet and nutrition",
    focusAreas: ["Type 1", "Type 2", "Prediabetes", "Blood Sugar Management", "Carb Counting"],
  },
  {
    specialty: "Coaching",
    focusAreas: ["leadership", "career", "academic", "wellness", "executive"],
  },
  {
    specialty: "Life coaching",
    focusAreas: ["Transitions", "Purpose", "Balance", "Accountability", "Goal Achievement"],
  },
  {
    specialty: "Obsessive-compulsive disorders",
    focusAreas: ["Intrusive Thoughts", "Rituals", "Contamination", "Checking", "Hoarding"],
  },
  {
    specialty: "Neuropsychological evaluations & testing",
    focusAreas: ["ADHD testing", "Cognitive Assessment", "Memory Testing", "IQ Testing"],
  },
  {
    specialty: "Attention and Hyperactivity (ADHD)",
    focusAreas: ["Inattention", "Hyperactivity", "Executive Function", "Time Management", "Organization"],
  },
  {
    specialty: "Sleep issues",
    focusAreas: ["Insomnia", "Sleep Apnea", "Nightmares", "Sleep Hygiene", "Circadian Rhythm"],
  },
  {
    specialty: "Schizophrenia and psychotic disorders",
    focusAreas: ["Hallucinations", "Delusions", "Medication Management", "Reality Testing", "Coping Skills"],
  },
  {
    specialty: "Learning disorders",
    focusAreas: ["Dyslexia", "Dyscalculia", "Processing Disorders", "IEP Support", "Reading Comprehension"],
  },
  {
    specialty: "Domestic abuse",
    focusAreas: ["Physical Violence", "Emotional Abuse", "Safety Planning", "Trauma Recovery", "Legal Support"],
  },
];

// Get random focus area IDs for advocates
const getRandomFocusAreaIds = (totalFocusAreas: number, count: number = 8) => {
  const ids = new Set<number>();
  while (ids.size < Math.min(count, totalFocusAreas)) {
    ids.add(Math.floor(Math.random() * totalFocusAreas) + 1);
  }
  return Array.from(ids);
};

const advocateData = [
  {
    firstName: "John",
    lastName: "Doe",
    city: "New York",
    degree: "MD",
    yearsOfExperience: 10,
    phoneNumber: 5551234567,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    city: "Los Angeles",
    degree: "PhD",
    yearsOfExperience: 8,
    phoneNumber: 5559876543,
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    city: "Chicago",
    degree: "MSW",
    yearsOfExperience: 5,
    phoneNumber: 5554567890,
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    city: "Houston",
    degree: "MD",
    yearsOfExperience: 12,
    phoneNumber: 5556543210,
  },
  {
    firstName: "Emily",
    lastName: "Davis",
    city: "Phoenix",
    degree: "PhD",
    yearsOfExperience: 7,
    phoneNumber: 5553210987,
  },
  {
    firstName: "Chris",
    lastName: "Martinez",
    city: "Philadelphia",
    degree: "MSW",
    yearsOfExperience: 9,
    phoneNumber: 5557890123,
  },
  {
    firstName: "Jessica",
    lastName: "Taylor",
    city: "San Antonio",
    degree: "MD",
    yearsOfExperience: 11,
    phoneNumber: 5554561234,
  },
  {
    firstName: "David",
    lastName: "Harris",
    city: "San Diego",
    degree: "PhD",
    yearsOfExperience: 6,
    phoneNumber: 5557896543,
  },
  {
    firstName: "Laura",
    lastName: "Clark",
    city: "Dallas",
    degree: "MSW",
    yearsOfExperience: 4,
    phoneNumber: 5550123456,
  },
  {
    firstName: "Daniel",
    lastName: "Lewis",
    city: "San Jose",
    degree: "MD",
    yearsOfExperience: 13,
    phoneNumber: 5553217654,
  },
  {
    firstName: "Sarah",
    lastName: "Lee",
    city: "Austin",
    degree: "PhD",
    yearsOfExperience: 10,
    phoneNumber: 5551238765,
  },
  {
    firstName: "James",
    lastName: "King",
    city: "Jacksonville",
    degree: "MSW",
    yearsOfExperience: 5,
    phoneNumber: 5556540987,
  },
  {
    firstName: "Megan",
    lastName: "Green",
    city: "San Francisco",
    degree: "MD",
    yearsOfExperience: 14,
    phoneNumber: 5559873456,
  },
  {
    firstName: "Joshua",
    lastName: "Walker",
    city: "Columbus",
    degree: "PhD",
    yearsOfExperience: 9,
    phoneNumber: 5556781234,
  },
  {
    firstName: "Amanda",
    lastName: "Hall",
    city: "Fort Worth",
    degree: "MSW",
    yearsOfExperience: 3,
    phoneNumber: 5559872345,
  },
];

export { advocateData, specialtiesWithFocusAreas, getRandomFocusAreaIds };
