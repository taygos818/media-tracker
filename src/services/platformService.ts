import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type UserIntegration = Database['public']['Tables']['user_integrations']['Row'];
type Platform = Database['public']['Tables']['platforms']['Row'];

export class PlatformService {
  // Get user's platform integrations
  static async getUserIntegrations(userId: string) {
    const { data, error } = await supabase
      .from('user_integrations')
      .select(`
        *,
        platforms(*)
      `)
      .eq('user_id', userId)
      .order('created_at');

    if (error) throw error;
    return data;
  }

  // Create or update platform integration
  static async upsertIntegration(integration: {
    userId: string;
    platformId: string;
    status?: 'connected' | 'disconnected' | 'error';
    encryptedCredentials?: string;
    syncEnabled?: boolean;
    syncIntervalMinutes?: number;
    errorMessage?: string;
  }) {
    const { data, error } = await supabase
      .from('user_integrations')
      .upsert({
        user_id: integration.userId,
        platform_id: integration.platformId,
        status: integration.status || 'disconnected',
        encrypted_credentials: integration.encryptedCredentials,
        sync_enabled: integration.syncEnabled ?? true,
        sync_interval_minutes: integration.syncIntervalMinutes || 15,
        error_message: integration.errorMessage,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform_id'
      })
      .select(`
        *,
        platforms(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Update integration status
  static async updateIntegrationStatus(
    userId: string,
    platformId: string,
    status: 'connected' | 'disconnected' | 'error',
    errorMessage?: string,
    lastSync?: string
  ) {
    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (errorMessage) {
      updates.error_message = errorMessage;
    }

    if (lastSync) {
      updates.last_sync = lastSync;
    }

    if (status === 'connected') {
      updates.error_message = null; // Clear any previous errors
    }

    const { data, error } = await supabase
      .from('user_integrations')
      .update(updates)
      .eq('user_id', userId)
      .eq('platform_id', platformId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete integration
  static async deleteIntegration(userId: string, platformId: string) {
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('user_id', userId)
      .eq('platform_id', platformId);

    if (error) throw error;
  }

  // Get integrations that need syncing
  static async getIntegrationsForSync(userId?: string) {
    let queryBuilder = supabase
      .from('user_integrations')
      .select(`
        *,
        platforms(*)
      `)
      .eq('status', 'connected')
      .eq('sync_enabled', true);

    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId);
    }

    // Only sync if last sync was more than sync_interval_minutes ago
    const now = new Date();
    queryBuilder = queryBuilder.or(
      `last_sync.is.null,last_sync.lt.${new Date(now.getTime() - 15 * 60000).toISOString()}`
    );

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data;
  }

  // Encryption helpers for credentials (basic implementation)
  static encryptCredentials(credentials: any): string {
    // In production, use a proper encryption library like crypto-js
    // This is a simplified example - DO NOT use in production
    return btoa(JSON.stringify(credentials));
  }

  static decryptCredentials(encryptedCredentials: string): any {
    // In production, use proper decryption
    // This is a simplified example - DO NOT use in production
    try {
      return JSON.parse(atob(encryptedCredentials));
    } catch {
      return null;
    }
  }

  // Enhanced encryption using Web Crypto API (more secure than btoa/atob)
  static async encryptCredentialsSecure(credentials: any, key?: string): Promise<string> {
    try {
      const data = JSON.stringify(credentials);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // In production, use a proper key from environment variables
      const keyMaterial = key || 'your-secret-key-from-env-variables-32-chars';
      const keyBuffer = encoder.encode(keyMaterial.padEnd(32, '0').slice(0, 32));
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
      
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        dataBuffer
      );
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      return this.encryptCredentials(credentials); // Fallback to simple encryption
    }
  }
  
  static async decryptCredentialsSecure(encryptedCredentials: string, key?: string): Promise<any> {
    try {
      const combined = new Uint8Array(
        atob(encryptedCredentials).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, 12);
      const encryptedData = combined.slice(12);
      
      const keyMaterial = key || 'your-secret-key-from-env-variables-32-chars';
      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(keyMaterial.padEnd(32, '0').slice(0, 32));
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encryptedData
      );
      
      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedBuffer);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Decryption failed, trying fallback:', error);
      return this.decryptCredentials(encryptedCredentials); // Fallback to simple decryption
    }
  }

  // Plex OAuth Implementation
  static generatePlexAuthUrl(): { authUrl: string; requestId: string } {
    const clientId = 'your-app-client-id'; // Replace with your Plex app client ID
    const redirectUri = `${window.location.origin}/integrations/plex/callback`;
    const requestId = crypto.randomUUID();
    
    // Store request ID for verification
    sessionStorage.setItem('plex_request_id', requestId);
    
    const authUrl = `https://app.plex.tv/auth/#` +
      `?clientID=${encodeURIComponent(clientId)}` +
      `&code=${encodeURIComponent(requestId)}` +
      `&forwardUrl=${encodeURIComponent(redirectUri)}` +
      `&context%5Bdevice%5D%5Bproduct%5D=${encodeURIComponent('MediaTracker')}`;
    
    return { authUrl, requestId };
  }
  
  static async handlePlexAuthCallback(requestId: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const storedRequestId = sessionStorage.getItem('plex_request_id');
      if (storedRequestId !== requestId) {
        throw new Error('Invalid request ID');
      }
      
      // Poll for the auth token
      const clientId = 'your-app-client-id'; // Replace with your Plex app client ID
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts with 2 second intervals = 1 minute timeout
      
      while (attempts < maxAttempts) {
        try {
          const response = await fetch(`https://plex.tv/api/v2/pins/${requestId}`, {
            headers: {
              'Accept': 'application/json',
              'X-Plex-Client-Identifier': clientId,
              'X-Plex-Product': 'MediaTracker',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.authToken) {
            sessionStorage.removeItem('plex_request_id');
            return { success: true, token: data.authToken };
          }
          
          // Wait 2 seconds before next attempt
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
        } catch (error) {
          console.warn(`Attempt ${attempts + 1} failed:`, error);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      throw new Error('Authentication timeout');
    } catch (error) {
      console.error('Plex auth callback error:', error);
      sessionStorage.removeItem('plex_request_id');
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  
  static async connectPlex(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { authUrl, requestId } = this.generatePlexAuthUrl();
      
      // Open Plex auth in a popup
      const popup = window.open(authUrl, 'plexAuth', 'width=600,height=700');
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }
      
      // Monitor popup for completion
      return new Promise((resolve) => {
        const checkClosed = setInterval(async () => {
          if (popup.closed) {
            clearInterval(checkClosed);
            
            // Check if auth was successful
            const authResult = await this.handlePlexAuthCallback(requestId);
            
            if (authResult.success && authResult.token) {
              try {
                // Get Plex platform ID
                const platforms = await supabase.from('platforms').select('id').eq('name', 'Plex').single();
                if (!platforms.data) {
                  throw new Error('Plex platform not found in database');
                }
                
                // Store encrypted credentials
                const encryptedToken = await this.encryptCredentialsSecure({ 
                  authToken: authResult.token 
                });
                
                await this.upsertIntegration({
                  userId,
                  platformId: platforms.data.id,
                  status: 'connected',
                  encryptedCredentials: encryptedToken,
                });
                
                resolve({ success: true });
              } catch (error) {
                console.error('Error storing Plex credentials:', error);
                resolve({ success: false, error: error instanceof Error ? error.message : 'Failed to store credentials' });
              }
            } else {
              resolve({ success: false, error: authResult.error || 'Authentication failed' });
            }
          }
        }, 1000);
        
        // Timeout after 5 minutes
        setTimeout(() => {
          if (!popup.closed) {
            popup.close();
          }
          clearInterval(checkClosed);
          resolve({ success: false, error: 'Authentication timeout' });
        }, 300000);
      });
    } catch (error) {
      console.error('Plex connection error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Connection failed' };
    }
  }

  // Validate platform connection
  static async validatePlatformConnection(platformId: string, credentials: any): Promise<boolean> {
    // This would contain platform-specific validation logic
    // For now, return true for demo purposes
    console.log(`Validating connection for platform ${platformId}`, credentials);
    return true;
  }

  // Sync data from platform
  static async syncPlatformData(integration: UserIntegration & { platforms: Platform }) {
    try {
      console.log(`Syncing data for ${integration.platforms.name}...`);
      
      // Update sync timestamp
      await this.updateIntegrationStatus(
        integration.user_id,
        integration.platform_id,
        'connected',
        undefined,
        new Date().toISOString()
      );

      // Platform-specific sync logic would go here
      switch (integration.platforms.name.toLowerCase()) {
        case 'plex':
          return await this.syncPlexData(integration);
        case 'netflix':
          return await this.syncNetflixData(integration);
        case 'hulu':
          return await this.syncHuluData(integration);
        default:
          console.log(`No sync implementation for ${integration.platforms.name}`);
      }

    } catch (error) {
      console.error(`Error syncing ${integration.platforms.name}:`, error);
      
      // Update integration status to error
      await this.updateIntegrationStatus(
        integration.user_id,
        integration.platform_id,
        'error',
        error instanceof Error ? error.message : 'Sync failed'
      );
      
      throw error;
    }
  }

  // Platform-specific sync methods (stubs for now)
  private static async syncPlexData(integration: UserIntegration) {
    try {
      console.log('Syncing Plex data...');
      
      // Decrypt Plex credentials
      if (!integration.encrypted_credentials) {
        throw new Error('No Plex credentials found');
      }
      
      const credentials = await this.decryptCredentialsSecure(integration.encrypted_credentials);
      if (!credentials?.authToken) {
        throw new Error('Invalid Plex credentials');
      }
      
      // Get user's Plex servers
      const serversResponse = await fetch('https://plex.tv/api/v2/servers', {
        headers: {
          'X-Plex-Token': credentials.authToken,
          'Accept': 'application/json',
        },
      });
      
      if (!serversResponse.ok) {
        throw new Error(`Failed to fetch Plex servers: ${serversResponse.status}`);
      }
      
      const serversData = await serversResponse.json();
      let totalItemsImported = 0;
      
      // Sync data from each accessible server
      for (const server of serversData) {
        if (server.owned === 1 && server.localAddresses?.length > 0) {
          try {
            const serverUrl = `http://${server.localAddresses[0]}:${server.port}`;
            
            // Get library sections
            const sectionsResponse = await fetch(`${serverUrl}/library/sections`, {
              headers: {
                'X-Plex-Token': credentials.authToken,
                'Accept': 'application/json',
              },
            });
            
            if (!sectionsResponse.ok) continue;
            
            const sectionsData = await sectionsResponse.json();
            
            // Process movie and TV libraries
            for (const section of sectionsData.MediaContainer.Directory || []) {
              if (section.type === 'movie' || section.type === 'show') {
                const itemsImported = await this.syncPlexLibrarySection(
                  serverUrl,
                  section.key,
                  section.type,
                  credentials.authToken,
                  integration.user_id
                );
                totalItemsImported += itemsImported;
              }
            }
          } catch (serverError) {
            console.warn(`Failed to sync server ${server.name}:`, serverError);
          }
        }
      }
      
      return { itemsImported: totalItemsImported, message: `Successfully imported ${totalItemsImported} items from Plex` };
    } catch (error) {
      console.error('Plex sync error:', error);
      throw error;
    }
  }
  
  private static async syncPlexLibrarySection(
    serverUrl: string,
    sectionKey: string,
    sectionType: string,
    authToken: string,
    userId: string
  ): Promise<number> {
    try {
      const response = await fetch(`${serverUrl}/library/sections/${sectionKey}/all`, {
        headers: {
          'X-Plex-Token': authToken,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch library section: ${response.status}`);
      }
      
      const data = await response.json();
      let itemsImported = 0;
      
      for (const item of data.MediaContainer.Metadata || []) {
        try {
          // Convert Plex item to our media format
          const mediaItem = {
            title: item.title,
            type: sectionType === 'movie' ? 'movie' as const : 'tv' as const,
            description: item.summary || '',
            poster_url: item.thumb ? `${serverUrl}${item.thumb}?X-Plex-Token=${authToken}` : null,
            backdrop_url: item.art ? `${serverUrl}${item.art}?X-Plex-Token=${authToken}` : null,
            year: item.year || null,
            runtime: item.duration ? Math.round(item.duration / 60000) : null, // Convert ms to minutes
            genres: item.Genre?.map((g: any) => g.tag) || [],
            rating_imdb: item.rating || null,
            tagline: item.tagline || null,
            metadata: {
              plex_key: item.key,
              plex_guid: item.guid,
              plex_server: serverUrl,
              source: 'plex'
            }
          };
          
          // Save to database using MediaService
          const { MediaService } = await import('./mediaService');
          await MediaService.upsertMediaItem(mediaItem);
          
          // Record as watched if it has view count
          if (item.viewCount && item.viewCount > 0) {
            await MediaService.recordWatchSession({
              userId,
              mediaItemId: mediaItem.title, // We'll need to get the actual ID after insert
              startedAt: item.lastViewedAt ? new Date(item.lastViewedAt * 1000).toISOString() : new Date().toISOString(),
              progressSeconds: item.duration ? Math.round(item.duration / 1000) : 7200,
              totalRuntimeSeconds: item.duration ? Math.round(item.duration / 1000) : 7200,
              completed: true,
              deviceType: 'plex',
            });
          }
          
          itemsImported++;
        } catch (itemError) {
          console.warn(`Failed to import item ${item.title}:`, itemError);
        }
      }
      
      return itemsImported;
    } catch (error) {
      console.error(`Error syncing library section ${sectionKey}:`, error);
      return 0;
    }
  }

  private static async syncNetflixData(integration: UserIntegration) {
    // Implement Netflix data extraction (likely requires browser extension)
    console.log('Syncing Netflix data...');
    return { itemsImported: 0, message: 'Netflix sync not yet implemented' };
  }

  private static async syncHuluData(integration: UserIntegration) {
    // Implement Hulu data extraction
    console.log('Syncing Hulu data...');
    return { itemsImported: 0, message: 'Hulu sync not yet implemented' };
  }
}