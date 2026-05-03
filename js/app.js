import { state } from './state.js';
import { HistoryManager } from './history.js';
import { initDragAndDrop } from './dragdrop.js';
import { initResponsive } from './responsive.js';
import { initTimeline, renderTimeline } from './timeline.js';
import { initCodeGen } from './codegen.js';
import { renderCanvas, updatePropertiesPanel, updateLayersPanel } from './canvas.js';

// Theme toggle
document.getElementById('btn-theme').addEventListener('click', () => {
    const current = document.body.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = next;
    state.theme = next;
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        HistoryManager.undo();
        renderCanvas();
        updatePropertiesPanel();
        updateLayersPanel();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        HistoryManager.redo();
        renderCanvas();
        updatePropertiesPanel();
        updateLayersPanel();
    }
    if (e.key === 'Delete' && state.selected) {
        document.getElementById('btn-delete')?.click();
    }
});

// Panel tabs
document.querySelectorAll('.panel__tabs .tab, .modal__tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const parent = tab.closest('.panel, .modal__content');
        parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const contents = parent.querySelectorAll('.tab-content');
        contents.forEach(c => c.classList.remove('active'));
        const target = parent.querySelector(`#tab-${tab.dataset.tab}`);
        if (target) target.classList.add('active');
    });
});

// Init
initDragAndDrop();
initResponsive();
initTimeline();
initCodeGen();
renderCanvas();
updateLayersPanel();

console.log('🚀 Nexus Builder initialized');