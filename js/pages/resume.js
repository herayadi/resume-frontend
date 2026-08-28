document.addEventListener('DOMContentLoaded', async () => {
  const app = window.ResumeApp;
  try {
    const data = await app.initializePage('resume');
    const profile = data.profile || {};
    document.getElementById('resume-intro').textContent = profile.resumeIntro || profile.summaryEn || '';

    const summary = document.getElementById('resume-summary');
    summary.append(app.element('h4', '', profile.name || ''));
    const summaryText = app.element('p');
    summaryText.append(app.element('em', '', profile.summaryEn || ''));
    summary.append(summaryText);
    const contacts = app.element('div', 'pb-4 d-flex flex-column');
    const cityLink = app.element('a', 'p-2');
    cityLink.href = 'https://maps.app.goo.gl/kdCB9gXErsdMsmR1A';
    cityLink.append(app.element('i', 'icon bi bi-geo-alt', ` ${profile.city || ''}`));
    contacts.append(cityLink);
    (data.socialLinks || []).forEach((social) => {
      const link = app.element('a', 'p-2');
      link.href = app.safeHref(social.href, social.type);
      link.append(app.element('i', `icon ${social.icon || 'bi bi-link-45deg'}`, ` ${social.label || social.href || ''}`));
      contacts.append(link);
    });
    summary.append(contacts);

    const educationRoot = document.getElementById('resume-education');
    (data.education || []).forEach((education) => {
      const item = app.element('div', 'resume-item');
      item.append(app.element('h4', '', education.degree), app.element('p'));
      item.lastChild.append(app.element('em', '', education.school));
      item.append(app.element('h5', '', `${education.startYear || ''} - ${education.endYear || ''}`));
      if (education.thesis) item.append(app.element('p', '', education.thesis));
      educationRoot.append(item);
    });

    const experienceRoot = document.getElementById('resume-experience');
    (data.experiences || []).forEach((experience) => {
      const item = app.element('div', 'resume-item');
      item.append(app.element('h4', '', `${experience.company} | ${experience.location || ''}`));
      if (experience.role) {
        const role = app.element('p'); role.append(app.element('em', '', experience.role)); item.append(role);
      }
      item.append(app.element('h5', '', `${experience.startDate || ''} - ${experience.endDate || ''}`));
      const projects = app.element('ul');
      (experience.projects || []).forEach((project) => {
        const projectItem = app.element('li');
        const period = project.startDate && project.endDate ? ` | ${project.startDate} - ${project.endDate}` : '';
        projectItem.append(document.createTextNode(`${project.projectLocation || ''}${period}`));
        const details = app.element('ul');
        app.descriptionSentences(project.description).forEach((sentence) => details.append(app.element('li', '', sentence)));
        if (details.children.length) projectItem.append(details);
        projects.append(projectItem);
      });
      item.append(projects);
      experienceRoot.append(item);
    });
  } catch (error) {
    console.error(error);
  } finally {
    app.finish();
  }
});
