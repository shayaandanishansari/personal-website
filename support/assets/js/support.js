/**
 * support.js
 * Project selection → payment fade-in → amount pick → Paddle checkout
 *
 * Works in two environments:
 *   - Production (built): items are in the HTML at parse time, DOMContentLoaded fires first
 *   - Local dev: render-support.js builds items dynamically, fires 'projectsRendered'
 * The initialised guard ensures init() only runs once regardless of which event fires.
 */

// ─── Paddle price IDs ─────────────────────────────────────────────────────────
const PADDLE_PRICE_IDS = {
    'lm-stick': {
        1:   'pri_01kjsm6sgmaz14fzbv8v2wvsw0',
        5:   'pri_01kjsm9rchz4x43wapc2faqfbf',
        10:  'pri_01kjsma60w81kgqaa4txbxnqgk',
        100: 'pri_01kjsmfaf4a0t283x34ep7qbz2',
    },
    'highlighter': {
        1:   'pri_01kjsmfzm504fjpzg1r054p6g5',
        5:   'pri_01kjsmg99nm28bcp03nd4kse2p',
        10:  'pri_01kjsmgmcs69wx0b00d6hsrj27',
        100: 'pri_01kjsmh4e4hrpdj0j4demks0ba',
    },
    'jourts': {
        1:   'pri_01kjsmj2hjbg40g4w1e18jt36g',
        5:   'pri_01kjsmk3adx55vwspsv457wf5h',
        10:  'pri_01kjsmmgwphz19p8zp9xcwdfjd',
        100: 'pri_01kjsmnefwc90rd1yawgp06nk0',
    },
    'file-visualiser': {
        1:   'pri_01kjsnfmb1x188eht8m725gfaa',
        5:   'pri_01kjsnfysyc1v4jfw6t12gevxc',
        10:  'pri_01kjsnga6a3a628p19fwfj1tt3',
        100: 'pri_01kjsngv27jt2bkn026sh9nhfs',
    },
    'quotescript': {
        1:   'pri_01kjsnfmb1x188eht8m725gfaa',
        5:   'pri_01kjsnfysyc1v4jfw6t12gevxc',
        10:  'pri_01kjsnga6a3a628p19fwfj1tt3',
        100: 'pri_01kjsngv27jt2bkn026sh9nhfs',
    },
    'grocify': {
        1:   'pri_01kjsnjtx8nt3argxnzgex4fc1',
        5:   'pri_01kjsnk5g03z70hm0vehevs8q6',
        10:  'pri_01kjsnkcw2ev2nkg6tyg74hpxs',
        100: 'pri_01kjsnkqrvrs8y0ck0k4xx3yh2',
    },
};

// ─── State ────────────────────────────────────────────────────────────────────
let selectedProject = null;
let selectedAmount  = null;
let customAmount    = null;
let initialised     = false;

// ─── Init trigger — whichever fires first wins, guard prevents double run ─────
function safeInit() {
    if (initialised) return;
    initialised = true;
    init();
}

document.addEventListener('DOMContentLoaded', safeInit);     // production: items already in HTML
document.addEventListener('projectsRendered', safeInit);     // local dev: render-support.js built them

function init() {

    const projectItems      = document.querySelectorAll('.support-project-item');
    const paymentPanel      = document.getElementById('paymentPanel');
    const dynamicName       = document.getElementById('dynamicProjectName');
    const amountBtns        = document.querySelectorAll('.amount-btn');
    const otherBtn          = document.querySelector('.amount-btn.other-btn');
    const otherInputWrapper = document.getElementById('otherInputWrapper');
    const otherAmountInput  = document.getElementById('otherAmountInput');
    const nextBtn           = document.getElementById('nextBtn');

    // ─── Project selection ───────────────────────────────────────────────────
    projectItems.forEach(item => {
        item.addEventListener('click', () => selectProject(item));
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectProject(item);
            }
        });
    });

    function selectProject(item) {
        projectItems.forEach(p => {
            p.classList.remove('selected');
            p.setAttribute('aria-selected', 'false');
        });
        item.classList.add('selected');
        item.setAttribute('aria-selected', 'true');
        selectedProject = item.dataset.project;
        dynamicName.textContent = ' ' + item.dataset.name;
        paymentPanel.classList.add('visible');
        updateNextBtn();
    }

    // ─── Amount selection ────────────────────────────────────────────────────
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => selectAmount(btn));
    });

    function selectAmount(btn) {
        const value = btn.dataset.amount;
        amountBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        if (value === 'other') {
            selectedAmount = 'other';
            customAmount   = null;
            otherInputWrapper.classList.add('visible');
            btn.setAttribute('aria-expanded', 'true');
            otherAmountInput.focus();
        } else {
            selectedAmount = parseInt(value, 10);
            customAmount   = null;
            otherInputWrapper.classList.remove('visible');
            otherBtn.setAttribute('aria-expanded', 'false');
            otherAmountInput.value = '';
        }
        updateNextBtn();
    }

    otherAmountInput.addEventListener('input', () => {
        const raw = parseFloat(otherAmountInput.value);
        customAmount = (!isNaN(raw) && raw >= 1) ? Math.floor(raw) : null;
        updateNextBtn();
    });

    // ─── Next button state ───────────────────────────────────────────────────
    function updateNextBtn() {
        const ready = !!selectedProject &&
                      selectedAmount !== null &&
                      (selectedAmount !== 'other' || customAmount !== null);
        nextBtn.disabled = !ready;
        nextBtn.setAttribute('aria-disabled', String(!ready));
        nextBtn.classList.toggle('active', ready);
    }

    // ─── Checkout ────────────────────────────────────────────────────────────
    nextBtn.addEventListener('click', () => {
        if (nextBtn.disabled) return;
        openCheckout();
    });

    function openCheckout() {
        const projectPrices = PADDLE_PRICE_IDS[selectedProject];
        if (!projectPrices) {
            console.error('No price IDs found for project:', selectedProject);
            return;
        }

        const priceId  = selectedAmount === 'other' ? projectPrices[1] : projectPrices[selectedAmount];
        const quantity = selectedAmount === 'other' ? customAmount      : 1;

        Paddle.Checkout.open({
            items: [{ priceId, quantity }],
            customData: { project: selectedProject }
        });
    }

}