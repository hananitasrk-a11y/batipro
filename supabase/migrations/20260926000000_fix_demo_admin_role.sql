-- Ensure the default demo admin user receives its admin role so the RLS policies grant access to the data tables.
INSERT INTO public.user_roles (user_id, role)
SELECT au.id, 'admin'
FROM auth.users au
WHERE au.email = 'admin@batipro.ma'
ON CONFLICT (user_id, role) DO NOTHING;
