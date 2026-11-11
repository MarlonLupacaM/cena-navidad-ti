// Cliente ligero y seguro para Supabase usando Fetch API nativa (0 dependencias requeridas)
export const SUPABASE_URL =
  import.meta.env?.VITE_SUPABASE_URL || 'https://kwkgbuhpjtwarxlaxijn.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_zhMJ348W6X66IDqnFyBV4w_ufIMcOep';

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

/**
 * Obtiene el conteo agregado de votos por cada sede de manera anónima y segura
 */
export async function getLiveVoteCounts() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_vote_counts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    if (!res.ok) throw new Error(`Error en RPC vote counts: ${res.statusText}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Supabase no disponible para conteo de votos, usando fallback local:', err.message);
    return null;
  }
}

/**
 * Verifica si un código de trabajador ya emitió su voto
 */
export async function checkEmployeeHasVoted(employeeCode) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_employee_voted`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ p_code: employeeCode.trim() })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (err) {
    console.warn('Error verificando voto del colaborador:', err.message);
    return null;
  }
}

/**
 * Emite un voto en la base de datos de Supabase (sedes)
 */
export async function insertVote({ employeeCode, email, preferredDate, venueId, venueName }) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/votes`, {
      method: 'POST',
      headers: {
        ...headers,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        employee_code: employeeCode.trim(),
        email: email.trim(),
        preferred_date: preferredDate || null,
        venue_id: venueId,
        venue_name: venueName
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      const isDuplicate =
        res.status === 409 ||
        errorText.toLowerCase().includes('duplicate') ||
        errorText.toLowerCase().includes('unique') ||
        errorText.toLowerCase().includes('already exists');

      return {
        success: false,
        duplicate: isDuplicate,
        error: isDuplicate
          ? 'Este código de trabajador o correo ya registró un voto.'
          : errorText || 'Error al registrar el voto en Supabase'
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Error insertando voto en Supabase:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Obtiene el conteo en vivo de votos de platos / paquetes
 */
export async function getLiveDishVoteCounts() {
  try {
    // 1. Intentar RPC get_dish_vote_counts si existe en Supabase
    const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dish_vote_counts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    if (rpcRes.ok) {
      const data = await rpcRes.json();
      if (Array.isArray(data)) return data;
    }

    // 2. Fallback: Consulta directa a la tabla dish_votes si existe
    const tableRes = await fetch(`${SUPABASE_URL}/rest/v1/dish_votes?select=package_id`, {
      method: 'GET',
      headers
    });
    if (tableRes.ok) {
      const rows = await tableRes.json();
      if (Array.isArray(rows)) {
        const counts = {};
        rows.forEach((r) => {
          counts[r.package_id] = (counts[r.package_id] || 0) + 1;
        });
        return Object.keys(counts).map((k) => ({
          package_id: k,
          count: counts[k]
        }));
      }
    }
    return null;
  } catch (err) {
    console.warn('Fallback local para votos de platos:', err.message);
    return null;
  }
}

/**
 * Verifica si un trabajador ya votó por un plato en Supabase (por código y/o por correo).
 * Devuelve { found: true, vote } si existe, { found: false } si no existe (o fue eliminado),
 * o { error: true } si hubo error de conexión.
 */
export async function checkEmployeeHasVotedDish(param) {
  try {
    let code = '';
    let mail = '';
    if (typeof param === 'string') {
      code = param.trim();
    } else if (param && typeof param === 'object') {
      code = param.employeeCode ? param.employeeCode.trim() : '';
      mail = param.email ? param.email.trim().toLowerCase() : '';
    }
    if (!code && !mail) return { found: false };

    let query = '';
    if (code && mail) {
      query = `or=(employee_code.eq.${encodeURIComponent(code)},email.eq.${encodeURIComponent(mail)})`;
    } else if (code) {
      query = `employee_code=eq.${encodeURIComponent(code)}`;
    } else {
      query = `email=eq.${encodeURIComponent(mail)}`;
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/dish_votes?select=employee_code,email,package_id,package_title&${query}&limit=1`,
      {
        method: 'GET',
        headers
      }
    );
    if (!res.ok) {
      return { error: true, status: res.status };
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { found: true, vote: data[0] };
    }
    return { found: false };
  } catch (err) {
    console.warn('Error verificando voto de plato en Supabase:', err.message);
    return { error: true, message: err.message };
  }
}

/**
 * Registra el voto del colaborador para el paquete de comida con sus elecciones específicas
 */
