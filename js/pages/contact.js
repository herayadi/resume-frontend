document.addEventListener('DOMContentLoaded', async () => {
  const app = window.ResumeApp;
  try {
    const data = await app.initializePage('contact');
    const profile = data.profile || {};
    const cards = document.getElementById('contact-cards');
    const addCard = (title, value, iconClass, href, delay) => {
      const column = app.element('div', 'col-md-4 responsive-col');
      const link = app.element('a'); link.href = href;
      const card = app.element('div', 'info-item d-flex align-items-center');
      card.dataset.aos = 'fade-up'; card.dataset.aosDelay = String(delay);
      card.append(app.element('i', `icon ${iconClass} flex-shrink-0`));
      const content = app.element('div'); content.append(app.element('h3', '', title), app.element('p', '', value));
      card.append(content); link.append(card); column.append(link); cards.append(column);
    };
    addCard('Address', profile.city || '', 'bi bi-geo-alt', 'https://maps.app.goo.gl/kdCB9gXErsdMsmR1A', 200);
    (data.socialLinks || []).forEach((social, index) => {
      const title = social.type === 'email' ? 'Email Us' : social.type === 'linkedin' ? 'LinkedIn' : social.type;
      addCard(title, social.label || social.href, social.icon || 'bi bi-link-45deg', app.safeHref(social.href, social.type), 300 + (index * 100));
    });

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const loading = form.querySelector('.loading');
      const errorMessage = form.querySelector('.error-message');
      const sentMessage = form.querySelector('.sent-message');
      const button = form.querySelector('button[type="submit"]');
      loading.classList.add('d-block'); errorMessage.classList.remove('d-block'); sentMessage.classList.remove('d-block'); button.disabled = true;
      const fields = new FormData(form);
      try {
        await window.ResumeAPI.sendContact(Object.fromEntries(fields.entries()));
        form.reset(); sentMessage.classList.add('d-block');
      } catch (error) {
        errorMessage.textContent = error.message || 'Unable to send your message. Please try again.';
        errorMessage.classList.add('d-block');
      } finally {
        loading.classList.remove('d-block'); button.disabled = false;
      }
    });
  } catch (error) {
    console.error(error);
  } finally {
    app.finish();
  }
});
