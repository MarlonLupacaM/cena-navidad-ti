-- ==============================================================================
-- 1. SI YA CORRISTE EL SCRIPT ANTERIOR, SOLO EJECUTA ESTAS LÍNEAS PARA LIMPIAR:
-- ==============================================================================
ALTER TABLE public.angel_votes 
DROP COLUMN IF EXISTS will_participate,
DROP COLUMN IF EXISTS updated_at;

DROP FUNCTION IF EXISTS public.get_angel_stats();

-- ==============================================================================
-- 2. SCRIPT DEFINITIVO Y LIMPIO (Solo las columnas necesarias)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.angel_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code TEXT NOT NULL,
    email TEXT NOT NULL,
    gift_suggestion TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asegurar restricciones UNIQUE para código de trabajador y correo
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_angel_employee_code'
    ) THEN
        ALTER TABLE public.angel_votes ADD CONSTRAINT unique_angel_employee_code UNIQUE (employee_code);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_angel_email'
    ) THEN
        ALTER TABLE public.angel_votes ADD CONSTRAINT unique_angel_email UNIQUE (email);
    END IF;
END $$;

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_angel_votes_employee_code ON public.angel_votes (employee_code);
CREATE INDEX IF NOT EXISTS idx_angel_votes_email ON public.angel_votes (email);

-- Habilitar Seguridad por Fila (RLS)
ALTER TABLE public.angel_votes ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (anon y authenticated)
DROP POLICY IF EXISTS "Permitir insertar votos de angel" ON public.angel_votes;
CREATE POLICY "Permitir insertar votos de angel"
ON public.angel_votes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizar votos de angel" ON public.angel_votes;
CREATE POLICY "Permitir actualizar votos de angel"
ON public.angel_votes
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leer votos de angel" ON public.angel_votes;
CREATE POLICY "Permitir leer votos de angel"
ON public.angel_votes
FOR SELECT
TO anon, authenticated
USING (true);
