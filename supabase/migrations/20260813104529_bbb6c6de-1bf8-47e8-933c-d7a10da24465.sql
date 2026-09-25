INSERT INTO public.user_roles (user_id, role)
VALUES ('94c9c2ec-2182-4d99-bb22-3f6c5504a83c', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;