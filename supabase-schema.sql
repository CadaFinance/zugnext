-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

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