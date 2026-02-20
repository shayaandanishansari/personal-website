// Project Data
const projectData = {
    'highlighter': {
        title: 'Highlighter',
        description: 'A modern web-based text highlighting and annotation tool. Allows users to highlight, comment, and share important sections of text with collaborative features.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    'jourts': {
        title: 'JOURTS',
        description: 'E-commerce platform for gourmet food delivery. Features real-time inventory, personalized recommendations, and seamless checkout experience.',
        technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    'file-visualiser': {
        title: 'File Structure Visualiser',
        description: 'Interactive tool for visualizing complex file directory structures. Provides tree views, search functionality, and export options for documentation.',
        technologies: ['TypeScript', 'D3.js', 'Electron', 'Vue.js'],
        color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    'quotescript': {
        title: 'QuoteScript',
        description: 'Automation tool for generating and managing quotes. Integrates with CRM systems and provides template customization.',
        technologies: ['Python', 'FastAPI', 'React', 'Docker'],
        color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    },
    'grocify': {
        title: 'Grocify',
        description: 'Mobile-first grocery shopping app with AI-powered recommendations, recipe suggestions, and same-day delivery integration.',
        technologies: ['React Native', 'Firebase', 'TensorFlow', 'Node.js'],
        color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    'lm-stick': {
        title: 'LM Stick',
        description: 'Large Language Model management and deployment platform. Provides API endpoints, monitoring, and version control for AI models.',
        technologies: ['Python', 'FastAPI', 'Kubernetes', 'PyTorch'],
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    'neural-net': {
        title: 'Neural Net',
        description: 'Visual neural network builder and trainer. Drag-and-drop interface for creating custom AI models without extensive coding.',
        technologies: ['TensorFlow.js', 'React', 'Node.js', 'WebSocket'],
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    'chat-ai': {
        title: 'Chat AI',
        description: 'Conversational AI platform with multi-language support, sentiment analysis, and custom bot training capabilities.',
        technologies: ['Python', 'Transformers', 'FastAPI', 'React'],
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
};

// State Management
const state = {
    positions: ['left', 'center', 'right'],
    cards: [],
    touchStartX: 0,
    touchEndX: 0,
    isDragging: false
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    state.cards = document.querySelectorAll('.category-card');
    setupEventListeners();
    setupModal();
    setupTouchGestures();
});

// Setup Click Event Listeners
function setupEventListeners() {
    state.cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.project-card')) return; // Don't rotate if clicking project
            if (state.isDragging) return; // Don't rotate if dragging
            
            const position = card.dataset.position;
            
            if (position === 'left') {
                rotateCards('right'); // Move left to center (rotate right)
            } else if (position === 'right') {
                rotateCards('left'); // Move right to center (rotate left)
            }
        });
    });
    
    // Project card clicks
    document.querySelectorAll('.project-card').forEach(projectCard => {
        projectCard.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = projectCard.dataset.project;
            openModal(projectId);
        });
    });
}

// Rotate Cards
function rotateCards(direction) {
    const currentPositions = state.cards.map(card => card.dataset.position);
    
    let newPositions;
    if (direction === 'left') {
        // Rotate left: center -> left, right -> center, left -> right
        newPositions = ['right', 'left', 'center'];
    } else {
        // Rotate right: left -> center, center -> right, right -> left
        newPositions = ['center', 'right', 'left'];
    }
    
    // Update positions
    state.cards.forEach((card, index) => {
        card.dataset.position = newPositions[index];
    });
    
    // Re-sort cards in DOM to maintain proper z-index
    const centerCard = document.querySelector('[data-position="center"]');
    const leftCard = document.querySelector('[data-position="left"]');
    const rightCard = document.querySelector('[data-position="right"]');
    
    const container = document.querySelector('.portfolio-container');
    container.innerHTML = '';
    container.appendChild(leftCard);
    container.appendChild(centerCard);
    container.appendChild(rightCard);
    
    // Re-attach event listeners
    setupEventListeners();
}

// Touch Gesture Handling
function setupTouchGestures() {
    state.cards.forEach(card => {
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchmove', handleTouchMove, { passive: true });
        card.addEventListener('touchend', handleTouchEnd);
    });
}

function handleTouchStart(e) {
    state.touchStartX = e.touches[0].clientX;
    state.isDragging = false;
    e.currentTarget.classList.add('dragging');
}

function handleTouchMove(e) {
    if (!state.touchStartX) return;
    
    state.touchEndX = e.touches[0].clientX;
    const diff = state.touchStartX - state.touchEndX;
    
    if (Math.abs(diff) > 10) {
        state.isDragging = true;
    }
}

function handleTouchEnd(e) {
    e.currentTarget.classList.remove('dragging');
    
    if (!state.touchStartX || !state.isDragging) {
        state.touchStartX = 0;
        state.touchEndX = 0;
        return;
    }
    
    const diff = state.touchStartX - state.touchEndX;
    const threshold = 100;
    const position = e.currentTarget.dataset.position;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0 && position === 'left') {
            // Swiped left on left card
            rotateCards('right');
        } else if (diff < 0 && position === 'right') {
            // Swiped right on right card
            rotateCards('left');
        }
    }
    
    state.touchStartX = 0;
    state.touchEndX = 0;
    state.isDragging = false;
}

// Modal Functions
function setupModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    modalClose.addEventListener('click', closeModal);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(projectId) {
    const project = projectData[projectId];
    if (!project) return;
    
    const modalOverlay = document.getElementById('modalOverlay');
    const modalLogo = document.getElementById('modalLogo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const techStack = document.getElementById('techStack');
    const modalPreview = document.getElementById('modalPreview');
    
    modalLogo.style.background = project.color;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalPreview.style.background = project.color;
    
    // Generate tech tags
    techStack.innerHTML = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        rotateCards('left');
    } else if (e.key === 'ArrowRight') {
        rotateCards('right');
    }
});

// Prevent context menu on cards (optional, for app-like feel)
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});