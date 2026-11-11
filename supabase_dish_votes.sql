-- ==============================================================================
-- SCRIPT A PRUEBA DE ERRORES: CREAR O ACTUALIZAR TABLA dish_votes
-- Ejecuta TODO este bloque en el "SQL Editor" de Supabase (sin seleccionar texto)
-- ==============================================================================

-- 1. Crear tabla básica si aún no existe
CREATE TABLE IF NOT EXISTS public.dish_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code TEXT NOT NULL,
    email TEXT NOT NULL,
    package_id TEXT NOT NULL,
    package_title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agregar restricciones UNIQUE para código de trabajador y correo de forma segura
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

-- 3. Índices para acelerar búsquedas
CREATE INDEX IF NOT EXISTS idx_dish_votes_employee_code ON public.dish_votes (employee_code);
CREATE INDEX IF NOT EXISTS idx_dish_votes_package_id ON public.dish_votes (package_id);

-- 4. Habilitar Seguridad por Fila (RLS)
ALTER TABLE public.dish_votes ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas de acceso público (anon)
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

-- 6. Función RPC para obtener el conteo agrupado por paquete en tiempo real
CREATE OR REPLACE FUNCTION public.get_dish_vote_counts()
RETURNS TABLE (package_id TEXT, count BIGINT)
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT package_id, COUNT(*)::BIGINT AS count
    FROM public.dish_votes
    GROUP BY package_id;
$$;

-- Permisos de ejecución de la función
GRANT EXECUTE ON FUNCTION public.get_dish_vote_counts() TO anon, authenticated;
