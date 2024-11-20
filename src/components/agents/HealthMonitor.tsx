import React, { useState } from 'react';
import { Animal, HealthAlert } from '../../types/livestock';
import { format } from 'date-fns';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { Pagination } from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface Props {
  animals: Animal[];
  alerts: HealthAlert[];
  onAlert: (alert: HealthAlert) => void;
}

export const HealthMonitor: React.FC<Props> = ({ animals, alerts, onAlert }) => {
  const [checking, setChecking] = useState<string | null>(null);
  const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedAnimals,
    handlePageChange 
  } = usePagination(animals, 5); // Changed to 5 items per page

  const checkVitals = async (animal: Animal) => {
    setChecking(animal.id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (animal.health.temperature > 39.5) {
      onAlert({
        id: crypto.randomUUID(),
        animalId: animal.id,
        severity: 'high',
        message: `High temperature (${animal.health.temperature}°C) detected in ${animal.name}`,
        timestamp: new Date(),
      });
    }
    
    if (animal.health.heartRate > 80) {
      onAlert({
        id: crypto.randomUUID(),
        animalId: animal.id,
        severity: 'high',
        message: `Elevated heart rate (${animal.health.heartRate} BPM) detected in ${animal.name}`,
        timestamp: new Date(),
      });
    }
    
    setChecking(null);
  };

  const getHealthStatus = (temperature: number, heartRate: number) => {
    if (temperature > 39.5 || heartRate > 80) return 'critical';
    if (temperature > 39.0 || heartRate > 70) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  return (
    <Card
      header={
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Health Monitor</h2>
        </div>
      }
    >
      <div className="space-y-6">
        {paginatedAnimals.map((animal) => {
          const status = getHealthStatus(animal.health.temperature, animal.health.heartRate);
          const statusColor = getStatusColor(status);
          const isChecking = checking === animal.id;
          
          return (
            <motion.div
              key={animal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{animal.name}</h3>
                <span className={`capitalize font-medium ${statusColor} px-2 py-1 rounded-full text-sm bg-opacity-10 ${statusColor.replace('text', 'bg')}`}>
                  {status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-medium">{animal.health.temperature}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Heart Rate:</span>
                  <span className="font-medium">{animal.health.heartRate} BPM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Checkup:</span>
                  <span className="font-medium">{format(animal.health.lastCheckup, 'MMM d, yyyy')}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => checkVitals(animal)}
                disabled={isChecking}
                className={`mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow ${
                  isChecking ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {isChecking ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </span>
                ) : (
                  'Check Vitals'
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

        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Alerts</h3>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-red-800">{alert.message}</span>
                    <span className="text-red-600 text-sm">
                      {format(alert.timestamp, 'HH:mm')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};