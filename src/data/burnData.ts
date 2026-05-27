// Historical crop burn data for Punjab, Haryana, and surrounding regions
// Simulated dataset based on MODIS/VIIRS satellite thermal hotspot patterns

export interface BurnEvent {
  id: string;
  lat: number;
  lng: number;
  district: string;
  state: string;
  date: string; // ISO date
  intensity: "low" | "medium" | "high" | "extreme";
  crop: string;
  areaBurned: number; // hectares
  frp: number; // Fire Radiative Power in MW
}

export interface PredictedBurn {
  id: string;
  lat: number;
  lng: number;
  district: string;
  state: string;
  predictedDate: string;
  probability: number; // 0-1
  expectedIntensity: "low" | "medium" | "high" | "extreme";
  crop: string;
  riskScore: number; // 0-100
  model: "RandomForest" | "XGBoost";
}

export interface AQIWarning {
  id: string;
  city: string;
  lat: number;
  lng: number;
  currentAQI: number;
  predictedAQI: number;
  category: "Good" | "Moderate" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  predictedCategory: "Good" | "Moderate" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  windDirection: string;
  affectedBy: string[];
  healthRisk: string;
}

export interface CropAlternative {
  id: string;
  crop: string;
  alternative: string;
  revenuePerTon: number; // INR
  costPerTon: number; // INR
  profitPerTon: number;
  description: string;
  icon: string;
  category: "energy" | "fertilizer" | "industrial" | "export";
}

const districts = [
  { name: "Amritsar", state: "Punjab", lat: 31.6340, lng: 74.8723 },
  { name: "Ludhiana", state: "Punjab", lat: 30.9010, lng: 75.8573 },
  { name: "Patiala", state: "Punjab", lat: 30.3398, lng: 76.3869 },
  { name: "Sangrur", state: "Punjab", lat: 30.2331, lng: 75.8413 },
  { name: "Bathinda", state: "Punjab", lat: 30.2110, lng: 74.9455 },
  { name: "Moga", state: "Punjab", lat: 30.8162, lng: 75.1741 },
  { name: "Firozpur", state: "Punjab", lat: 30.9331, lng: 74.6225 },
  { name: "Muktsar", state: "Punjab", lat: 30.4728, lng: 74.5107 },
  { name: "Mansa", state: "Punjab", lat: 29.9985, lng: 75.3845 },
  { name: "Barnala", state: "Punjab", lat: 30.3819, lng: 75.5472 },
  { name: "Karnal", state: "Haryana", lat: 29.6857, lng: 76.9905 },
  { name: "Kurukshetra", state: "Haryana", lat: 29.9695, lng: 76.8783 },
  { name: "Kaithal", state: "Haryana", lat: 29.8015, lng: 76.3998 },
  { name: "Ambala", state: "Haryana", lat: 30.3782, lng: 76.7767 },
  { name: "Hisar", state: "Haryana", lat: 29.1492, lng: 75.7217 },
  { name: "Sirsa", state: "Haryana", lat: 29.5349, lng: 75.0285 },
  { name: "Fatehabad", state: "Haryana", lat: 29.5133, lng: 75.4546 },
  { name: "Jind", state: "Haryana", lat: 29.3160, lng: 76.3143 },
];

const crops = ["Rice Stubble", "Wheat Stubble", "Sugarcane Trash", "Cotton Stalks"];
const intensities: BurnEvent["intensity"][] = ["low", "medium", "high", "extreme"];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateBurnEvents(year: number, month: number): BurnEvent[] {
  const rand = seededRandom(year * 100 + month);
  const events: BurnEvent[] = [];

  // Burning peaks in Oct-Nov (post-rice) and Apr-May (post-wheat)
  const isHighSeason = [10, 11, 4, 5].includes(month);
  const isMedSeason = [3, 9, 12].includes(month);
  const baseCount = isHighSeason ? 40 : isMedSeason ? 15 : 3;

  for (let i = 0; i < baseCount; i++) {
    const district = districts[Math.floor(rand() * districts.length)];
    const latOffset = (rand() - 0.5) * 0.3;
    const lngOffset = (rand() - 0.5) * 0.3;
    const day = Math.floor(rand() * 28) + 1;
    const intensityIdx = isHighSeason
      ? Math.min(Math.floor(rand() * 4), 3)
      : Math.floor(rand() * 2);

    events.push({
      id: `burn-${year}-${month}-${i}`,
      lat: district.lat + latOffset,
      lng: district.lng + lngOffset,
      district: district.name,
      state: district.state,
      date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      intensity: intensities[intensityIdx],
      crop: isHighSeason && [10, 11].includes(month) ? "Rice Stubble" : 
            isHighSeason ? "Wheat Stubble" : crops[Math.floor(rand() * crops.length)],
      areaBurned: Math.floor(rand() * 500 + 10),
      frp: Math.floor(rand() * 300 + 20),
    });
  }

  return events;
}

