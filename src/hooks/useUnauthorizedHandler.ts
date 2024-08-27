// src/hooks/useUnauthorizedHandler.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useUnauthorizedHandler = () => {
  const navigate = useNavigate();
  const { handleUnauthorized } = useAuth();

  useEffect(() => {
    const handleUnauthorizedEvent = () => {
      handleUnauthorized();
      navigate('/login');
    };

    window.addEventListener('unauthorized', handleUnauthorizedEvent);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorizedEvent);
    };
  }, [navigate, handleUnauthorized]);
};