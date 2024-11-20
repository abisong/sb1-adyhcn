import React, { useState } from 'react';
import { Animal } from '../../types/livestock';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface Props {
  onSubmit: (animal: Omit<Animal, 'id'>) => void;
  existingAnimal?: Animal;
  onCancel: () => void;
}

export const AnimalForm: React.FC<Props> = ({ onSubmit, existingAnimal, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Animal>>({
    name: existingAnimal?.name || '',
    type: existingAnimal?.type || 'cow',
    age: existingAnimal?.age || 0,
    health: existingAnimal?.health || {
      temperature: 38.5,
      heartRate: 65,
      lastCheckup: new Date(),
    },
    location: existingAnimal?.location || {
      latitude: 51.5074,
      longitude: -0.1278,
      lastUpdate: new Date(),
    },
    breeding: existingAnimal?.breeding || {
      lastBreeding: null,
      fertility: 85,
      nextOptimalDate: null,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Animal, 'id'>);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof Animal],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Card
      header={
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {existingAnimal ? 'Update Animal' : 'Add New Animal'}
          </h2>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="cow">Cow</option>
              <option value="sheep">Sheep</option>
              <option value="chicken">Chicken</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature (°C)
            </label>
            <input
              type="number"
              name="health.temperature"
              value={formData.health?.temperature}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heart Rate (BPM)
            </label>
            <input
              type="number"
              name="health.heartRate"
              value={formData.health?.heartRate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fertility (%)
            </label>
            <input
              type="number"
              name="breeding.fertility"
              value={formData.breeding?.fertility}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {existingAnimal ? 'Update' : 'Add'} Animal
          </motion.button>
        </div>
      </form>
    </Card>
  );
};