export function generatePredictions(): PredictedBurn[] {
  const rand = seededRandom(2026);
  const predictions: PredictedBurn[] = [];
  const now = new Date();

  // Predict for the next 2 weeks
  const highRiskDistricts = districts.filter((_, i) => i % 2 === 0);

  highRiskDistricts.forEach((district, i) => {
    const daysAhead = Math.floor(rand() * 14) + 1;
    const predictedDate = new Date(now);
    predictedDate.setDate(predictedDate.getDate() + daysAhead);
    const prob = rand() * 0.5 + 0.4;

    predictions.push({
      id: `pred-${i}`,
      lat: district.lat + (rand() - 0.5) * 0.2,
      lng: district.lng + (rand() - 0.5) * 0.2,
      district: district.name,
      state: district.state,
      predictedDate: predictedDate.toISOString().split("T")[0],
      probability: Number(prob.toFixed(2)),
      expectedIntensity: prob > 0.75 ? "extreme" : prob > 0.6 ? "high" : prob > 0.45 ? "medium" : "low",
      crop: "Wheat Stubble",
      riskScore: Math.floor(prob * 100),
      model: rand() > 0.5 ? "RandomForest" : "XGBoost",
    });
  });

  return predictions.sort((a, b) => b.riskScore - a.riskScore);
}

