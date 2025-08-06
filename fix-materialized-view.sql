-- Drop the existing materialized view
DROP MATERIALIZED VIEW IF EXISTS public.leaderboard_view;

-- Create the materialized view with proper configuration
CREATE MATERIALIZED VIEW public.leaderboard_view AS
SELECT 
    u.id,
    u.twitter_id,
    u.username,
    u.display_name,
    u.profile_image_url,
    COALESCE(SUM(up.points), 0) as total_points,
    COALESCE(SUM(up.usda_amount), 0) as total_usda,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(up.points), 0) DESC) as rank
FROM public.users u
LEFT JOIN public.user_points up ON u.id = up.user_id
GROUP BY u.id, u.twitter_id, u.username, u.display_name, u.profile_image_url
ORDER BY total_points DESC;

-- Create a unique index (required for concurrent refresh)
CREATE UNIQUE INDEX leaderboard_view_rank_idx ON public.leaderboard_view (rank);

-- Create the refresh function
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_view;
END;
$$ LANGUAGE plpgsql; 