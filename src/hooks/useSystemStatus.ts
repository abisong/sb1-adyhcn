import { useState, useEffect } from 'react';
import { db, initializeDatabase } from '../database/db';

export const useSystemStatus = () => {
  const [isActive, setIsActive] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [services, setServices] = useState({
    database: false,
    monitoring: false,
    tracking: false
  });

  useEffect(() => {
    let mounted = true;
    let checkInterval: NodeJS.Timeout;

    const checkServices = async () => {
      if (!mounted) return;

      try {
        // Initialize database if needed
        const dbStatus = await initializeDatabase();
        
        if (!mounted) return;

        // Set service statuses
        const serviceStatus = {
          database: dbStatus,
          monitoring: true,
          tracking: true
        };

        setServices(serviceStatus);
        setIsActive(Object.values(serviceStatus).every(status => status));
        setLastCheck(new Date());
      } catch (error) {
        console.error('Error checking system status:', error);
        if (mounted) {
          setIsActive(false);
          setServices(prev => ({ ...prev, database: false }));
        }
      }
    };

    // Initial check
    checkServices();

    // Set up interval for periodic checks
    checkInterval = setInterval(checkServices, 30000);

    // Cleanup function
    return () => {
      mounted = false;
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, []);

  return {
    isActive,
    lastCheck,
    services
  };
};