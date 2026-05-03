import { state } from './state.js';
import { renderCanvas, updatePropertiesPanel } from './canvas.js';

export function initDragAndDrop() {
    const canvas = document.getElementById('canvas');
    let draggedEl = null;
    let startX, startY, startLeft, startTop;
    let isResizing = false;
    let resizeHandle = null;

    // Component library drag
    document.querySelectorAll('.component-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('component-type', item.dataset.type);
        });
    });

    canvas.addEventListener('dragover', (e) => e.preventDefault());

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('component-type');
        if (!type) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - 40; // offset
        const y = e.clientY - rect.top - 40;

        import('./history.js').then(({ HistoryManager }) => {
            import('./components.js').then(({ createComponent }) => {
                const newEl = createComponent(type, { x, y });

                HistoryManager.push(
                    `Add ${type}`,
                    () => {
                        state.elements.push(newEl);
                        renderCanvas();
                    },
                    () => {
                        state.elements = state.elements.filter(el => el.id !== newEl.id);
                        if (state.selectedId === newEl.id) state.selectedId = null;
                        renderCanvas();
                    }
                );
            });
        });
    });

    // Canvas element drag
    canvas.addEventListener('mousedown', (e) => {
        const el = e.target.closest('.canvas-element');
        const handle = e.target.closest('.resize-handle');

        if (handle) {
            isResizing = true;
            resizeHandle = handle.classList[1]; // nw, ne, sw, se
            draggedEl = el;
            e.stopPropagation();
        } else if (el) {
            isResizing = false;
            draggedEl = el;
            const id = el.dataset.id;
            state.selectedId = id;
            renderCanvas();
            updatePropertiesPanel();

            startX = e.clientX;
            startY = e.clientY;
            const data = state.getElementById(id);
            startLeft = data.x;
            startTop = data.y;
        } else {
            state.selectedId = null;
            renderCanvas();
            updatePropertiesPanel();
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!draggedEl) return;
        e.preventDefault();

        const id = draggedEl.dataset.id;
        const data = state.getElementById(id);
        if (!data) return;

        if (isResizing) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (resizeHandle.includes('e')) data.width = Math.max(20, startLeft + dx);
            if (resizeHandle.includes('s')) data.height = Math.max(20, startTop + dy);
            if (resizeHandle.includes('w')) {
                const newW = Math.max(20, data.width - dx);
                data.x += data.width - newW;
                data.width = newW;
                startX = e.clientX;
            }
            if (resizeHandle.includes('n')) {
                const newH = Math.max(20, data.height - dy);
                data.y += data.height - newH;
                data.height = newH;
                startY = e.clientY;
            }
        } else {
            data.x = startLeft + (e.clientX - startX);
            data.y = startTop + (e.clientY - startY);
        }

        renderCanvas();
    });

    window.addEventListener('mouseup', () => {
        if (draggedEl && !isResizing) {
            updatePropertiesPanel();
        }
        draggedEl = null;
        isResizing = false;
        resizeHandle = null;
    });
}