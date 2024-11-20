import { db } from './db';
import { Animal, HealthAlert, DiseaseOutbreak, BreedingPlan, MilkingSchedule, FeedingPlan } from '../types/livestock';
import { addDays, subDays } from 'date-fns';

const animalNames = [
  'Bella', 'Luna', 'Daisy', 'Molly', 'Lucy', 'Bailey', 'Stella', 'Maggie',
  'Ruby', 'Sophie', 'Sadie', 'Chloe', 'Penny', 'Lily', 'Rosie', 'Lola',
  'Charlie', 'Max', 'Buddy', 'Rocky', 'Bear', 'Duke', 'Tucker', 'Jack',
  'Leo', 'Zeus', 'Bentley', 'Milo', 'Murphy', 'Sam', 'Oscar', 'Teddy'
];

const diseases = [
  'Foot and Mouth Disease',
  'Bovine Tuberculosis',
  'Brucellosis',
  'Bluetongue',
  'Anthrax',
  'Avian Influenza',
  'Newcastle Disease',
  'Sheep Pox'
];

const locations = [
  'North Pasture',
  'South Field',
  'East Meadow',
  'West Paddock',
  'Central Barn',
  'River Field',
  'Hill Pasture',
  'Valley Grazing'
];

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateRandomCoordinates = (baseLatitude: number, baseLongitude: number, radius: number) => {
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * radius;
  
  const latitude = baseLatitude + (randomDistance * Math.cos(randomAngle) / 111.32);
  const longitude = baseLongitude + (randomDistance * Math.sin(randomAngle) / (111.32 * Math.cos(baseLatitude * Math.PI / 180)));
  
  return { latitude, longitude };
};

const generateSyntheticData = async () => {
  // Base coordinates for the farm
  const BASE_LATITUDE = 51.5074;
  const BASE_LONGITUDE = -0.1278;

  // Generate 32 animals (matching the names array)
  const animals: Animal[] = animalNames.map((name, index) => {
    const type = index % 3 === 0 ? 'cow' : index % 3 === 1 ? 'sheep' : 'chicken';
    const coords = generateRandomCoordinates(BASE_LATITUDE, BASE_LONGITUDE, 0.1);
    
    return {
      id: crypto.randomUUID(),
      type,
      name,
      age: Math.floor(Math.random() * 8) + 1,
      health: {
        temperature: 37.5 + Math.random() * 2,
        heartRate: 60 + Math.floor(Math.random() * 30),
        lastCheckup: generateRandomDate(subDays(new Date(), 30), new Date()),
      },
      location: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        lastUpdate: new Date(),
      },
      breeding: {
        lastBreeding: Math.random() > 0.3 ? generateRandomDate(subDays(new Date(), 180), subDays(new Date(), 30)) : null,
        fertility: Math.floor(Math.random() * 30) + 70,
        nextOptimalDate: Math.random() > 0.5 ? generateRandomDate(new Date(), addDays(new Date(), 90)) : null,
      },
    };
  });

  // Generate 20 health alerts
  const healthAlerts: HealthAlert[] = Array.from({ length: 20 }, () => {
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return {
      id: crypto.randomUUID(),
      animalId: randomAnimal.id,
      severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      message: `Health check required for ${randomAnimal.name}`,
      timestamp: generateRandomDate(subDays(new Date(), 30), new Date()),
    };
  });

  // Generate 15 disease outbreaks
  const diseaseOutbreaks: DiseaseOutbreak[] = Array.from({ length: 15 }, () => ({
    id: crypto.randomUUID(),
    disease: diseases[Math.floor(Math.random() * diseases.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    affectedSpecies: ['cow', 'sheep', 'chicken'].filter(() => Math.random() > 0.5),
    timestamp: generateRandomDate(subDays(new Date(), 90), new Date()),
    radius: Math.floor(Math.random() * 40) + 10,
    confirmedCases: Math.floor(Math.random() * 15) + 1,
  }));

  // Generate 25 breeding plans
  const breedingPlans: BreedingPlan[] = Array.from({ length: 25 }, () => {
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return {
      id: crypto.randomUUID(),
      animalId: randomAnimal.id,
      optimalDate: generateRandomDate(new Date(), addDays(new Date(), 180)),
      confidence: Math.floor(Math.random() * 20) + 80,
      recommendations: [
        'Maintain optimal nutrition',
        'Monitor health closely',
        'Ensure stress-free environment',
        'Schedule regular checkups'
      ].filter(() => Math.random() > 0.3),
    };
  });

  // Generate 20 milking schedules
  const milkingSchedules: MilkingSchedule[] = Array.from({ length: 20 }, () => {
    const randomCow = animals.find(a => a.type === 'cow') || animals[0];
    return {
      id: crypto.randomUUID(),
      animalId: randomCow.id,
      times: [4, 12, 20].map(hour => {
        const date = new Date();
        date.setHours(hour, 0, 0, 0);
        return date;
      }),
      yield: Math.floor(Math.random() * 15) + 20,
    };
  });

  // Generate 15 feeding plans
  const feedingPlans: FeedingPlan[] = Array.from({ length: 15 }, () => ({
    id: crypto.randomUUID(),
    animalType: ['cow', 'sheep', 'chicken'][Math.floor(Math.random() * 3)],
    protein: Math.floor(Math.random() * 10) + 15,
    carbohydrates: Math.floor(Math.random() * 20) + 50,
    minerals: Math.floor(Math.random() * 3) + 2,
    schedule: ['06:00', '12:00', '18:00'].filter(() => Math.random() > 0.2),
  }));

  // Insert all data into the database
  try {
    await db.transaction('rw', 
      db.animals, 
      db.healthAlerts, 
      db.diseaseOutbreaks, 
      db.breedingPlans, 
      db.milkingSchedules, 
      db.feedingPlans, 
      async () => {
        await db.animals.bulkAdd(animals);
        await db.healthAlerts.bulkAdd(healthAlerts);
        await db.diseaseOutbreaks.bulkAdd(diseaseOutbreaks);
        await db.breedingPlans.bulkAdd(breedingPlans);
        await db.milkingSchedules.bulkAdd(milkingSchedules);
        await db.feedingPlans.bulkAdd(feedingPlans);
    });

    console.log('Synthetic data generation complete!');
    console.log(`Generated:
      - ${animals.length} animals
      - ${healthAlerts.length} health alerts
      - ${diseaseOutbreaks.length} disease outbreaks
      - ${breedingPlans.length} breeding plans
      - ${milkingSchedules.length} milking schedules
      - ${feedingPlans.length} feeding plans
    `);
  } catch (error) {
    console.error('Error inserting synthetic data:', error);
    throw error;
  }
};

export const seedDatabase = async () => {
  try {
    await generateSyntheticData();
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};