import { state } from './state.js';
import { renderCanvas } from './canvas.js';

export function initResponsive() {
    const buttons = document.querySelectorAll('[data-bp]');
    const canvas = document.getElementById('canvas');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const bp = btn.dataset.bp;
            state.breakpoint = bp;
            canvas.dataset.breakpoint = bp;

            // Animate transition
            canvas.style.opacity = '0.5';
            setTimeout(() => canvas.style.opacity = '1', 200);
        });
    });
}