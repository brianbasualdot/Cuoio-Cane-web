-- Migration: 20260117000000_add_operative_fields_to_profiles
-- Description: Add alias, operative_code, and is_active to profiles for Staff management

ALTER TABLE profiles
ADD COLUMN alias TEXT UNIQUE,
ADD COLUMN operative_code TEXT, -- Storing raw 2-digit code for Admin management (Requirements: "00-99")
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Ensure alias is case-insensitive unique if desired, but standard UNIQUE is fine for now.
-- Add index for faster lookup during login
CREATE INDEX idx_profiles_alias ON profiles(alias);