export async function insertDishVote({
  employeeCode,
  email,
  packageId,
  packageTitle,
  selectedDish,
  selectedSide,
  selectedDrink,
  selectedOptions
}) {
  try {
    const payload = {
      employee_code: employeeCode.trim(),
      email: email.trim(),
      package_id: packageId,
      package_title: packageTitle
    };

    if (selectedDish) payload.selected_dish = selectedDish;
    if (selectedSide) payload.selected_side = selectedSide;
    if (selectedDrink) payload.selected_drink = selectedDrink;
    if (selectedOptions) payload.selected_options = selectedOptions;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/dish_votes`, {
      method: 'POST',
      headers: {
        ...headers,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      const isDuplicate =
        res.status === 409 ||
        errorText.toLowerCase().includes('duplicate') ||
        errorText.toLowerCase().includes('unique') ||
        errorText.toLowerCase().includes('already exists');

      return {
        success: false,
        duplicate: isDuplicate,
        error: isDuplicate
          ? 'Este código de trabajador o correo ya emitió su voto de plato.'
          : errorText || 'Error registrando voto de plato'
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Error insertando voto de plato en Supabase:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Carga los comentarios y deseos del muro desde Supabase (solo los activos/aprobados manualmente)
 */
export async function getLiveComments() {
  try {
    // Si la columna is_active existe, filtramos por is_active=eq.true
    // Si aún no se creó, el fallback carga normalmente para no romper los existentes
    let res = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?select=*,comment_likes(id,device_id)&is_active=eq.true&order=created_at.desc&limit=80`,
      {
        method: 'GET',
        headers
      }
    );

    if (!res.ok) {
      // Fallback si aún no existe la tabla comment_likes o la columna is_active
      res = await fetch(`${SUPABASE_URL}/rest/v1/comments?select=*&order=created_at.desc&limit=80`, {
        method: 'GET',
        headers
      });
    }

    if (!res.ok) throw new Error(`Error obteniendo comentarios: ${res.statusText}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Supabase no disponible para comentarios, usando fallback local:', err.message);
    return null;
  }
}

/**
 * Obtiene o crea un Device ID único y persistente para este navegador
 */
export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('caja_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem('caja_device_id', deviceId);
  }
  return deviceId;
}

/**
 * Obtiene la IP pública del usuario de forma segura y ligera
 */
async function getUserIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      return data.ip || 'Desconocida';
    }
  } catch {}
  return 'Desconocida';
}

/**
 * Obtiene una descripción legible del dispositivo/navegador
 */
function getDeviceInfo() {
  try {
    const ua = navigator.userAgent;
    let device = 'Escritorio';
    if (/android/i.test(ua)) device = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) device = 'iOS';
    else if (/mobile/i.test(ua)) device = 'Móvil';

    let browser = 'Navegador';
    if (/edg/i.test(ua)) browser = 'Edge';
    else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua)) browser = 'Safari';

    return `${device} - ${browser}`;
  } catch {
    return 'Desconocido';
  }
}

/**
 * Publica un nuevo post-it en Supabase (por defecto is_active = false para activación manual)
 */
export async function insertComment({ type, text, colorIdx, rotation }) {
  try {
    const [ip, deviceInfo] = await Promise.all([
      getUserIP(),
      Promise.resolve(getDeviceInfo())
    ]);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
      method: 'POST',
      headers: {
        ...headers,
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        type: type || 'deseo',
        text: text.trim(),
        color_idx: typeof colorIdx === 'number' ? colorIdx : 0,
        rotation: rotation || 'rotate-0',
        ip_address: ip,
        device_info: deviceInfo,
        is_active: false // Desactivado por defecto hasta que lo actives manualmente en Supabase
      })
    });

    if (!res.ok) {
      // Fallback si aún no existe la columna is_active en la BD
      const fallbackRes = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
        method: 'POST',
        headers: {
          ...headers,
          Prefer: 'return=representation'
        },
        body: JSON.stringify({
          type: type || 'deseo',
          text: text.trim(),
          color_idx: typeof colorIdx === 'number' ? colorIdx : 0,
          rotation: rotation || 'rotate-0'
        })
      });
      if (!fallbackRes.ok) {
        const errorText = await fallbackRes.text();
        return { success: false, error: errorText };
      }
      const createdFallback = await fallbackRes.json();
      return { success: true, data: Array.isArray(createdFallback) ? createdFallback[0] : createdFallback };
    }

    const created = await res.json();
    return { success: true, data: Array.isArray(created) ? created[0] : created };
  } catch (err) {
    console.error('Error publicando comentario en Supabase:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Da o quita corazón (like) a un post-it, controlado por device_id e IP antispam
 */
export async function toggleCommentLike(commentId) {
  try {
    const deviceId = getOrCreateDeviceId();
    const ip = await getUserIP();

    // 1. Verificar si ya le dio like
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/comment_likes?comment_id=eq.${commentId}&device_id=eq.${deviceId}`,
      { method: 'GET', headers }
    );

    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        // Ya dio like -> Quitar like (toggle off)
        await fetch(
          `${SUPABASE_URL}/rest/v1/comment_likes?comment_id=eq.${commentId}&device_id=eq.${deviceId}`,
          { method: 'DELETE', headers }
        );
        return { success: true, liked: false };
      }
    }

    // 2. No ha dado like -> Insertar nuevo like (toggle on)
    const addRes = await fetch(`${SUPABASE_URL}/rest/v1/comment_likes`, {
      method: 'POST',
      headers: {
        ...headers,
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        comment_id: commentId,
        device_id: deviceId,
        ip_address: ip
      })
    });

    if (addRes.ok) {
      return { success: true, liked: true };
    }
    return { success: false };
  } catch (err) {
    console.error('Error en toggleCommentLike:', err);
    return { success: false, error: err.message };
  }
}

