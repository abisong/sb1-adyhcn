import React, { useState } from 'react';
import { Animal, FeedingPlan } from '../../types/livestock';

interface Props {
  animals: Animal[];
  onPlanUpdate: (plan: FeedingPlan) => void;
}

export const FeedOptimizer: React.FC<Props> = ({ animals, onPlanUpdate }) => {
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<FeedingPlan | null>(null);

  const calculateOptimalNutrition = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    const plan: FeedingPlan = {
      id: crypto.randomUUID(),
      animalType: animal.type,
      protein: animal.type === 'cow' ? 16 : 12,
      carbohydrates: 60,
      minerals: 4,
      schedule: ['06:00', '14:00', '20:00'],
    };

    setCurrentPlan(plan);
    onPlanUpdate(plan);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-green-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Feed Optimizer</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="animal-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Animal
            </label>
            <select
              id="animal-select"
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Choose an animal</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name} ({animal.type})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => calculateOptimalNutrition(selectedAnimal)}
            disabled={!selectedAnimal}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Optimal Nutrition
          </button>

          {currentPlan && (
            <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Recommended Nutrition Plan</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Protein:</span>
                  <span className="font-medium">{currentPlan.protein}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Carbohydrates:</span>
                  <span className="font-medium">{currentPlan.carbohydrates}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Minerals:</span>
                  <span className="font-medium">{currentPlan.minerals}%</span>
                </div>
                <div className="mt-2">
                  <span className="text-green-700">Feeding Schedule:</span>
                  <div className="flex gap-2 mt-1">
                    {currentPlan.schedule.map((time, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};