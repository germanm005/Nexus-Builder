import { state } from './state.js';

export function initCodeGen() {
    const btn = document.getElementById('btn-export');
    const modal = document.getElementById('export-modal');
    const close = modal.querySelector('.modal__close');
    const output = document.getElementById('code-output');

    btn.addEventListener('click', () => {
        const html = generateHTML();
        const css = generateCSS();

        modal.classList.add('active');
        showCode('html', html, css);
    });

    close.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Tab switching
    modal.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            modal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const html = generateHTML();
            const css = generateCSS();
            showCode(tab.dataset.tab, html, css);
        });
    });
}

function showCode(type, html, css) {
    const output = document.getElementById('code-output');
    const code = type === 'html' ? html : css;
    output.querySelector('code').textContent = code;
}

function generateHTML() {
    if (!state.elements.length) return '<!-- No elements on canvas -->';

    return state.elements.map(el => {
        const style = `position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px;`;
        const attrs = el.tag === 'input' ? `placeholder="${el.text}"` : '';
        const content = el.tag === 'input' ? '' : (el.text || '');
        return `  <${el.tag} class="${el.className}" style="${style}" ${attrs}>${content}</${el.tag}>`;
    }).join('\n');
}

function generateCSS() {
    const blocks = state.elements.map(el => {
        const styles = [];
        if (el.styles.backgroundColor) styles.push(`  background-color: ${el.styles.backgroundColor};`);
        if (el.styles.color) styles.push(`  color: ${el.styles.color};`);
        if (el.styles.borderRadius) styles.push(`  border-radius: ${el.styles.borderRadius};`);
        if (el.styles.fontSize) styles.push(`  font-size: ${el.styles.fontSize};`);

        if (el.animations.length) {
            const anims = el.animations.map((a, i) =>
                `${a.property} ${a.duration}ms ${a.easing} ${a.time}ms`
            ).join(', ');
            styles.push(`  animation: ${anims};`);
        }

        return `.${el.className}-${el.id.slice(-4)} {\n${styles.join('\n')}\n}`;
    });

    return blocks.join('\n\n') || '/* No custom styles */';
}