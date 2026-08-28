document.addEventListener('DOMContentLoaded', async () => {
  const { element, safeHref, initializePage, finish } = window.ResumeApp;
  try {
    const data = await initializePage('home');
    const profile = data.profile || {};
    document.getElementById('hero-name').textContent = profile.name || '';
    const role = document.getElementById('hero-role');
    role.dataset.typedItems = profile.role || '';
    role.textContent = profile.role || '';

    const links = document.getElementById('hero-social-links');
    (data.socialLinks || []).forEach((social) => {
      const link = element('a');
      link.href = safeHref(social.href, social.type);
      link.setAttribute('aria-label', social.type || social.label || 'Social link');
      link.append(element('i', social.icon || 'bi bi-link-45deg'));
      links.append(link);
    });
    const download = element('a', 'btn btn-primary btn-sm', ' Download CV');
    download.href = '/cv/?print=1';
    download.append(element('i', 'bi bi-download'));
    download.insertBefore(download.lastChild, download.firstChild);
    links.append(download);
  } catch (error) {
    console.error(error);
  } finally {
    finish();
  }
});
