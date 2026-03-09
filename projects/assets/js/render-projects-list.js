/**
 * render-projects-list.js
 * Renders the projects listing page from PROJECTS data.
 * Requires: data/projects.js loaded before this script.
 */

(function () {

  const IMG = '../assets/img/';

  function renderList() {
    const list = document.getElementById('projectsList');
    if (!list) return;

    PROJECTS.forEach(project => {
      const a = document.createElement('a');
      a.className = 'project-entry';
      a.href = `${project.id}.html`;
      a.setAttribute('data-category', project.category);

      a.innerHTML = `
        <div class="project-entry-left">
          <img src="${IMG}${project.logo}" alt="" class="project-entry-logo">
          <div class="project-entry-info">
            <span class="project-entry-name">${project.name}</span>
            <span class="project-entry-desc">${project.tagline}</span>
          </div>
        </div>
        <div class="project-entry-right">
          <span class="project-entry-tag">${project.categoryLabel}</span>
          <span class="project-entry-arrow">→</span>
        </div>
      `;

      list.appendChild(a);
    });
  }

  function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const list    = document.getElementById('projectsList');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');
        list.querySelectorAll('.project-entry').forEach(entry => {
          const show = filter === 'all' || entry.getAttribute('data-category') === filter;
          entry.classList.toggle('hidden', !show);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderList();
    initFilters();
  });

})();