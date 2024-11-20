import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', header }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {header}
      <div className="p-6">{children}</div>
    </motion.div>
  );
};