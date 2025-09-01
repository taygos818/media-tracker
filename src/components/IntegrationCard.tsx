import React from 'react';
import { Settings, RefreshCw, Unlink, Link, AlertTriangle } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  itemsCount: number;
  error?: string;
  apiEndpoint: string;
  requiresAuth: boolean;
}

interface IntegrationCardProps {
  integration: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  onConfigure: () => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onDisconnect,
  onSync,
  onConfigure
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'error': return 'Error';
      default: return 'Not Connected';
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-650 transition-colors">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{integration.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{integration.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
              {getStatusText(integration.status)}
            </span>
          </div>
          
          <p className="text-sm text-gray-400 mb-3">{integration.description}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Last Sync:</span>
              <span className="text-gray-300">{integration.lastSync}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Items:</span>
              <span className="text-gray-300">{integration.itemsCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">API:</span>
              <span className="text-gray-300 text-xs font-mono truncate max-w-48">
                {integration.apiEndpoint}
              </span>
            </div>
          </div>

          {integration.error && (
            <div className="mt-3 p-2 bg-red-900/30 border border-red-700 rounded-md">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{integration.error}</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            {integration.status === 'connected' ? (
              <>
                <button
                  onClick={onSync}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </button>
                <button
                  onClick={onConfigure}
                  className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={onDisconnect}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onConnect}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Link className="w-4 h-4" />
                Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};