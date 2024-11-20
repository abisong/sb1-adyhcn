import React, { useState } from 'react';
import { Animal, MilkingSchedule } from '../../types/livestock';
import { format, addDays } from 'date-fns';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { Pagination } from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface Props {
  animals: Animal[];
  schedules: MilkingSchedule[];
  onScheduleUpdate: (schedule: MilkingSchedule) => void;
}

export const MilkingOptimizer: React.FC<Props> = ({ animals, schedules, onScheduleUpdate }) => {
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const dairyAnimals = animals.filter(animal => animal.type === 'cow');
  
  const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedAnimals,
    handlePageChange 
  } = usePagination(dairyAnimals, 5);

  const optimizeSchedule = async (animal: Animal) => {
    setOptimizing(animal.id);
    
    try {
      // Simulate AI calculation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Calculate optimal milking times based on the animal's current data
      const currentOutput = animal.dairy?.dailyOutput || 20;
      const optimalTimes = [];
      const baseDate = new Date();
      baseDate.setSeconds(0, 0); // Reset seconds and milliseconds

      // Early morning milking (4-6 AM)
      const morningTime = new Date(baseDate);
      morningTime.setHours(4 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      optimalTimes.push(morningTime);

      // Mid-day milking (12-2 PM)
      const noonTime = new Date(baseDate);
      noonTime.setHours(12 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      optimalTimes.push(noonTime);

      // Evening milking (7-9 PM)
      const eveningTime = new Date(baseDate);
      eveningTime.setHours(19 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      optimalTimes.push(eveningTime);

      // Calculate expected yield based on current output and optimization
      const optimizedYield = currentOutput * (1 + Math.random() * 0.2); // 0-20% improvement

      const newSchedule: MilkingSchedule = {
        id: crypto.randomUUID(),
        animalId: animal.id,
        times: optimalTimes,
        yield: Math.round(optimizedYield * 10) / 10, // Round to 1 decimal place
      };

      await onScheduleUpdate(newSchedule);
    } catch (error) {
      console.error('Error optimizing schedule:', error);
    } finally {
      setOptimizing(null);
    }
  };

  const getYieldTrend = (currentYield: number, previousYield: number) => {
    const difference = currentYield - previousYield;
    if (difference > 0) return { icon: '↑', color: 'text-green-600' };
    if (difference < 0) return { icon: '↓', color: 'text-red-600' };
    return { icon: '→', color: 'text-gray-600' };
  };

  return (
    <Card
      header={
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Milking Schedule Optimizer</h2>
        </div>
      }
    >
      <div className="space-y-6">
        {paginatedAnimals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No dairy animals found. Add cows to optimize milking schedules.
          </div>
        ) : (
          paginatedAnimals.map(animal => {
            const currentSchedule = schedules.find(s => s.animalId === animal.id);
            const isOptimizing = optimizing === animal.id;
            const previousYield = animal.dairy?.dailyOutput || 0;
            const currentYield = currentSchedule?.yield || previousYield;
            const trend = getYieldTrend(currentYield, previousYield);
            
            return (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{animal.name}</h3>
                    <p className="text-sm text-gray-600">Current Daily Yield: 
                      <span className={`ml-1 font-medium ${trend.color}`}>
                        {currentYield} L {trend.icon}
                      </span>
                    </p>
                  </div>
                  {currentSchedule && (
                    <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
                      Optimized
                    </span>
                  )}
                </div>

                {currentSchedule && (
                  <div className="mb-4 bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">Optimized Schedule:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {currentSchedule.times.map((time, index) => (
                        <div key={index} className="bg-white rounded-md p-2 text-center">
                          <span className="text-sm font-medium text-purple-700">
                            {format(time, 'HH:mm')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => optimizeSchedule(animal)}
                  disabled={isOptimizing}
                  className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 ${
                    isOptimizing ? 'opacity-75 cursor-not-allowed' : 'hover:from-purple-700 hover:to-purple-800'
                  }`}
                >
                  {isOptimizing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Optimizing Schedule...
                    </span>
                  ) : (
                    `${currentSchedule ? 'Re-optimize' : 'Optimize'} Schedule`
                  )}
                </motion.button>
              </motion.div>
            );
          })
        )}

        {paginatedAnimals.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Card>
  );
};