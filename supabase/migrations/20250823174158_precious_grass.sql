/*
  # Add RLS policies for media_items table

  1. Security Policies
    - Add policy for authenticated users to insert media items
    - Add policy for authenticated users to update media items
    - Add policy for authenticated users to select media items

  This fixes the "Invalid JWT" error when populating the database from TMDB.
*/

-- Allow authenticated users to insert media items
CREATE POLICY "Authenticated users can insert media items"
  ON media_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update media items
CREATE POLICY "Authenticated users can update media items"
  ON media_items
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to select media items
CREATE POLICY "Authenticated users can select media items"
  ON media_items
  FOR SELECT
  TO authenticated
  USING (true);