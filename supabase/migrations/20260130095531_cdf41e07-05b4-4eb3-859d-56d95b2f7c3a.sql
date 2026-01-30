-- Add RLS policy for moderators to view all lesson plans
CREATE POLICY "Moderators can view all lesson plans"
ON public.lesson_plans
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'moderator')
);

-- Add RLS policy for moderators to view all users (for reference)
CREATE POLICY "Admins and moderators can view all users"
ON public.users
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'moderator')
);