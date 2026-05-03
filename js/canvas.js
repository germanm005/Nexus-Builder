import { state } from './state.js';
import { componentRegistry } from './components.js';

export function renderCanvas() {
    const canvas = document.getElementById('canvas');
    const existing = canvas.querySelectorAll('.canvas-element');
    existing.forEach(el => el.remove());

    state.elements.forEach(el => {
        if (!el.visible) return;

        const div = document.createElement('div');
        div.className = `canvas-element ${el.className} ${state.selectedId === el.id ? 'selected' : ''}`;
        div.dataset.id = el.id;
        div.style.left = el.x + 'px';
        div.style.top = el.y + 'px';
        div.style.width = el.width + 'px';
        div.style.height = el.height + 'px';

        if (el.styles.backgroundColor) div.style.backgroundColor = el.styles.backgroundColor;
        if (el.styles.color) div.style.color = el.styles.color;
        if (el.styles.borderRadius) div.style.borderRadius = el.styles.borderRadius;
        if (el.styles.fontSize) div.style.fontSize = el.styles.fontSize;

        // Content
        if (el.tag === 'input') {
            const input = document.createElement('input');
            input.placeholder = el.text || '';
            input.style.width = '100%';
            input.style.height = '100%';
            input.style.background = 'transparent';
            input.style.border = 'none';
            input.style.color = 'inherit';
            input.style.pointerEvents = 'none';
            div.appendChild(input);
        } else {
            div.textContent = el.text || '';
        }

        // Resize handles
        if (state.selectedId === el.id) {
            ['nw', 'ne', 'sw', 'se'].forEach(pos => {
                const handle = document.createElement('div');
                handle.className = `resize-handle ${pos}`;
                div.appendChild(handle);
            });
        }

        canvas.appendChild(div);
    });
}

export function updatePropertiesPanel() {
    const panel = document.getElementById('properties-panel');
    const el = state.selected;

    if (!el) {
        panel.innerHTML = '<p class="empty-state">Select an element to edit</p>';
        return;
    }

    const registry = componentRegistry[el.type];

    panel.innerHTML = `
    <div class="prop-group">
      <span class="prop-group__label">Identity</span>
      <div class="prop-row">
        <label>Type</label>
        <input type="text" value="${el.type}" disabled>
      </div>
      <div class="prop-row">
        <label>ID</label>
        <input type="text" value="${el.id}" disabled style="font-size:10px">
      </div>
    </div>
    
    <div class="prop-group">
      <span class="prop-group__label">Layout</span>
      <div class="prop-grid">
        <div class="prop-row">
          <label>X</label>
          <input type="number" id="prop-x" value="${el.x}">
        </div>
        <div class="prop-row">
          <label>Y</label>
          <input type="number" id="prop-y" value="${el.y}">
        </div>
        <div class="prop-row">
          <label>W</label>
          <input type="number" id="prop-w" value="${el.width}">
        </div>
        <div class="prop-row">
          <label>H</label>
          <input type="number" id="prop-h" value="${el.height}">
        </div>
      </div>
    </div>
    
    <div class="prop-group">
      <span class="prop-group__label">Content</span>
      <div class="prop-row">
        <label>Text</label>
        <input type="text" id="prop-text" value="${el.text || ''}">
      </div>
    </div>
    
    <div class="prop-group">
      <span class="prop-group__label">Appearance</span>
      <div class="prop-row">
        <label>Bg Color</label>
        <input type="color" id="prop-bg" value="${el.styles.backgroundColor || '#6366f1'}">
      </div>
      <div class="prop-row">
        <label>Color</label>
        <input type="color" id="prop-color" value="${el.styles.color || '#ffffff'}">
      </div>
      <div class="prop-row">
        <label>Radius</label>
        <input type="text" id="prop-radius" value="${el.styles.borderRadius || '6px'}" placeholder="6px">
      </div>
      <div class="prop-row">
        <label>Font Size</label>
        <input type="text" id="prop-font" value="${el.styles.fontSize || '14px'}" placeholder="14px">
      </div>
    </div>
    
    <div class="prop-group">
      <span class="prop-group__label">Actions</span>
      <button class="btn btn--danger" id="btn-delete" style="width:100%">Delete Element</button>
    </div>
  `;

    // Bind inputs
    const bind = (id, path, isStyle = false) => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('input', (e) => {
            if (isStyle) {
                el.styles[path] = e.target.value;
            } else {
                el[path] = el.type === 'text' && path === 'text' ? e.target.value :
                    (['x', 'y', 'width', 'height'].includes(path) ? parseInt(e.target.value) || 0 : e.target.value);
            }
            renderCanvas();
        });
    };

    bind('prop-x', 'x');
    bind('prop-y', 'y');
    bind('prop-w', 'width');
    bind('prop-h', 'height');
    bind('prop-text', 'text');
    bind('prop-bg', 'backgroundColor', true);
    bind('prop-color', 'color', true);
    bind('prop-radius', 'borderRadius', true);
    bind('prop-font', 'fontSize', true);

    document.getElementById('btn-delete')?.addEventListener('click', () => {
        import('./history.js').then(({ HistoryManager }) => {
            const deleted = { ...el };
            const index = state.elements.indexOf(el);

            HistoryManager.push(
                'Delete element',
                () => {
                    state.elements.splice(index, 1);
                    state.selectedId = null;
                    renderCanvas();
                    updatePropertiesPanel();
                    updateLayersPanel();
                },
                () => {
                    state.elements.splice(index, 0, deleted);
                    state.selectedId = deleted.id;
                    renderCanvas();
                    updatePropertiesPanel();
                    updateLayersPanel();
                }
            );
        });
    });
}

export function updateLayersPanel() {
    const panel = document.getElementById('layers-panel');
    panel.innerHTML = '';

    [...state.elements].reverse().forEach(el => {
        const icons = { button: '🔘', card: '🃏', input: '⌨️', text: '📝', image: '🖼️' };
        const div = document.createElement('div');
        div.className = `layer-item ${state.selectedId === el.id ? 'active' : ''}`;
        div.innerHTML = `
      <span class="layer-item__icon">${icons[el.type] || '📦'}</span>
      <span class="layer-item__name">${el.type} ${el.id.slice(-4)}</span>
      <span class="layer-item__visibility">${el.visible ? '👁️' : '🚫'}</span>
    `;
        div.addEventListener('click', () => {
            state.selectedId = el.id;
            renderCanvas();
            updatePropertiesPanel();
            updateLayersPanel();
        });
        panel.appendChild(div);
    });
}