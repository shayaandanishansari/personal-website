/**
 * Contact Page Logic
 * Submits form to Web3Forms and shows inline feedback.
 */

const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const feedback    = document.getElementById('contactFeedback');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
        showFeedback('Please fill in all fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
    }

    setLoading(true);

    try {
        const data = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: data
        });

        const result = await response.json();

        if (result.success) {
            showFeedback('Message sent. I\'ll get back to you shortly.', 'success');
            form.reset();
        } else {
            showFeedback('Something went wrong. Please try again.', 'error');
        }
    } catch (err) {
        showFeedback('Could not send message. Check your connection and try again.', 'error');
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    submitBtn.classList.toggle('loading', isLoading);
    submitBtn.disabled = isLoading;
}

function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className   = 'contact-feedback visible ' + type;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}