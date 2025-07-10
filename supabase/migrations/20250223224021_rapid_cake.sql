/*
  # Create schedules table

  1. New Tables
    - `schedules`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `service_type` (text, required)
      - `preferred_date` (date, required)
      - `preferred_time` (time, required)
      - `message` (text)
      - `status` (text, default: 'pending')
      - `created_at` (timestamp with time zone)
      
  2. Security
    - Enable RLS on `schedules` table
    - Add policy for authenticated users to read their own schedules
    - Add policy for public users to create schedules
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create a schedule" ON schedules;
DROP POLICY IF EXISTS "Users can view their own schedules" ON schedules;

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  service_type text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time time NOT NULL,
  message text,
  status schedule_status DEFAULT 'pending',
  whatsapp_notification_sent boolean DEFAULT false,
  whatsapp_confirmation_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  available_date_id uuid REFERENCES available_dates(id)
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a schedule
DROP POLICY IF EXISTS "Anyone can create a schedule" ON schedules;
CREATE POLICY "Anyone can create a schedule"
  ON schedules
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to view their own schedules
DROP POLICY IF EXISTS "Users can view their own schedules" ON schedules;
CREATE POLICY "Users can view their own schedules"
  ON schedules
  FOR SELECT
  TO authenticated
  USING (client_email = auth.jwt() ->> 'email');