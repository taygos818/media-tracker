import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformService } from '../services/platformService';
import { useToast } from '../context/ToastContext';
import { LoadingScreen } from '../components/LoadingScreen';

export const PlexAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the request ID from URL hash or query params
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const requestId = urlParams.get('code') || hashParams.get('code');
        
        if (!requestId) {
          throw new Error('No authorization code found');
        }

        setStatus('processing');
        
        // Handle the Plex auth callback
        const result = await PlatformService.handlePlexAuthCallback(requestId);
        
        if (result.success) {
          setStatus('success');
          showToast('Plex authentication successful!', 'success');
          
          // Close popup if this is running in a popup
          if (window.opener) {
            window.close();
          } else {
            // Navigate back to integrations page
            setTimeout(() => {
              navigate('/integrations');
            }, 2000);
          }
        } else {
          throw new Error(result.error || 'Authentication failed');
        }
      } catch (error) {
        console.error('Plex auth callback error:', error);
        setStatus('error');
        showToast(
          error instanceof Error ? error.message : 'Authentication failed',
          'error'
        );
        
        // Close popup or navigate back after error
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            navigate('/integrations');
          }
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, showToast]);

  if (status === 'processing') {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {status === 'success' ? (
          <div>
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
            <p className="text-gray-400">Plex has been connected successfully.</p>
            <p className="text-sm text-gray-500 mt-2">This window will close automatically...</p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-gray-400">There was an error connecting to Plex.</p>
            <p className="text-sm text-gray-500 mt-2">This window will close automatically...</p>
          </div>
        )}
      </div>
    </div>
  );
};