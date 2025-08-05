-- Insert user_points for all 100 users with realistic data
-- This will create a proper leaderboard with varied points and USDA amounts

INSERT INTO public.user_points (user_id, points, usda_amount, source, created_at) 
SELECT 
  u.id,
  -- Generate realistic points distribution
  CASE 
    WHEN u.username IN ('crypto_whale', 'defi_protocol', 'crypto_fund_manager') THEN FLOOR(RANDOM() * 5000) + 8000  -- Top tier: 8000-13000
    WHEN u.username IN ('crypto_enthusiast', 'blockchain_dev', 'defi_trader', 'smart_contract') THEN FLOOR(RANDOM() * 3000) + 5000  -- High tier: 5000-8000
    WHEN u.username IN ('nft_collector', 'web3_builder', 'crypto_analyst', 'token_investor', 'yield_farmer') THEN FLOOR(RANDOM() * 2000) + 3000  -- Mid-high tier: 3000-5000
    WHEN u.username IN ('dao_member', 'liquidity_provider', 'staking_validator', 'governance_voter', 'crypto_miner') THEN FLOOR(RANDOM() * 1500) + 2000  -- Mid tier: 2000-3500
    WHEN u.username IN ('token_launcher', 'defi_architect', 'crypto_educator', 'blockchain_researcher', 'defi_consultant') THEN FLOOR(RANDOM() * 1000) + 1500  -- Mid-low tier: 1500-2500
    ELSE FLOOR(RANDOM() * 800) + 500  -- Base tier: 500-1300
  END,
  -- Generate realistic USDA amounts based on points
  CASE 
    WHEN u.username IN ('crypto_whale', 'defi_protocol', 'crypto_fund_manager') THEN FLOOR(RANDOM() * 2000) + 3000  -- Top tier: 3000-5000
    WHEN u.username IN ('crypto_enthusiast', 'blockchain_dev', 'defi_trader', 'smart_contract') THEN FLOOR(RANDOM() * 1500) + 2000  -- High tier: 2000-3500
    WHEN u.username IN ('nft_collector', 'web3_builder', 'crypto_analyst', 'token_investor', 'yield_farmer') THEN FLOOR(RANDOM() * 1000) + 1200  -- Mid-high tier: 1200-2200
    WHEN u.username IN ('dao_member', 'liquidity_provider', 'staking_validator', 'governance_voter', 'crypto_miner') THEN FLOOR(RANDOM() * 800) + 800  -- Mid tier: 800-1600
    WHEN u.username IN ('token_launcher', 'defi_architect', 'crypto_educator', 'blockchain_researcher', 'defi_consultant') THEN FLOOR(RANDOM() * 600) + 500  -- Mid-low tier: 500-1100
    ELSE FLOOR(RANDOM() * 400) + 200  -- Base tier: 200-600
  END,
  -- Different sources for variety
  CASE 
    WHEN u.username IN ('crypto_whale', 'defi_protocol', 'crypto_fund_manager') THEN 'whale_engagement'
    WHEN u.username IN ('crypto_enthusiast', 'blockchain_dev', 'defi_trader', 'smart_contract') THEN 'developer_engagement'
    WHEN u.username IN ('nft_collector', 'web3_builder', 'crypto_analyst', 'token_investor', 'yield_farmer') THEN 'investor_engagement'
    WHEN u.username IN ('dao_member', 'liquidity_provider', 'staking_validator', 'governance_voter', 'crypto_miner') THEN 'validator_engagement'
    WHEN u.username IN ('token_launcher', 'defi_architect', 'crypto_educator', 'blockchain_researcher', 'defi_consultant') THEN 'expert_engagement'
    ELSE 'community_engagement'
  END,
  -- Random dates within last 30 days
  NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30)
FROM public.users u;

-- Insert additional points for top users to create more competition
INSERT INTO public.user_points (user_id, points, usda_amount, source, created_at) 
SELECT 
  u.id,
  FLOOR(RANDOM() * 2000) + 1000, -- Additional 1000-3000 points
  FLOOR(RANDOM() * 1000) + 500,  -- Additional 500-1500 USDA
  'bonus_engagement',
  NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 15) -- Within last 15 days
FROM public.users u
WHERE u.username IN (
  'crypto_whale', 'defi_protocol', 'crypto_fund_manager', 'crypto_enthusiast', 
  'blockchain_dev', 'defi_trader', 'smart_contract', 'nft_collector', 
  'web3_builder', 'crypto_analyst', 'token_investor', 'yield_farmer'
);

-- Insert referral points for some users
INSERT INTO public.user_points (user_id, points, usda_amount, source, created_at, referred_user_id) 
SELECT 
  u.id,
  FLOOR(RANDOM() * 500) + 200, -- Referral bonus: 200-700 points
  FLOOR(RANDOM() * 300) + 100, -- Referral bonus: 100-400 USDA
  'referral_bonus',
  NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 10), -- Within last 10 days
  (SELECT id FROM public.users WHERE username = 'crypto_whale' LIMIT 1) -- Referred by crypto_whale
FROM public.users u
WHERE u.username IN (
  'defi_trader', 'smart_contract', 'nft_collector', 'web3_builder', 
  'crypto_analyst', 'token_investor', 'yield_farmer', 'dao_member'
);

-- Insert milestone rewards for top performers
INSERT INTO public.user_points (user_id, points, usda_amount, source, created_at) 
SELECT 
  u.id,
  CASE 
    WHEN u.username = 'crypto_whale' THEN 5000  -- Top performer bonus
    WHEN u.username = 'defi_protocol' THEN 4000
    WHEN u.username = 'crypto_fund_manager' THEN 3500
    ELSE 1000
  END,
  CASE 
    WHEN u.username = 'crypto_whale' THEN 2500  -- Top performer USDA bonus
    WHEN u.username = 'defi_protocol' THEN 2000
    WHEN u.username = 'crypto_fund_manager' THEN 1750
    ELSE 500
  END,
  'milestone_reward',
  NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 5) -- Within last 5 days
FROM public.users u
WHERE u.username IN ('crypto_whale', 'defi_protocol', 'crypto_fund_manager', 'crypto_enthusiast', 'blockchain_dev'); 