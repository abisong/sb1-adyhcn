import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  color: string;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: any) => void;
}

export const TabSelector: React.FC<Props> = ({ tabs, activeTab, onTabChange }) => {
  const getTabColor = (color: string, isActive: boolean) => {
    const colorMap: Record<string, { bg: string, text: string, hover: string }> = {
      blue: {
        bg: isActive ? 'bg-blue-100' : 'bg-transparent',
        text: isActive ? 'text-blue-700' : 'text-gray-600',
        hover: 'hover:bg-blue-50',
      },
      pink: {
        bg: isActive ? 'bg-pink-100' : 'bg-transparent',
        text: isActive ? 'text-pink-700' : 'text-gray-600',
        hover: 'hover:bg-pink-50',
      },
      indigo: {
        bg: isActive ? 'bg-indigo-100' : 'bg-transparent',
        text: isActive ? 'text-indigo-700' : 'text-gray-600',
        hover: 'hover:bg-indigo-50',
      },
      green: {
        bg: isActive ? 'bg-green-100' : 'bg-transparent',
        text: isActive ? 'text-green-700' : 'text-gray-600',
        hover: 'hover:bg-green-50',
      },
      red: {
        bg: isActive ? 'bg-red-100' : 'bg-transparent',
        text: isActive ? 'text-red-700' : 'text-gray-600',
        hover: 'hover:bg-red-50',
      },
      purple: {
        bg: isActive ? 'bg-purple-100' : 'bg-transparent',
        text: isActive ? 'text-purple-700' : 'text-gray-600',
        hover: 'hover:bg-purple-50',
      },
      gray: {
        bg: isActive ? 'bg-gray-100' : 'bg-transparent',
        text: isActive ? 'text-gray-700' : 'text-gray-600',
        hover: 'hover:bg-gray-50',
      },
    };

    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const colors = getTabColor(tab.color, isActive);

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${colors.bg} ${colors.text} ${colors.hover}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.label}
            {isActive && (
              <motion.div
                className="h-0.5 bg-current mt-1"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};