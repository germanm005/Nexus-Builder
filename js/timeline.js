import { state } from './state.js';

export function initTimeline() {
    const track = document.getElementById('timeline-track');
    const addBtn = document.getElementById('btn-add-animation');

    addBtn.addEventListener('click', () => {
        const el = state.selected;
        if (!el) {
            alert('Select an element first');
            return;
        }

        const keyframe = {
            id: 'kf_' + Math.random().toString(36).substr(2, 9),
            time: el.animations.length * 500,
            property: 'transform',
            value: 'translateY(-10px)',
            duration: 300,
            easing: 'ease-out'
        };

        el.animations.push(keyframe);
        renderTimeline();
    });

    renderTimeline();
}

export function renderTimeline() {
    const track = document.getElementById('timeline-track');
    track.innerHTML = '';

    const el = state.selected;
    if (!el || !el.animations.length) {
        track.innerHTML = '<span style="color: var(--text-muted); font-size: 12px;">No animations. Select element and click +Add Keyframe</span>';
        return;
    }

    el.animations.forEach((kf, i) => {
        if (i > 0) {
            const connector = document.createElement('div');
            connector.className = 'keyframe-connector';
            track.appendChild(connector);
        }

        const div = document.createElement('div');
        div.className = 'keyframe';
        div.innerHTML = `
      <div class="keyframe__time">${kf.time}ms</div>
      <div class="keyframe__prop">${kf.property}</div>
    `;
        track.appendChild(div);
    });
}