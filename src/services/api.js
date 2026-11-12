export const API_BASE_URL = '/herbal';
export const BASE_URL = '/herbal';
export const NGROK_DOMAIN = '/herbal';
export const getMyOrdersUrl = (userId) => `${API_BASE_URL}/my-orders/${userId}/`;
export const SLIDERS_API_URL = `${API_BASE_URL}/sliders/`;

export const API_HEADERS = {
  'ngrok-skip-browser-warning': 'true'
};

export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;

  // 1. Rewrite api.codingboss backend media URLs to active proxy /api/media/ (which maps to http://179.197.251.47:30080/media/)
  if (trimmed.includes('api.codingboss')) {
    if (trimmed.includes('/media/')) {
      const mediaPath = trimmed.split(/\/media\//)[1];
      return `/api/media/${mediaPath}`;
    }
    return trimmed.replace(/^https?:\/\/api\.codingboss\.[a-z0-9.]+\//i, 'http://179.197.251.47:30080/');
  }

  // 2. Direct backend IP media URLs -> route to proxy /api/media/
  if (trimmed.includes('179.197.251.47:30080/media/')) {
    const mediaPath = trimmed.split(/\/media\//)[1];
    return `/api/media/${mediaPath}`;
  }
  if (trimmed.includes('179.197.251.47:30080')) {
    return trimmed.replace(/^https?:\/\/179\.197\.251\.47:30080\/herbal/i, '/api')
                  .replace(/^https?:\/\/179\.197\.251\.47:30080/i, '/api');
  }

  if (trimmed.startsWith('http://vedanmart.com/')) {
    return trimmed.replace('http://vedanmart.com/', 'https://vedanmart.com/');
  }
  if (trimmed.startsWith('http://www.dharaniherbbals.in/')) {
    return trimmed.replace('http://www.dharaniherbbals.in/', 'https://www.dharaniherbbals.in/');
  }
  if (trimmed.startsWith('http://dharaniherbbals.in/')) {
    return trimmed.replace('http://dharaniherbbals.in/', 'https://dharaniherbbals.in/');
  }

  // Handle backend anomaly: Django prepending MEDIA_URL to external URLs (e.g. /media/https%3A/...)
  if (trimmed.includes('/media/')) {
    const afterMedia = trimmed.split(/\/media\//)[1];
    if (afterMedia && (afterMedia.includes('http%3A') || afterMedia.includes('https%3A') || afterMedia.includes('http:/') || afterMedia.includes('https:/') || afterMedia.includes('vedanmart') || afterMedia.includes('dharaniherbbals'))) {
      let unwrapped = afterMedia;
      try {
        unwrapped = decodeURIComponent(decodeURIComponent(unwrapped));
      } catch (e) {
        try { unwrapped = decodeURIComponent(unwrapped); } catch (e2) {}
      }
      unwrapped = unwrapped.replace(/^https?:\/*/, 'https://').replace(/ /g, '%20');
      if (!unwrapped.startsWith('https://') && (unwrapped.startsWith('vedanmart') || unwrapped.startsWith('www.vedanmart'))) {
        unwrapped = 'https://' + unwrapped;
      }
      return unwrapped;
    }
  }

  if (trimmed.startsWith('/media/')) {
    return `/api${trimmed}`;
  }
  if (trimmed.startsWith('media/')) {
    return `/api/${trimmed}`;
  }
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return trimmed;
};
