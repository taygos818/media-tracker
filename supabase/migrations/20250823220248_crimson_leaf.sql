/*
  # Add Plex Platform

  1. New Platform Entry
    - Adds Plex as a platform in the platforms table
    - Sets up proper configuration for Plex Media Server integration

  2. Platform Configuration
    - Name: 'Plex'
    - Type: 'personal' (since it's a personal media server)
    - Requires authentication: true
    - API endpoint: Plex.tv API
*/

-- Insert Plex platform if it doesn't exist
INSERT INTO platforms (name, type, api_endpoint, requires_auth, description)
VALUES (
  'Plex',
  'personal',
  'https://plex.tv/api/v2',
  true,
  'Connect to your personal Plex Media Server to sync your media library and watch history'
)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  api_endpoint = EXCLUDED.api_endpoint,
  requires_auth = EXCLUDED.requires_auth;