import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCounts = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCounts = async () => {
    try {
      setError(null);
      const response = await axios.get('http://localhost:5000/api/counts');
      setCounts(response.data);
      // Emit event to notify other components
      window.dispatchEvent(new CustomEvent('countsUpdated', { detail: response.data }));
    } catch (err) {
      setError('Error al cargar los contadores');
      console.error('Error fetching counts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  // Listen for count updates from other components
  useEffect(() => {
    const handleCountUpdate = (event) => {
      if (event.detail) {
        setCounts(event.detail);
      } else {
        fetchCounts();
      }
    };

    window.addEventListener('countsUpdated', handleCountUpdate);
    window.addEventListener('sidebarCountsUpdated', handleCountUpdate);
    
    return () => {
      window.removeEventListener('countsUpdated', handleCountUpdate);
      window.removeEventListener('sidebarCountsUpdated', handleCountUpdate);
    };
  }, []);

  return { counts, loading, error, refetch: fetchCounts };
};
