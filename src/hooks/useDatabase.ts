import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../database/db';
import {
  Animal,
  HealthAlert,
  DiseaseOutbreak,
  BreedingPlan,
  MilkingSchedule,
  FeedingPlan,
} from '../types/livestock';

export const useDatabase = () => {
  const animals = useLiveQuery(() => db.animals.toArray()) ?? [];
  const healthAlerts = useLiveQuery(() => db.healthAlerts.toArray()) ?? [];
  const outbreaks = useLiveQuery(() => db.diseaseOutbreaks.toArray()) ?? [];
  const breedingPlans = useLiveQuery(() => db.breedingPlans.toArray()) ?? [];
  const milkingSchedules = useLiveQuery(() => db.milkingSchedules.toArray()) ?? [];
  const feedingPlans = useLiveQuery(() => db.feedingPlans.toArray()) ?? [];

  const addAnimal = async (animal: Omit<Animal, 'id'>) => {
    const newAnimal = { ...animal, id: crypto.randomUUID() };
    await db.animals.add(newAnimal as Animal);
    return newAnimal;
  };

  const updateAnimalData = async (animal: Animal) => {
    await db.animals.put(animal);
  };

  const addHealthAlert = async (alert: Omit<HealthAlert, 'id'>) => {
    const newAlert = { ...alert, id: crypto.randomUUID() };
    await db.healthAlerts.add(newAlert as HealthAlert);
    return newAlert;
  };

  const addDiseaseOutbreak = async (outbreak: Omit<DiseaseOutbreak, 'id'>) => {
    const newOutbreak = { ...outbreak, id: crypto.randomUUID() };
    await db.diseaseOutbreaks.add(newOutbreak as DiseaseOutbreak);
    return newOutbreak;
  };

  const addBreedingPlan = async (plan: Omit<BreedingPlan, 'id'>) => {
    const newPlan = { ...plan, id: crypto.randomUUID() };
    await db.breedingPlans.add(newPlan as BreedingPlan);
    return newPlan;
  };

  const addMilkingSchedule = async (schedule: Omit<MilkingSchedule, 'id'>) => {
    const newSchedule = { ...schedule, id: crypto.randomUUID() };
    await db.milkingSchedules.add(newSchedule as MilkingSchedule);
    return newSchedule;
  };

  const addFeedingPlan = async (plan: Omit<FeedingPlan, 'id'>) => {
    const newPlan = { ...plan, id: crypto.randomUUID() };
    await db.feedingPlans.add(newPlan as FeedingPlan);
    return newPlan;
  };

  return {
    animals,
    healthAlerts,
    outbreaks,
    breedingPlans,
    milkingSchedules,
    feedingPlans,
    addAnimal,
    updateAnimalData,
    addHealthAlert,
    addDiseaseOutbreak,
    addBreedingPlan,
    addMilkingSchedule,
    addFeedingPlan,
  };
};