import { state } from './state.js';

// Command Pattern for Undo/Redo
export class Command {
    constructor(execute, undo) {
        this.execute = execute;
        this.undo = undo;
    }
}

export class HistoryManager {
    static push(name, executeFn, undoFn) {
        // Remove future history if we're in the middle
        if (state.historyIndex < state.history.length - 1) {
            state.history = state.history.slice(0, state.historyIndex + 1);
        }

        const command = new Command(executeFn, undoFn);
        state.history.push({ name, command });

        if (state.history.length > state.maxHistory) {
            state.history.shift();
        } else {
            state.historyIndex++;
        }

        executeFn();
        updateHistoryButtons();
    }

    static undo() {
        if (state.historyIndex >= 0) {
            const { command } = state.history[state.historyIndex];
            command.undo();
            state.historyIndex--;
            updateHistoryButtons();
            return true;
        }
        return false;
    }

    static redo() {
        if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            const { command } = state.history[state.historyIndex];
            command.execute();
            updateHistoryButtons();
            return true;
        }
        return false;
    }
}

function updateHistoryButtons() {
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    if (undoBtn) undoBtn.disabled = state.historyIndex < 0;
    if (redoBtn) redoBtn.disabled = state.historyIndex >= state.history.length - 1;
}