document.addEventListener('DOMContentLoaded', async () => {
  const app = window.ResumeApp;
  try {
    const data = await app.initializePage('about');
    const profile = data.profile || {};
    document.getElementById('about-intro').textContent = profile.aboutIntro || '';
    document.getElementById('about-role').textContent = profile.role || '';
    document.getElementById('about-bio').textContent = profile.bioEn || profile.summaryEn || '';
    document.getElementById('about-avatar').src = app.assetUrl(profile.avatarUrl, '/assets/img/regina-profile-img.jpg');

    const email = (data.socialLinks || []).find((item) => item.type === 'email');
    const degree = data.education?.[0]?.shortDegree || data.education?.[0]?.degree || '';
    const age = app.calculateAge(profile.dateOfBirth);
    const detail = (label, value, href) => {
      const item = app.element('li');
      item.append(app.element('i', 'bi bi-chevron-right'), app.element('strong', '', `${label}:`));
      const content = href ? app.element('a') : app.element('span');
      if (href) content.href = href;
      content.append(app.element('span', '', value || '—'));
      item.append(content);
      return item;
    };
    const website = profile.website ? (String(profile.website).startsWith('http') ? profile.website : `https://${profile.website}`) : '#';
    document.getElementById('about-details-left').append(
      detail('Name', profile.name), detail('Website', profile.website, website),
      detail('City', profile.city, 'https://maps.app.goo.gl/2bWXjs7xz7pBb9Vx7'), detail('Freelance', 'Available')
    );
    document.getElementById('about-details-right').append(
      detail('Age', age === null ? '—' : `${age} years old`), detail('Degree', degree),
      detail('Email', email?.href, app.safeHref(email?.href, 'email'))
    );

    const skills = data.skills || [];
    const splitAt = Math.ceil(skills.length / 2);
    [skills.slice(0, splitAt), skills.slice(splitAt)].forEach((chunk) => {
      const column = app.element('div', 'col-lg-6');
      chunk.forEach((skill) => {
        const progress = app.element('div', 'progress');
        const label = app.element('span', 'skill');
        label.append(app.element('span', '', skill.name), app.element('i', 'val', `${skill.percentage}%`));
        const wrap = app.element('div', 'progress-bar-wrap');
        const bar = app.element('div', 'progress-bar');
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuenow', skill.percentage);
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.style.width = `${Math.max(0, Math.min(100, Number(skill.percentage) || 0))}%`;
        wrap.append(bar); progress.append(label, wrap); column.append(progress);
      });
      document.getElementById('skills-content').append(column);
    });
  } catch (error) {
    console.error(error);
  } finally {
    app.finish();
  }
});
