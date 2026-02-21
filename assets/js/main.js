/**
Portfolio Modal System
Handles project card interactions and modal display
*/
document.addEventListener('DOMContentLoaded', () => {
    initializeModal();
    initializeProjectCards();
});

/**
Initialize modal event listeners
*/
function initializeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');

    if (!modalOverlay || !modalClose) return;

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
Initialize project card click handlers
*/
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(card); // Pass the card element directly
        });
    });
}

/**
Open the modal and populate data
@param {HTMLElement} card - The clicked project card
*/
function openModal(card) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalLogo = document.getElementById('modalLogo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const techStack = document.getElementById('techStack');
    const modalPreview = document.getElementById('modalPreview');

    if (!modalOverlay) return;

    // Extract data
    const title = card.dataset.title || 'Project';
    const description = card.dataset.description || 'No description available.';
    const techList = card.dataset.tech ? card.dataset.tech.split(',').map(t => t.trim()) : [];
    const color = card.dataset.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    const logoImg = card.dataset.logo;
    const previewImg = card.dataset.preview;

    // Set Text Content
    modalTitle.textContent = title;
    modalDescription.textContent = description;

    // Set Logo (Image or Gradient)
    if (logoImg) {
        modalLogo.style.backgroundImage = `url('${logoImg}')`;
        modalLogo.style.background = `url('${logoImg}') no-repeat center/cover`;
    } else {
        modalLogo.style.background = color;
        modalLogo.style.backgroundImage = 'none';
    }

    // Set Preview (Image or Gradient)
    if (previewImg) {
        modalPreview.style.background = `url('${previewImg}') no-repeat center/cover`;
    } else {
        modalPreview.style.background = color;
    }

    // Generate tech tags
    techStack.innerHTML = techList.length > 0
        ? techList.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
        : '<span class="tech-tag">No technologies listed</span>';

    // Show Modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
Close the modal
*/
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) return;

    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}