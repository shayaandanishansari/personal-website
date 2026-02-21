/**
 * Portfolio Modal System
 * Handles project card interactions, modal rendering, links, and keyboard support.
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeModal();
    initializeProjectCards();
});

let lastFocusedCard = null;

function initializeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');

    if (!modalOverlay || !modalClose) return;

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        const isOpen = modalOverlay.classList.contains('active');
        if (!isOpen) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
            return;
        }

        if (event.key === 'Tab') {
            trapFocus(event, modalOverlay);
        }
    });
}

function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card) => {
        // Ensure accessibility semantics even if omitted in markup later
        card.setAttribute('tabindex', card.getAttribute('tabindex') || '0');
        card.setAttribute('role', card.getAttribute('role') || 'button');
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('aria-controls', 'modalOverlay');

        const title = card.dataset.title || card.querySelector('.project-name')?.textContent?.trim() || 'Project';
        if (!card.getAttribute('aria-label')) {
            card.setAttribute('aria-label', `Open details for ${title}`);
        }

        card.addEventListener('click', (event) => {
            event.stopPropagation();
            openModal(card);
        });

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(card);
            }
        });
    });
}

function openModal(card) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = modalOverlay?.querySelector('.modal-content');
    const modalClose = document.getElementById('modalClose');
    const modalLogo = document.getElementById('modalLogo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const techStack = document.getElementById('techStack');
    const modalPreview = document.getElementById('modalPreview');
    const modalDemoLink = document.getElementById('modalDemoLink');
    const modalReadMoreLink = document.getElementById('modalReadMoreLink');

    if (!modalOverlay || !modalLogo || !modalTitle || !modalDescription || !techStack || !modalPreview || !modalClose) return;

    const title = card.dataset.title || 'Project';
    const description = card.dataset.description || 'No description available.';
    const techList = card.dataset.tech
        ? card.dataset.tech.split(',').map((item) => item.trim()).filter(Boolean)
        : [];
    const color = card.dataset.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    const logoImg = card.dataset.logo;
    const previewImg = card.dataset.preview;

    modalTitle.textContent = title;
    modalDescription.textContent = description;

    if (logoImg) {
        modalLogo.style.background = `url('${logoImg}') no-repeat center/cover`;
    } else {
        modalLogo.style.background = color;
    }

    if (previewImg) {
        modalPreview.style.background = `url('${previewImg}') no-repeat center/cover`;
    } else {
        modalPreview.style.background = color;
    }

    techStack.innerHTML = techList.length > 0
        ? techList.map((tech) => `<span class="tech-tag">${tech}</span>`).join('')
        : '<span class="tech-tag">No technologies listed</span>';

    if (modalDemoLink && modalReadMoreLink) {
        const projectSlug = (card.dataset.project || '').trim();
        const defaultProjectUrl = projectSlug ? `projects/${projectSlug}.html` : '#';
        const demoUrl = (card.dataset.demoUrl || '').trim() || defaultProjectUrl;
        const readMoreUrl = (card.dataset.readUrl || '').trim() || defaultProjectUrl;

        setActionLink(modalDemoLink, demoUrl, { openExternalInNewTab: true });
        setActionLink(modalReadMoreLink, readMoreUrl, { openExternalInNewTab: false });
    }

    lastFocusedCard = card;
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        modalClose.focus();
        modalContent?.scrollTo({ top: 0, behavior: 'auto' });
    });
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) return;

    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastFocusedCard) {
        lastFocusedCard.focus();
    }
}

function setActionLink(linkEl, url, { openExternalInNewTab = false } = {}) {
    const rawUrl = (url || '#').trim() || '#';
    linkEl.href = rawUrl;

    const isExternal = /^https?:\/\//i.test(rawUrl);
    if (openExternalInNewTab && isExternal) {
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
    } else {
        linkEl.removeAttribute('target');
        linkEl.removeAttribute('rel');
    }
}

function trapFocus(event, modalOverlay) {
    const focusable = getFocusableElements(modalOverlay);
    if (focusable.length === 0) {
        event.preventDefault();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
    }
}

function getFocusableElements(container) {
    return Array.from(
        container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);
}
