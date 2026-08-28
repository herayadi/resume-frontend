import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = process.env.RESUME_EXPORT_PATH
  ? path.resolve(process.env.RESUME_EXPORT_PATH)
  : path.resolve(__dirname, '../../backend/data/laravel-export.json');
const outputPath = path.resolve(__dirname, '../data/resume.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const projectsByExperience = new Map();
source.projects.forEach((project) => {
  const collection = projectsByExperience.get(project.experienceLegacyId) || [];
  collection.push({
    id: `legacy-project-${project.legacyId}`,
    projectLocation: project.projectLocation,
    startDate: project.startDate,
    endDate: project.endDate,
    description: project.description,
  });
  projectsByExperience.set(project.experienceLegacyId, collection);
});

const payload = {
  profile: {
    id: `legacy-profile-${source.profile.legacyId}`,
    name: source.profile.name,
    role: source.profile.role,
    phone: source.profile.phone,
    dateOfBirth: source.profile.dateOfBirth,
    website: source.profile.website,
    city: source.profile.city,
    summaryEn: source.profile.summaryEn,
    summaryId: source.profile.summaryId,
    bioEn: source.profile.bioEn,
    bioId: source.profile.bioId,
    aboutIntro: source.profile.aboutIntro,
    resumeIntro: source.profile.resumeIntro,
    footerTagline: source.profile.footerTagline,
    avatarUrl: source.profile.avatarUrl,
    cvUrl: source.profile.cvUrl,
  },
  socialLinks: source.socialLinks.map((item) => ({ id: `legacy-social-${item.legacyId}`, ...item, legacyId: undefined, sortOrder: undefined })),
  skills: source.skills.map((item) => ({ id: `legacy-skill-${item.legacyId}`, name: item.name, percentage: item.percentage })),
  education: source.education.map((item) => ({ id: `legacy-education-${item.legacyId}`, degree: item.degree, shortDegree: item.shortDegree, school: item.school, thesis: item.thesis, startYear: item.startYear, endYear: item.endYear })),
  experiences: source.experiences.map((item) => ({
    id: `legacy-experience-${item.legacyId}`,
    company: item.company,
    role: item.role,
    location: item.location,
    startDate: item.startDate,
    endDate: item.endDate,
    isCurrent: item.isCurrent,
    description: item.description,
    projects: projectsByExperience.get(item.legacyId) || [],
  })),
};

fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Generated frontend fallback at ${outputPath}`);
