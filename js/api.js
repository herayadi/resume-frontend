(function createResumeApi() {
  async function request(path, options = {}) {
    const baseUrl = window.RESUME_CONFIG.API_BASE_URL;
    if (!baseUrl) throw new Error('Resume API URL is not configured');

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), window.RESUME_CONFIG.REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: { Accept: 'application/json', ...options.headers },
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(payload.error || `Request failed with status ${response.status}`);
        error.details = payload.details;
        throw error;
      }
      return payload;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  window.ResumeAPI = Object.freeze({
    getResume: () => request('/resume'),
    sendContact: (payload) => request('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  });
})();
