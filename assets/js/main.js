/**
 * Portfolio Modal System
 * Handles project card interactions and modal display
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeModal();
    initializeProjectCards();
});

/**
 * Initialize modal event listeners
 */
function initializeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');

    // Close button click
    modalClose.addEventListener('click', closeModal);

    // Click outside modal to close
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Initialize project card click handlers
 */
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectData = extractProjectData(card);
            openModal(projectData);
        });
    });
}

/**
 * Extract project data from card data attributes
 * @param {HTMLElement} card - The project card element
 * @returns {Object} Project data object
 */
function extractProjectData(card) {
    return {
        title: card.dataset.title || 'Project',
        description: card.dataset.description || 'No description available.',
        technologies: card.dataset.tech ? card.dataset.tech.split(',').map(t => t.trim()) : [],
        color: card.dataset.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
}

function openModal(projectId) {
    // Find the project card by data-project attribute
    const projectCard = document.querySelector(`[data-project="${projectId}"]`);
    if (!projectCard) return;

    // Extract data from data attributes
    const project = {
        title: projectCard.dataset.title || 'Project',
        description: projectCard.dataset.description || 'No description available.',
        technologies: projectCard.dataset.tech ? projectCard.dataset.tech.split(',').map(t => t.trim()) : [],
        color: projectCard.dataset.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };

    const modalOverlay = document.getElementById('modalOverlay');
    const modalLogo = document.getElementById('modalLogo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const techStack = document.getElementById('techStack');
    const modalPreview = document.getElementById('modalPreview');

    // Set modal content
    modalLogo.style.background = project.color;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalPreview.style.background = project.color;

    // Generate tech tags
    techStack.innerHTML = project.technologies.length > 0
        ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
        : '<span class="tech-tag">No technologies listed</span>';

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}/**
 * Close the modal
 */
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Prevent context menu on cards for app-like feel
 */
// Project card clicks
document.querySelectorAll('.project-card').forEach(projectCard => {
    projectCard.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = projectCard.dataset.project;
        openModal(projectId);
    });
});