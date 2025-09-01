import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthForm } from './AuthForm';
import { LoadingScreen } from './LoadingScreen';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
};