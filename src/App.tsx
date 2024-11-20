import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpTab } from './components/HelpTab';
import { HealthMonitor } from './components/agents/HealthMonitor';
import { FeedOptimizer } from './components/agents/FeedOptimizer';
import { MilkingOptimizer } from './components/agents/MilkingOptimizer';
import { BreedingPredictor } from './components/agents/BreedingPredictor';
import { LivestockTracker } from './components/agents/LivestockTracker';
import { DiseaseMonitor } from './components/agents/DiseaseMonitor';
import { AnimalForm } from './components/forms/AnimalForm';
import { SystemStatus } from './components/ui/SystemStatus';
import { Animal } from './types/livestock';
import { useDatabase } from './hooks/useDatabase';
import { TabSelector } from './components/ui/TabSelector';

type Tab = 'health' | 'breeding' | 'tracking' | 'feeding' | 'disease' | 'milking' | 'help';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('help');
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | undefined>(undefined);
  const { 
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
    addFeedingPlan
  } = useDatabase();

  const handleAnimalSubmit = async (animal: Omit<Animal, 'id'>) => {
    if (editingAnimal) {
      await updateAnimalData({ ...animal, id: editingAnimal.id } as Animal);
    } else {
      await addAnimal(animal);
    }
    setShowForm(false);
    setEditingAnimal(undefined);
  };

  const tabs = [
    { id: 'help', label: 'Help', color: 'gray' },
    { id: 'health', label: 'Health Monitor', color: 'blue' },
    { id: 'breeding', label: 'Breeding', color: 'pink' },
    { id: 'tracking', label: 'Tracking', color: 'indigo' },
    { id: 'feeding', label: 'Feeding', color: 'green' },
    { id: 'disease', label: 'Disease', color: 'red' },
    { id: 'milking', label: 'Milking', color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
              >
                Livestock Management AI
              </motion.h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
              >
                Add Animal
              </motion.button>
              <SystemStatus />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <TabSelector
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'help' && <HelpTab />}
            {activeTab === 'health' && (
              <HealthMonitor
                animals={animals}
                alerts={healthAlerts}
                onAlert={addHealthAlert}
              />
            )}
            {activeTab === 'breeding' && (
              <BreedingPredictor
                animals={animals}
                onPlanUpdate={addBreedingPlan}
              />
            )}
            {activeTab === 'tracking' && (
              <LivestockTracker
                animals={animals}
                onLocationUpdate={(update) => {
                  const animal = animals.find(a => a.id === update.animalId);
                  if (animal) {
                    updateAnimalData({
                      ...animal,
                      location: {
                        latitude: update.latitude,
                        longitude: update.longitude,
                        lastUpdate: update.timestamp
                      }
                    });
                  }
                }}
              />
            )}
            {activeTab === 'feeding' && (
              <FeedOptimizer
                animals={animals}
                onPlanUpdate={addFeedingPlan}
              />
            )}
            {activeTab === 'disease' && (
              <DiseaseMonitor
                outbreaks={outbreaks}
                onOutbreakUpdate={addDiseaseOutbreak}
              />
            )}
            {activeTab === 'milking' && (
              <MilkingOptimizer
                animals={animals}
                schedules={milkingSchedules}
                onScheduleUpdate={addMilkingSchedule}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <AnimalForm
              onSubmit={handleAnimalSubmit}
              existingAnimal={editingAnimal}
              onCancel={() => {
                setShowForm(false);
                setEditingAnimal(undefined);
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;