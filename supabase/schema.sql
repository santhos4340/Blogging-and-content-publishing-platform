-- SQL Schema for Blogging Content and Publishing Platform (Supabase PostgreSQL)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------
-- 1. PROFILES TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-------------------------------------------------------
-- 2. BLOGS TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-------------------------------------------------------
-- 3. CATEGORIES TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-------------------------------------------------------
-- 4. BLOG_CATEGORIES TABLE (Composite Primary Key)
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_categories (
    blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, category_id)
);

-------------------------------------------------------
-- 5. COMMENTS TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- Profiles Policies
-- -----------------------------------------------------
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN'));

-- -----------------------------------------------------
-- Blogs Policies
-- -----------------------------------------------------
CREATE POLICY "Public users can view published blogs" 
ON public.blogs FOR SELECT 
USING (status = 'PUBLISHED' OR (auth.role() = 'authenticated' AND (
    author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
)));

CREATE POLICY "Authenticated users can create blogs" 
ON public.blogs FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users and admins can update blogs" 
ON public.blogs FOR UPDATE 
USING (auth.role() = 'authenticated' AND (
    author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
));

CREATE POLICY "Users and admins can delete blogs" 
ON public.blogs FOR DELETE 
USING (auth.role() = 'authenticated' AND (
    author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
));

-- -----------------------------------------------------
-- Categories Policies
-- -----------------------------------------------------
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage categories" 
ON public.categories FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN'));

-- -----------------------------------------------------
-- Comments Policies
-- -----------------------------------------------------
CREATE POLICY "Comments are viewable on published blogs" 
ON public.comments FOR SELECT 
USING (
    blog_id IN (SELECT id FROM public.blogs WHERE status = 'PUBLISHED') OR
    (auth.role() = 'authenticated' AND (
        user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
    ))
);

CREATE POLICY "Authenticated users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (
    auth.role() = 'authenticated' AND 
    user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (
    auth.role() = 'authenticated' AND (
        user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
    )
);

CREATE POLICY "Users and admins can delete comments" 
ON public.comments FOR DELETE 
USING (
    auth.role() = 'authenticated' AND (
        user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
    )
);

-------------------------------------------------------
-- INITIAL SEED DATA (Categories)
-------------------------------------------------------
INSERT INTO public.categories (name, slug, description) VALUES
('Technology', 'technology', 'Latest trends in tech, software engineering, and AI'),
('Design', 'design', 'UI/UX design, graphics, and web aesthetics'),
('Development', 'development', 'Coding tutorials, full-stack development, and architecture'),
('Career Growth', 'career-growth', 'Tips on career advancement and personal development')
ON CONFLICT (slug) DO NOTHING;
