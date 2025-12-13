
-- =====================================================
-- 1) Schema init
-- =====================================================

-- Remove all rights from public
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Create private schema & revoke
CREATE SCHEMA private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;

-- =====================================================
-- 2) Create Role
-- =====================================================

-- admin, app_user
CREATE ROLE admin LOGIN PASSWORD 'adminpwd99';
CREATE ROLE app_user LOGIN PASSWORD 'userpwd99';

-- =====================================================
-- 3) Grant
-- =====================================================

-- admin : public/private + all rights
GRANT USAGE, CREATE ON SCHEMA public TO admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;

GRANT USAGE, CREATE ON SCHEMA private TO admin;
GRANT ALL ON ALL TABLES IN SCHEMA private TO admin;

-- app_user : public + CRUD
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

REVOKE ALL ON SCHEMA private FROM app_user; -- private XXX

-- =====================================================
-- 4) Default privileges 
-- =====================================================
ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app_user;




-- \dt+ public.t_users -- table owner should be admin