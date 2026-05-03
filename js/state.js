// Central State Management
export const state = {
    elements: [],
    selectedId: null,
    breakpoint: 'desktop',
    theme: 'dark',
    history: [],
    historyIndex: -1,
    maxHistory: 50,

    // Getters
    get selected() {
        return this.elements.find(el => el.id === this.selectedId);
    },

    getElementById(id) {
        return this.elements.find(el => el.id === id);
    }
};

export function generateId() {
    return 'el_' + Math.random().toString(36).substr(2, 9);
}