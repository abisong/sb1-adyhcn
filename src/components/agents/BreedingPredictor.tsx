import React, { useState } from 'react';
import { Animal, BreedingPlan } from '../../types/livestock';
import { Card } from '../ui/Card';
import { format, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Pagination } from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface Props {
  animals: Animal[];
  onPlanUpdate: (plan: BreedingPlan) => void;
}

export const BreedingPredictor: React.FC<Props> = ({ animals, onPlanUpdate }) => {
  const [calculating, setCalculating] = useState<string | null>(null);
  const [animalPlans, setAnimalPlans] = useState<Record<string, BreedingPlan>>({});
  
  const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedAnimals,
    handlePageChange 
  } = usePagination(animals, 5);

  const calculateOptimalBreeding = async (animal: Animal) => {
    setCalculating(animal.id);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const fertility = animal.breeding?.fertility || 85;
    const optimalDate = addDays(new Date(), Math.floor(Math.random() * 30) + 1);
    
    const recommendations = [
      fertility > 90 ? 'Excellent fertility indicators' : 'Monitor fertility levels',
      'Maintain balanced nutrition plan',
      'Ensure stress-free environment',
      'Schedule regular health checks',
      'Monitor behavioral patterns'
    ].filter(r => r);

    const plan: BreedingPlan = {
      id: crypto.randomUUID(),
      animalId: animal.id,
      optimalDate,
      confidence: Math.min(fertility + Math.random() * 10, 100),
      recommendations,
    };

    setAnimalPlans(prev => ({
      ...prev,
      [animal.id]: plan
    }));
    onPlanUpdate(plan);
    setCalculating(null);
  };

  return (
    <Card
      header={
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Breeding Predictor</h2>
        </div>
      }
    >
      <div className="space-y-4">
        {paginatedAnimals.map((animal) => {
          const isCalculating = calculating === animal.id;
          const plan = animalPlans[animal.id];
          const fertility = animal.breeding?.fertility || 0;
          
          return (
            <motion.div
              key={animal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">{animal.name}</h3>
                <span className={`text-sm font-medium ${
                  fertility >= 90 ? 'text-green-600' : 
                  fertility >= 75 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  Fertility: {fertility}%
                </span>
              </div>

              {animal.breeding?.lastBreeding && (
                <div className="mb-3 text-sm text-gray-600">
                  Last Breeding: {format(animal.breeding.lastBreeding, 'MMM d, yyyy')}
                </div>
              )}

              {plan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 bg-pink-50 rounded-lg p-3 border border-pink-200"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-pink-700">Optimal Date:</span>
                      <span className="font-medium">{format(plan.optimalDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-pink-700">Confidence:</span>
                      <span className="font-medium">{plan.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-pink-700">Recommendations:</span>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {plan.recommendations.map((rec, index) => (
                          <li key={index} className="text-gray-600">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => calculateOptimalBreeding(animal)}
                disabled={isCalculating}
                className={`w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 ${
                  isCalculating ? 'opacity-75 cursor-not-allowed' : 'hover:from-pink-700 hover:to-pink-800'
                }`}
              >
                {isCalculating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  'Calculate Optimal Breeding Time'
                )}
              </motion.button>
            </motion.div>
          );
        })}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Card>
  );
};