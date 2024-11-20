import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label, icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl font-bold mb-1 ${color.replace('border-', 'text-')}`}>
            {value}
          </div>
          <div className="text-gray-600 text-sm">{label}</div>
        </div>
        <div className={`${color.replace('border-', 'text-')} opacity-80`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};