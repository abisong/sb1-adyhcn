import React, { useState } from 'react';
import { DiseaseOutbreak } from '../../types/livestock';
import { Card } from '../ui/Card';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Pagination } from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface Props {
  outbreaks: DiseaseOutbreak[];
  onOutbreakUpdate: (outbreak: DiseaseOutbreak) => void;
}

export const DiseaseMonitor: React.FC<Props> = ({ outbreaks, onOutbreakUpdate }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({
    disease: '',
    location: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    affectedSpecies: [] as string[],
    radius: 10,
    confirmedCases: 1
  });
  
  const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedOutbreaks,
    handlePageChange 
  } = usePagination(outbreaks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()), 5);

  const handleSpeciesToggle = (species: string) => {
    setReportForm(prev => ({
      ...prev,
      affectedSpecies: prev.affectedSpecies.includes(species)
        ? prev.affectedSpecies.filter(s => s !== species)
        : [...prev.affectedSpecies, species]
    }));
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReporting(true);
    try {
      const outbreak: DiseaseOutbreak = {
        id: crypto.randomUUID(),
        disease: reportForm.disease,
        location: reportForm.location,
        severity: reportForm.severity,
        affectedSpecies: reportForm.affectedSpecies,
        timestamp: new Date(),
        radius: reportForm.radius,
        confirmedCases: reportForm.confirmedCases
      };
      
      await onOutbreakUpdate(outbreak);
      
      // Reset form
      setReportForm({
        disease: '',
        location: '',
        severity: 'medium',
        affectedSpecies: [],
        radius: 10,
        confirmedCases: 1
      });
      setShowReportForm(false);
    } catch (error) {
      console.error('Error reporting outbreak:', error);
    } finally {
      setIsReporting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card
      header={
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Disease Outbreak Monitor</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReportForm(true)}
            className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            Report Outbreak
          </motion.button>
        </div>
      }
    >
      <div className="space-y-6">
        {showReportForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 rounded-lg p-6 border border-red-200"
          >
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Disease Name*
                  </label>
                  <input
                    type="text"
                    value={reportForm.disease}
                    onChange={(e) => setReportForm(prev => ({ ...prev, disease: e.target.value }))}
                    className="w-full p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Enter disease name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    value={reportForm.location}
                    onChange={(e) => setReportForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">
                  Severity*
                </label>
                <select
                  value={reportForm.severity}
                  onChange={(e) => setReportForm(prev => ({ 
                    ...prev, 
                    severity: e.target.value as 'low' | 'medium' | 'high' 
                  }))}
                  className="w-full p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Affected Species*
                </label>
                <div className="flex flex-wrap gap-2">
                  {['cow', 'sheep', 'chicken'].map((species) => (
                    <button
                      key={species}
                      type="button"
                      onClick={() => handleSpeciesToggle(species)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        reportForm.affectedSpecies.includes(species)
                          ? 'bg-red-200 text-red-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {species.charAt(0).toUpperCase() + species.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Radius (km)*
                  </label>
                  <input
                    type="number"
                    value={reportForm.radius}
                    onChange={(e) => setReportForm(prev => ({ 
                      ...prev, 
                      radius: parseInt(e.target.value) || 0 
                    }))}
                    className="w-full p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Confirmed Cases*
                  </label>
                  <input
                    type="number"
                    value={reportForm.confirmedCases}
                    onChange={(e) => setReportForm(prev => ({ 
                      ...prev, 
                      confirmedCases: parseInt(e.target.value) || 0 
                    }))}
                    className="w-full p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReportForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isReporting || !reportForm.disease || !reportForm.location || reportForm.affectedSpecies.length === 0}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg transition-all duration-200 ${
                    isReporting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-red-700'
                  }`}
                >
                  {isReporting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Report'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Outbreaks</h3>
          {paginatedOutbreaks.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No disease outbreaks reported yet.</p>
          ) : (
            paginatedOutbreaks.map((outbreak) => (
              <motion.div
                key={outbreak.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{outbreak.disease}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${getSeverityColor(outbreak.severity)}`}>
                    {outbreak.severity}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span>{outbreak.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Affected Species:</span>
                    <span>{outbreak.affectedSpecies.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Radius:</span>
                    <span>{outbreak.radius} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confirmed Cases:</span>
                    <span>{outbreak.confirmedCases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reported:</span>
                    <span>{format(outbreak.timestamp, 'MMM d, HH:mm')}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}

          {paginatedOutbreaks.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </Card>
  );
};