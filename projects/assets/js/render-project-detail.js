/**
 * render-project-detail.js
 * Renders a project detail page from PROJECTS data.
 * Reads the project id from <body data-project-id="...">
 * Requires: data/projects.js loaded before this script.
 */

(function () {

  const IMG = '../assets/img/';

  function render() {
    const id      = document.body.getAttribute('data-project-id');
    const project = PROJECTS.find(p => p.id === id);

    if (!project) {
      document.querySelector('.project-detail-main').innerHTML =
        '<p style="color:white;padding:2rem;">Project not found.</p>';
      return;
    }

    // <head> meta
    document.title = `${project.name} | Shayaan Danish`;
    document.querySelector('meta[name="description"]')
      .setAttribute('content', `${project.name} — ${project.tagline}`);

    // Header
    document.getElementById('detailLogo').src           = `${IMG}${project.logo}`;
    document.getElementById('detailLogo').alt           = `${project.name} Logo`;
    document.getElementById('detailCategory').textContent = project.categoryLabel;
    document.getElementById('detailTitle').textContent  = project.name;
    document.getElementById('detailTagline').textContent = project.tagline;

    // Preview image
    document.getElementById('detailPreviewImg').src     = `${IMG}${project.preview}`;
    document.getElementById('detailPreviewImg').alt     = `${project.name} screenshot`;

    // Overview paragraphs
    const overviewEl = document.getElementById('detailOverview');
    overviewEl.innerHTML = project.overview
      .map(p => `<p>${p}</p>`)
      .join('');

    // Tech stack
    const techEl = document.getElementById('detailTechStack');
    techEl.innerHTML = project.tech
      .map(t => `<span class="tech-tag">${t}</span>`)
      .join('');

    // Demo button
    const demoBtn = document.getElementById('detailDemoBtn');
    demoBtn.href = project.demoUrl || '#';
    if (project.demoUrl && project.demoUrl !== '#') {
      demoBtn.setAttribute('target', '_blank');
      demoBtn.setAttribute('rel', 'noopener noreferrer');
    }
  }

  document.addEventListener('DOMContentLoaded', render);

})();