-- Create users table with profile information
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  auth_provider TEXT DEFAULT 'email' CHECK (auth_provider IN ('email', 'google')),
  school_name TEXT,
  nip TEXT,
  subjects_taught TEXT[],
  teaching_levels TEXT[],
  years_experience INTEGER,
  bio TEXT,
  school_address TEXT,
  school_phone TEXT,
  school_website TEXT,
  dashboard_view_preference TEXT DEFAULT 'grid' CHECK (dashboard_view_preference IN ('grid', 'list')),
  auto_save_enabled BOOLEAN DEFAULT TRUE,
  auto_save_interval INTEGER DEFAULT 3,
  date_format TEXT DEFAULT 'DD Month YYYY',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON public.users(email);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.users FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Create lesson_plans table for storing RPM data
CREATE TABLE public.lesson_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Step 1: Identitas
  title TEXT NOT NULL,
  satuan_pendidikan TEXT NOT NULL,
  jenjang TEXT NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA', 'SMK')),
  fase TEXT NOT NULL,
  semester TEXT NOT NULL CHECK (semester IN ('Ganjil', 'Genap')),
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  duration_jp INTEGER NOT NULL,
  
  -- Step 2: Identifikasi
  student_readiness TEXT NOT NULL,
  student_social_emotional_context TEXT,
  profil_pelajar_pancasila TEXT[] NOT NULL,
  materi_characteristics TEXT NOT NULL,
  
  -- Step 3: Desain
  capaian_pembelajaran TEXT NOT NULL,
  learning_objectives TEXT NOT NULL,
  learning_approach TEXT[] NOT NULL,
  cross_disciplinary_integration TEXT,
  learning_framework JSONB DEFAULT '{}',
  
  -- Step 4: Prinsip
  mindfulness_level INTEGER CHECK (mindfulness_level BETWEEN 1 AND 5),
  meaningfulness_level INTEGER CHECK (meaningfulness_level BETWEEN 1 AND 5),
  joyfulness_level INTEGER CHECK (joyfulness_level BETWEEN 1 AND 5),
  learning_principles_description TEXT,
  special_considerations TEXT,
  teacher_expectations TEXT,
  supporting_document_url TEXT,
  
  -- AI Generated Content (placeholder for Phase 2)
  meaningful_understanding TEXT,
  trigger_questions TEXT,
  activities_opening TEXT,
  activities_core TEXT,
  activities_closing TEXT,
  assessment_initial TEXT,
  assessment_formative TEXT,
  assessment_summative TEXT,
  resources TEXT,
  reflection_teacher TEXT,
  reflection_students TEXT,
  
  -- Vibe scores
  vibe_scores JSONB DEFAULT '{"mindful": 7, "meaningful": 8, "joyful": 6}',
  
  -- Metadata
  is_draft BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_lesson_plans_user_id ON public.lesson_plans(user_id);
CREATE INDEX idx_lesson_plans_created_at ON public.lesson_plans(created_at DESC);
CREATE INDEX idx_lesson_plans_jenjang ON public.lesson_plans(jenjang);
CREATE INDEX idx_lesson_plans_subject ON public.lesson_plans(subject);

-- Enable RLS
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lesson_plans
CREATE POLICY "Users can view their own lesson plans" 
  ON public.lesson_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson plans" 
  ON public.lesson_plans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson plans" 
  ON public.lesson_plans FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson plans" 
  ON public.lesson_plans FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_plans_updated_at
  BEFORE UPDATE ON public.lesson_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.app_metadata->>'provider' = 'google' THEN 'google'
      ELSE 'email'
    END
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();