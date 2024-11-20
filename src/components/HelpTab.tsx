import React from 'react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';

export const HelpTab: React.FC = () => {
  return (
    <Card>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose max-w-none"
      >
        <h2 className="text-2xl font-bold mb-6">Livestock Management AI Help Guide</h2>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold text-blue-700">Overview</h3>
            <p className="text-gray-700">
              The Livestock Management AI system is a comprehensive solution for monitoring and managing livestock health, breeding, feeding, and overall farm operations. The system uses artificial intelligence to provide real-time insights and recommendations.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-blue-700">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">Health Monitor</h4>
                <p className="text-sm text-gray-600">Tracks vital signs and alerts for health issues</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold text-pink-800">Breeding Predictor</h4>
                <p className="text-sm text-gray-600">Calculates optimal breeding times</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Feed Optimizer</h4>
                <p className="text-sm text-gray-600">Suggests optimal nutrition plans</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800">Location Tracker</h4>
                <p className="text-sm text-gray-600">Monitors animal movement and behavior</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-blue-700">How to Use</h3>
            
            <div className="space-y-4 mt-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Health Monitoring</h4>
                <ol className="list-decimal list-inside text-sm text-gray-700 ml-4">
                  <li>Select an animal from the Health Monitor panel</li>
                  <li>Click "Check Vitals" to perform a health check</li>
                  <li>Review alerts for any health concerns</li>
                </ol>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-semibold">Breeding Management</h4>
                <ol className="list-decimal list-inside text-sm text-gray-700 ml-4">
                  <li>Navigate to the Breeding Predictor</li>
                  <li>Select an animal to analyze</li>
                  <li>Click "Calculate Optimal Breeding Time"</li>
                  <li>Review breeding recommendations and optimal dates</li>
                </ol>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">Feed Optimization</h4>
                <ol className="list-decimal list-inside text-sm text-gray-700 ml-4">
                  <li>Choose an animal in the Feed Optimizer</li>
                  <li>Click "Calculate Optimal Nutrition"</li>
                  <li>View recommended nutrition plans and schedules</li>
                </ol>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4">
                <h4 className="font-semibold">Location Tracking</h4>
                <ol className="list-decimal list-inside text-sm text-gray-700 ml-4">
                  <li>Find your animal in the Livestock Tracker</li>
                  <li>Click "Update Location" to refresh position</li>
                  <li>Monitor movement patterns and behavior</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-blue-700">Tips & Best Practices</h3>
            <ul className="list-disc list-inside space-y-2 mt-4 text-gray-700">
              <li>Regular health checks: Monitor vitals at least twice daily</li>
              <li>Breeding timing: Follow AI recommendations for optimal results</li>
              <li>Nutrition plans: Update feeding schedules based on season</li>
              <li>Location updates: Track movement patterns for early warning signs</li>
              <li>Disease prevention: Monitor outbreak alerts in your region</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-blue-700">Support</h3>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="text-gray-700">
                For additional support or questions, please contact our support team:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>Email: support@livestock-ai.com</li>
                <li>Phone: 1-800-FARM-AI</li>
                <li>Hours: 24/7 Support Available</li>
              </ul>
            </div>
          </section>
        </div>
      </motion.div>
    </Card>
  );
};