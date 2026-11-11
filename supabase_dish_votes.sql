-- ==============================================================================
-- 1. SI TU TABLA YA EXISTE, SOLO EJECUTA ESTAS 5 LÍNEAS PARA AGREGAR LAS COLUMNAS:
-- ==============================================================================
ALTER TABLE public.dish_votes
ADD COLUMN IF NOT EXISTS selected_dish TEXT,
ADD COLUMN IF NOT EXISTS selected_side TEXT,
ADD COLUMN IF NOT EXISTS selected_drink TEXT,
ADD COLUMN IF NOT EXISTS selected_options TEXT;

-- ==============================================================================
-- 2. SCRIPT COMPLETO (Por si necesitas crear la tabla desde cero en otra base)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.dish_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code TEXT NOT NULL,
    email TEXT NOT NULL,
    package_id TEXT NOT NULL,
    package_title TEXT NOT NULL,
    selected_dish TEXT,
    selected_side TEXT,
    selected_drink TEXT,
    selected_options TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asegurar restricciones UNIQUE para código de trabajador y correo
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_dish_employee_code'
    ) THEN
        ALTER TABLE public.dish_votes ADD CONSTRAINT unique_dish_employee_code UNIQUE (employee_code);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_dish_email'
    ) THEN
        ALTER TABLE public.dish_votes ADD CONSTRAINT unique_dish_email UNIQUE (email);
    END IF;
END $$;

-- Índices para acelerar búsquedas
CREATE INDEX IF NOT EXISTS idx_dish_votes_employee_code ON public.dish_votes (employee_code);
CREATE INDEX IF NOT EXISTS idx_dish_votes_package_id ON public.dish_votes (package_id);

-- Habilitar Seguridad por Fila (RLS)
ALTER TABLE public.dish_votes ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (anon)
DROP POLICY IF EXISTS "Permitir insertar votos de platos" ON public.dish_votes;
CREATE POLICY "Permitir insertar votos de platos"
ON public.dish_votes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leer votos de platos" ON public.dish_votes;
CREATE POLICY "Permitir leer votos de platos"
ON public.dish_votes
FOR SELECT
TO anon, authenticated
USING (true);

-- Función RPC para conteo en tiempo real por paquete
CREATE OR REPLACE FUNCTION public.get_dish_vote_counts()
RETURNS TABLE (package_id TEXT, count BIGINT)
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT package_id, COUNT(*)::BIGINT AS count
    FROM public.dish_votes
    GROUP BY package_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_dish_vote_counts() TO anon, authenticated;