export function generateAQIWarnings(year: number, month: number): AQIWarning[] {
  const rand = seededRandom(year * 100 + month + 9999);
  const cities = [
    { city: "Delhi", lat: 28.6139, lng: 77.209 },
    { city: "Chandigarh", lat: 30.7333, lng: 76.7794 },
    { city: "Lucknow", lat: 26.8467, lng: 80.9462 },
    { city: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { city: "Agra", lat: 27.1767, lng: 78.0081 },
    { city: "Varanasi", lat: 25.3176, lng: 82.9739 },
    { city: "Dehradun", lat: 30.3165, lng: 78.0322 },
  ];

  const getCategory = (aqi: number) => {
    if (aqi <= 50) return "Good" as const;
    if (aqi <= 100) return "Moderate" as const;
    if (aqi <= 200) return "Unhealthy" as const;
    if (aqi <= 300) return "Very Unhealthy" as const;
    return "Hazardous" as const;
  };

  // AQI varies by season — worst during Oct-Nov burn season
  const isHighSeason = [10, 11].includes(month);
  const isMedSeason = [4, 5, 9, 12].includes(month);
  const seasonMultiplier = isHighSeason ? 1.8 : isMedSeason ? 1.2 : 0.6;

  return cities.map((c, i) => {
    const baseAQI = [180, 100, 130, 90, 140, 110, 80][i];
    const currentAQI = Math.round(baseAQI * seasonMultiplier * (0.8 + rand() * 0.4));
    const predictedAQI = Math.round(currentAQI * (1.2 + rand() * 0.5));
    return {
      id: `aqi-${year}-${month}-${i}`,
      ...c,
      currentAQI,
      predictedAQI,
      category: getCategory(currentAQI),
      predictedCategory: getCategory(predictedAQI),
      windDirection: ["NW", "N", "NW", "W", "NW", "NW", "N"][i],
      affectedBy: [
        ["Sangrur", "Patiala", "Bathinda"],
        ["Ludhiana", "Moga", "Barnala"],
        ["Karnal", "Kaithal", "Jind"],
        ["Hisar", "Sirsa", "Fatehabad"],
        ["Karnal", "Kurukshetra", "Ambala"],
        ["Karnal", "Jind", "Kaithal"],
        ["Ambala", "Kurukshetra", "Ludhiana"],
      ][i],
      healthRisk: predictedAQI > 300
        ? "Severe: Respiratory emergencies expected. Vulnerable populations at critical risk."
        : predictedAQI > 200
        ? "High: Significant health impact. Outdoor activity should be limited."
        : predictedAQI > 100
        ? "Moderate: Sensitive groups may experience symptoms."
        : "Low: Air quality is acceptable.",
    };
  });
}

export const cropAlternatives: CropAlternative[] = [
  {
    id: "alt-1",
    crop: "Rice Stubble",
    alternative: "Biochar Production",
    revenuePerTon: 14940,
    costPerTon: 3735,
    profitPerTon: 11205,
    description: "Convert stubble to biochar for soil amendment. Improves soil carbon and water retention.",
    icon: "🔥",
    category: "industrial",
  },
  {
    id: "alt-2",
    crop: "Rice Stubble",
    alternative: "Biomass Power Generation",
    revenuePerTon: 9960,
    costPerTon: 2905,
    profitPerTon: 7055,
    description: "Feed into biomass power plants for electricity generation. Several plants operational in Punjab.",
    icon: "⚡",
    category: "energy",
  },
  {
    id: "alt-3",
    crop: "Rice Stubble",
    alternative: "Organic Compost",
    revenuePerTon: 7885,
    costPerTon: 2075,
    profitPerTon: 5810,
    description: "Decompose into organic fertilizer using rapid composting techniques.",
    icon: "🌱",
    category: "fertilizer",
  },
  {
    id: "alt-4",
    crop: "Wheat Stubble",
    alternative: "Mushroom Cultivation Substrate",
    revenuePerTon: 20750,
    costPerTon: 4980,
    profitPerTon: 15770,
    description: "Use as substrate for oyster mushroom farming. High-value crop from waste.",
    icon: "🍄",
    category: "industrial",
  },
  {
    id: "alt-5",
    crop: "Wheat Stubble",
    alternative: "Compressed Bio-Briquettes",
    revenuePerTon: 9130,
    costPerTon: 2490,
    profitPerTon: 6640,
    description: "Compress into briquettes as clean cooking fuel alternative to firewood.",
    icon: "🧱",
    category: "energy",
  },
  {
    id: "alt-6",
    crop: "Rice Stubble",
    alternative: "Paper & Packaging Material",
    revenuePerTon: 16600,
    costPerTon: 5810,
    profitPerTon: 10790,
    description: "Process into pulp for eco-friendly packaging. Growing demand from e-commerce industry.",
    icon: "📦",
    category: "industrial",
  },
  {
    id: "alt-7",
    crop: "Rice Stubble",
    alternative: "Ethanol Production",
    revenuePerTon: 13280,
    costPerTon: 4565,
    profitPerTon: 8715,
    description: "Convert to cellulosic ethanol for blending with petrol. Government mandated 20% blending by 2025.",
    icon: "⛽",
    category: "energy",
  },
  {
    id: "alt-8",
    crop: "Wheat Stubble",
    alternative: "Animal Feed Pellets",
    revenuePerTon: 7055,
    costPerTon: 1660,
    profitPerTon: 5395,
    description: "Process and fortify into nutritious animal feed pellets for dairy cattle.",
    icon: "🐄",
    category: "export",
  },
];

export function getMonthlyStats(year: number, month: number) {
  const events = generateBurnEvents(year, month);
  const totalArea = events.reduce((sum, e) => sum + e.areaBurned, 0);
  const avgFRP = events.length ? events.reduce((sum, e) => sum + e.frp, 0) / events.length : 0;
  const highIntensity = events.filter(e => e.intensity === "high" || e.intensity === "extreme").length;

  return {
    totalEvents: events.length,
    totalArea,
    avgFRP: Math.round(avgFRP),
    highIntensityCount: highIntensity,
    events,
  };
}

export function getYearlyTimeline(year: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const stats = getMonthlyStats(year, month);
    return {
      month: new Date(year, i).toLocaleString("default", { month: "short" }),
      monthNum: month,
      events: stats.totalEvents,
      area: stats.totalArea,
      avgFRP: stats.avgFRP,
    };
  });
}
