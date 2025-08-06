-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.daily_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_id text NOT NULL,
  completed_at timestamp with time zone DEFAULT now(),
  claimed_at timestamp with time zone DEFAULT now(),
  next_available_at timestamp with time zone DEFAULT (now() + '24:00:00'::interval),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT daily_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT daily_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT daily_tasks_unique_user_task UNIQUE (user_id, task_id)
);

-- Indexes for better performance
CREATE INDEX idx_daily_tasks_user_task ON daily_tasks(user_id, task_id);
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_user_points_source ON user_points(source);
CREATE INDEX idx_users_twitter_id ON users(twitter_id);

CREATE TABLE public.user_points (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  points integer NOT NULL DEFAULT 0,
  usda_amount numeric NOT NULL DEFAULT 0,
  source text NOT NULL,
  referred_user_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_points_pkey PRIMARY KEY (id),
  CONSTRAINT user_points_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_points_referred_user_id_fkey FOREIGN KEY (referred_user_id) REFERENCES public.users(id)
);

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  twitter_id text NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  display_name text,
  profile_image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  session_token text,
  tasks boolean DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Materialized view for leaderboard (refreshed every 5 minutes)
CREATE MATERIALIZED VIEW leaderboard_view AS
SELECT 
  u.id,
  u.twitter_id,
  u.username,
  u.display_name,
  u.profile_image_url,
  COALESCE(SUM(up.points), 0) as total_points,
  COALESCE(SUM(up.usda_amount), 0) as total_usda,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(up.points), 0) DESC) as rank
FROM users u
LEFT JOIN user_points up ON u.id = up.user_id
GROUP BY u.id, u.twitter_id, u.username, u.display_name, u.profile_image_url
HAVING COALESCE(SUM(up.points), 0) > 0
ORDER BY total_points DESC;

-- Index on materialized view
CREATE INDEX idx_leaderboard_rank ON leaderboard_view(rank);
CREATE INDEX idx_leaderboard_points ON leaderboard_view(total_points DESC);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_view;
END;
$$ LANGUAGE plpgsql;

-- Function to get top 100 + current user
CREATE OR REPLACE FUNCTION get_leaderboard_with_current_user(current_user_id uuid)
RETURNS TABLE (
  id uuid,
  twitter_id text,
  username text,
  display_name text,
  profile_image_url text,
  total_points bigint,
  total_usda numeric,
  rank bigint,
  is_current_user boolean
) AS $$
BEGIN
  RETURN QUERY
  (
    -- Get top 100
    SELECT 
      lv.id,
      lv.twitter_id,
      lv.username,
      lv.display_name,
      lv.profile_image_url,
      lv.total_points,
      lv.total_usda,
      lv.rank,
      (lv.id = current_user_id) as is_current_user
    FROM leaderboard_view lv
    WHERE lv.rank <= 100
    
    UNION ALL
    
    -- Get current user if not in top 100
    SELECT 
      lv.id,
      lv.twitter_id,
      lv.username,
      lv.display_name,
      lv.profile_image_url,
      lv.total_points,
      lv.total_usda,
      lv.rank,
      true as is_current_user
    FROM leaderboard_view lv
    WHERE lv.id = current_user_id 
      AND lv.rank > 100
  )
  ORDER BY 
    is_current_user DESC, -- Current user first
    rank ASC; -- Then by rank
END;
$$ LANGUAGE plpgsql;