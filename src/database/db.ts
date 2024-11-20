import Dexie, { Table } from 'dexie';
import { Animal, HealthAlert, DiseaseOutbreak, BreedingPlan, MilkingSchedule, FeedingPlan } from '../types/livestock';
import { seedDatabase } from './seedData';

export class LivestockDatabase extends Dexie {
  animals!: Table<Animal>;
  healthAlerts!: Table<HealthAlert>;
  diseaseOutbreaks!: Table<DiseaseOutbreak>;
  breedingPlans!: Table<BreedingPlan>;
  milkingSchedules!: Table<MilkingSchedule>;
  feedingPlans!: Table<FeedingPlan>;

  constructor() {
    super('LivestockDB');
    
    this.version(1).stores({
      animals: '++id, type, name',
      healthAlerts: '++id, animalId, severity',
      diseaseOutbreaks: '++id, disease, severity',
      breedingPlans: '++id, animalId',
      milkingSchedules: '++id, animalId',
      feedingPlans: '++id, animalType'
    });
  }

  async isInitialized() {
    try {
      const animalCount = await this.animals.count();
      return animalCount > 0;
    } catch (error) {
      return false;
    }
  }
}

export const db = new LivestockDatabase();

// Database initialization with connection management
let initializationPromise: Promise<boolean> | null = null;

export const initializeDatabase = async (): Promise<boolean> => {
  // Return existing initialization if in progress
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      // Check if database is already open and initialized
      if (db.isOpen() && await db.isInitialized()) {
        return true;
      }

      // Open database if needed
      if (!db.isOpen()) {
        await db.open();
      }

      // Check if database needs seeding
      const needsSeeding = !(await db.isInitialized());
      if (needsSeeding) {
        await seedDatabase();
      }

      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      return false;
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
};

// Database operations
export const insertAnimal = async (animal: Animal) => {
  await initializeDatabase();
  return await db.animals.add(animal);
};

export const insertHealthAlert = async (alert: HealthAlert) => {
  await initializeDatabase();
  return await db.healthAlerts.add(alert);
};

export const insertDiseaseOutbreak = async (outbreak: DiseaseOutbreak) => {
  await initializeDatabase();
  return await db.diseaseOutbreaks.add(outbreak);
};

export const insertBreedingPlan = async (plan: BreedingPlan) => {
  await initializeDatabase();
  return await db.breedingPlans.add(plan);
};

export const insertMilkingSchedule = async (schedule: MilkingSchedule) => {
  await initializeDatabase();
  return await db.milkingSchedules.add(schedule);
};

export const insertFeedingPlan = async (plan: FeedingPlan) => {
  await initializeDatabase();
  return await db.feedingPlans.add(plan);
};

export const getAllAnimals = async () => {
  await initializeDatabase();
  return await db.animals.toArray();
};

export const getAnimalById = async (id: string) => {
  await initializeDatabase();
  return await db.animals.get(id);
};

export const updateAnimal = async (animal: Animal) => {
  await initializeDatabase();
  return await db.animals.put(animal);
};

export const deleteAnimal = async (id: string) => {
  await initializeDatabase();
  return await db.animals.delete(id);
};

export const getAllHealthAlerts = async () => {
  await initializeDatabase();
  return await db.healthAlerts.toArray();
};

export const getHealthAlertsByAnimal = async (animalId: string) => {
  await initializeDatabase();
  return await db.healthAlerts.where('animalId').equals(animalId).toArray();
};

export const getAllDiseaseOutbreaks = async () => {
  await initializeDatabase();
  return await db.diseaseOutbreaks.toArray();
};

export const getBreedingPlansByAnimal = async (animalId: string) => {
  await initializeDatabase();
  return await db.breedingPlans.where('animalId').equals(animalId).toArray();
};

export const getMilkingSchedulesByAnimal = async (animalId: string) => {
  await initializeDatabase();
  return await db.milkingSchedules.where('animalId').equals(animalId).toArray();
};

export const getFeedingPlansByType = async (animalType: string) => {
  await initializeDatabase();
  return await db.feedingPlans.where('animalType').equals(animalType).toArray();
};