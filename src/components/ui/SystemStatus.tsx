import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useSystemStatus } from '../../hooks/useSystemStatus';

export const SystemStatus: React.FC = () => {
  const { isActive, lastCheck, services } = useSystemStatus();

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-opacity-10 transition-colors duration-200"
        style={{
          backgroundColor: isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: isActive ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)'
        }}
      >
        <motion.span
          animate={{
            scale: isActive ? [1, 1.2, 1] : 1,
            opacity: isActive ? [1, 0.7, 1] : 0.7
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-2 h-2 rounded-full mr-2"
          style={{
            backgroundColor: isActive ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)'
          }}
        />
        System {isActive ? 'Active' : 'Warning'}
      </motion.button>

      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-red-100 p-4 z-50"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-2">System Status Warning</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database:</span>
                <span className={services.database ? 'text-green-600' : 'text-red-600'}>
                  {services.database ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monitoring:</span>
                <span className={services.monitoring ? 'text-green-600' : 'text-red-600'}>
                  {services.monitoring ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tracking:</span>
                <span className={services.tracking ? 'text-green-600' : 'text-red-600'}>
                  {services.tracking ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Last checked: {format(lastCheck, 'HH:mm:ss')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};