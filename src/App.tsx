import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthWrapper } from './components/AuthWrapper';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Watchlist } from './pages/Watchlist';
import { MediaDetail } from './pages/MediaDetail';
import { Settings } from './pages/Settings';
import { Integrations } from './pages/Integrations';
import { Analytics } from './pages/Analytics';
import { PlexAuthCallback } from './pages/PlexAuthCallback';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import { MediaProvider } from './context/MediaContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './hooks/useAuth';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ToastProvider>
      <AuthWrapper>
        <MediaProvider>
          <Router>
            <div className="min-h-screen bg-gray-900 text-white">
              <div className="flex">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/watchlist" element={<Watchlist />} />
                      <Route path="/media/:id" element={<MediaDetail />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/integrations" element={<Integrations />} />
                      <Route path="/integrations/plex/callback" element={<PlexAuthCallback />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </div>
          </Router>
        </MediaProvider>
      </AuthWrapper>
    </ToastProvider>
  );
}

export default App;