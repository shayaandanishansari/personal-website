/**
 * Projects Page Logic
 * Handles category filtering with fade transition.
 */

const filterBtns  = document.querySelectorAll('.filter-btn');
const entries     = document.querySelectorAll('.project-entry');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter entries
        entries.forEach(entry => {
            const match = filter === 'all' || entry.dataset.category === filter;
            entry.classList.toggle('hidden', !match);
        });
    });
});