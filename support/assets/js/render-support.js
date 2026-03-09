/**
 * render-support.js
 * Renders the project picker on the support page from PROJECTS data.
 * Fires a custom 'projectsRendered' event when done so support.js
 * knows the DOM items exist before attaching listeners.
 */

(function () {

  const IMG = '../assets/img/';

  function renderProjectList() {
    const list = document.querySelector('.project-list');
    if (!list) return;

    PROJECTS.forEach(project => {
      const item = document.createElement('div');
      item.className = 'support-project-item';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');
      item.setAttribute('data-project', project.id);
      item.setAttribute('data-name', project.name);

      item.innerHTML = `
        <img src="${IMG}${project.logo}" alt="" class="support-project-logo">
        <span class="support-project-name">${project.name}</span>
        <span class="support-project-category">${project.categoryLabel}</span>
      `;

      list.appendChild(item);
    });

    // Signal to support.js that items are in the DOM
    document.dispatchEvent(new CustomEvent('projectsRendered'));
  }

  document.addEventListener('DOMContentLoaded', renderProjectList);

})();