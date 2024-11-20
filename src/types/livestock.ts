export interface Animal {
  id: string;
  type: 'cow' | 'sheep' | 'chicken';
  name: string;
  age: number;
  health: {
    temperature: number;
    heartRate: number;
    lastCheckup: Date;
  };
  location: {
    latitude: number;
    longitude: number;
    lastUpdate: Date;
  };
  breeding?: {
    lastBreeding: Date | null;
    fertility: number;
    nextOptimalDate: Date | null;
  };
  wool?: {
    lastShearing: Date | null;
    quality: number;
    density: number;
    length: number;
  };
  dairy?: {
    dailyOutput: number;
    protein: number;
    fat: number;
    lastMilking: Date;
  };
  behavior?: {
    activity: 'grazing' | 'resting' | 'moving' | 'unusual';
    lastUpdate: Date;
    pattern: string[];
  };
}

export interface HealthAlert {
  id: string;
  animalId: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
}

export interface FeedingPlan {
  id: string;
  animalType: string;
  protein: number;
  carbohydrates: number;
  minerals: number;
  schedule: string[];
}

export interface MilkingSchedule {
  id: string;
  animalId: string;
  times: Date[];
  yield: number;
}

export interface DiseaseOutbreak {
  id: string;
  disease: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  affectedSpecies: string[];
  timestamp: Date;
  radius: number;
  confirmedCases: number;
}

export interface BreedingPlan {
  id: string;
  animalId: string;
  optimalDate: Date;
  confidence: number;
  recommendations: string[];
}

export interface LocationUpdate {
  animalId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  activity: string;
}

export interface WoolQualityReport {
  id: string;
  animalId: string;
  timestamp: Date;
  quality: number;
  factors: {
    nutrition: number;
    health: number;
    environment: number;
  };
  recommendations: string[];
}

export interface FlockBehaviorAlert {
  id: string;
  timestamp: Date;
  type: 'predator' | 'weather' | 'health' | 'other';
  severity: 'low' | 'medium' | 'high';
  location: {
    latitude: number;
    longitude: number;
  };
  affectedAnimals: string[];
}

export interface DairyOptimizationPlan {
  id: string;
  animalId: string;
  currentOutput: number;
  targetOutput: number;
  recommendations: {
    feeding: string[];
    schedule: string[];
    environment: string[];
  };
}

export interface ManureManagementPlan {
  id: string;
  timestamp: Date;
  dailyVolume: number;
  biogasEstimate: number;
  fertilizerEstimate: number;
  recommendations: {
    collection: string[];
    processing: string[];
    usage: string[];
  };
}