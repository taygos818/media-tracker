import React, { useState } from 'react';
import { Check, AlertCircle, Settings, RefreshCw, Plus } from 'lucide-react';
import { IntegrationCard } from '../components/IntegrationCard';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';

const integrations = [
  {
    id: 'plex',
    name: 'Plex',
    description: 'Connect to your personal Plex media server',
    icon: '🎬',
    status: 'connected',
    lastSync: '2 minutes ago',
    itemsCount: 1247,
    apiEndpoint: 'https://plex.tv/api/v2',
    requiresAuth: true
  },
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'Track your Netflix viewing history',
    icon: '🔴',
    status: 'connected',
    lastSync: '1 hour ago',
    itemsCount: 423,
    apiEndpoint: 'Netflix API (Web Scraping)',
    requiresAuth: true
  },
  {
    id: 'hulu',
    name: 'Hulu',
    description: 'Monitor your Hulu watch activity',
    icon: '🟢',
    status: 'error',
    lastSync: '3 days ago',
    itemsCount: 156,
    error: 'Authentication expired',
    apiEndpoint: 'Hulu API',
    requiresAuth: true
  },
  {
    id: 'disney',
    name: 'Disney+',
    description: 'Sync Disney+ viewing data',
    icon: '⭐',
    status: 'disconnected',
    lastSync: 'Never',
    itemsCount: 0,
    apiEndpoint: 'Disney+ API',
    requiresAuth: true
  },
  {
    id: 'prime',
    name: 'Amazon Prime',
    description: 'Connect Amazon Prime Video',
    icon: '📦',
    status: 'connected',
    lastSync: '30 minutes ago',
    itemsCount: 234,
    apiEndpoint: 'Amazon Prime API',
    requiresAuth: true
  },
  {
    id: 'tmdb',
    name: 'TMDB',
    description: 'The Movie Database for metadata',
    icon: '🎭',
    status: 'connected',
    lastSync: 'Real-time',
    itemsCount: 0,
    apiEndpoint: 'https://api.themoviedb.org/3',
    requiresAuth: false
  }
];

export const Integrations: React.FC = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleConnect = (integrationId: string) => {
    showToast('Integration connected successfully!', 'success');
  };

  const handleDisconnect = (integrationId: string) => {
    showToast('Integration disconnected', 'info');
  };

  const handleSync = (integrationId: string) => {
    showToast('Sync started', 'info');
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Integrations</h1>
        <p className="text-gray-400">
          Connect your streaming services and media servers to automatically track your viewing history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{connectedCount}</div>
              <div className="text-sm text-gray-400">Connected</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{errorCount}</div>
              <div className="text-sm text-gray-400">Need Attention</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <RefreshCw className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">2.1k</div>
              <div className="text-sm text-gray-400">Total Items</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Available Integrations</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Custom Integration
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConnect={() => handleConnect(integration.id)}
              onDisconnect={() => handleDisconnect(integration.id)}
              onSync={() => handleSync(integration.id)}
              onConfigure={() => setSelectedIntegration(integration.id)}
            />
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Integration Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium text-green-400 mb-2">✓ Supported Platforms</h3>
            <ul className="space-y-1 text-gray-400">
              <li>• Plex Media Server (Full API Support)</li>
              <li>• TMDB (Metadata & Information)</li>
              <li>• IMDb (Ratings & Reviews)</li>
              <li>• Trakt.tv (Social Features)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-yellow-400 mb-2">⚠ Limited Support</h3>
            <ul className="space-y-1 text-gray-400">
              <li>• Netflix (Browser Extension Required)</li>
              <li>• Hulu (Account Linking)</li>
              <li>• Disney+ (Beta Integration)</li>
              <li>• Amazon Prime (Limited Data)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};