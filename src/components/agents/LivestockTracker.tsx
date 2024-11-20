import React, { useState } from 'react';
import { Animal, LocationUpdate } from '../../types/livestock';
import { Card } from '../ui/Card';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Pagination } from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface Props {
  animals: Animal[];
  onLocationUpdate: (update: LocationUpdate) => void;
}

export const LivestockTracker: React.FC<Props> = ({ animals, onLocationUpdate }) => {
  const [updating, setUpdating] = useState<string | null>(null);
  
  const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedAnimals,
    handlePageChange 
  } = usePagination(animals, 5);

  const updateLocation = async (animal: Animal) => {
    setUpdating(animal.id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const update: LocationUpdate = {
      animalId: animal.id,
      timestamp: new Date(),
      latitude: animal.location.latitude + (Math.random() - 0.5) * 0.001,
      longitude: animal.location.longitude + (Math.random() - 0.5) * 0.001,
      activity: Math.random() > 0.5 ? 'grazing' : 'moving',
    };
    
    onLocationUpdate(update);
    setUpdating(null);
  };

  return (
    <Card
      header={
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Livestock Tracker</h2>
        </div>
      }
    >
      <div className="space-y-4">
        {paginatedAnimals.map((animal) => {
          const isUpdating = updating === animal.id;
          
          return (
            <motion.div
              key={animal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">{animal.name}</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  animal.behavior?.activity === 'unusual' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {animal.behavior?.activity || 'Normal'}
                </span>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span>Latitude:</span>
                  <span className="font-medium">{animal.location.latitude.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Longitude:</span>
                  <span className="font-medium">{animal.location.longitude.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span className="font-medium">
                    {format(animal.location.lastUpdate, 'HH:mm:ss')}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateLocation(animal)}
                disabled={isUpdating}
                className={`w-full bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-200 ${
                  isUpdating ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'
                }`}
              >
                {isUpdating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Location'
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