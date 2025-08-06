-- Update existing daily_tasks table with RLS policies
-- This script should be run after the table already exists

-- Enable RLS (Row Level Security) on existing table
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own daily tasks" ON public.daily_tasks;
DROP POLICY IF EXISTS "Users can insert their own daily tasks" ON public.daily_tasks;
DROP POLICY IF EXISTS "Users can update their own daily tasks" ON public.daily_tasks;
DROP POLICY IF EXISTS "Service role can manage all daily tasks" ON public.daily_tasks;

-- Create RLS policies
-- Policy for users to read their own daily tasks
CREATE POLICY "Users can view their own daily tasks" ON public.daily_tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own daily tasks
CREATE POLICY "Users can insert their own daily tasks" ON public.daily_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own daily tasks
CREATE POLICY "Users can update their own daily tasks" ON public.daily_tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for service role to manage all daily tasks (for API operations)
CREATE POLICY "Service role can manage all daily tasks" ON public.daily_tasks
  FOR ALL USING (auth.role() = 'service_role');

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'daily_tasks_unique_user_task'
    ) THEN
        ALTER TABLE public.daily_tasks ADD CONSTRAINT daily_tasks_unique_user_task UNIQUE (user_id, task_id);
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON public.daily_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_next_available ON public.daily_tasks(next_available_at);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS check_daily_tasks_available(uuid);
DROP FUNCTION IF EXISTS complete_daily_task(uuid, text);
DROP FUNCTION IF EXISTS claim_daily_rewards(uuid);

-- Function to check if daily tasks are available
CREATE OR REPLACE FUNCTION check_daily_tasks_available(user_uuid uuid)
RETURNS TABLE(
  task_id text,
  is_available boolean,
  time_remaining interval,
  is_completed boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dt.task_id,
    CASE 
      WHEN dt.next_available_at <= now() THEN true
      ELSE false
    END as is_available,
    CASE 
      WHEN dt.next_available_at > now() THEN dt.next_available_at - now()
      ELSE interval '0'
    END as time_remaining,
    CASE 
      WHEN dt.completed_at IS NOT NULL THEN true
      ELSE false
    END as is_completed
  FROM (
    SELECT 'daily_1' as task_id
    UNION ALL
    SELECT 'daily_2' as task_id
  ) tasks
  LEFT JOIN public.daily_tasks dt ON dt.user_id = user_uuid AND dt.task_id = tasks.task_id
  WHERE dt.id IS NULL OR dt.next_available_at <= now() OR dt.completed_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to complete a daily task
CREATE OR REPLACE FUNCTION complete_daily_task(user_uuid uuid, task_id_param text)
RETURNS void AS $$
BEGIN
  INSERT INTO public.daily_tasks (user_id, task_id, completed_at, next_available_at)
  VALUES (user_uuid, task_id_param, now(), now() + interval '24 hours')
  ON CONFLICT (user_id, task_id)
  DO UPDATE SET 
    completed_at = now(),
    next_available_at = now() + interval '24 hours',
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Function to claim daily rewards
CREATE OR REPLACE FUNCTION claim_daily_rewards(user_uuid uuid)
RETURNS integer AS $$
DECLARE
  points_earned integer := 100; -- 50 points per daily task
BEGIN
  -- Update daily tasks to mark as claimed
  UPDATE public.daily_tasks 
  SET claimed_at = now(), updated_at = now()
  WHERE user_id = user_uuid 
    AND task_id IN ('daily_1', 'daily_2')
    AND completed_at IS NOT NULL
    AND claimed_at IS NULL;
  
  -- Add points to user
  INSERT INTO public.user_points (user_id, points, usda_amount, source)
  VALUES (user_uuid, points_earned, 0, 'daily_tasks');
  
  RETURN points_earned;
END;
$$ LANGUAGE plpgsql; 