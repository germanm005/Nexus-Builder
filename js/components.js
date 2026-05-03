import { generateId } from './state.js';

export const componentRegistry = {
    button: {
        tag: 'button',
        className: 'el-button',
        defaultText: 'Button',
        defaultProps: { width: 120, height: 40, x: 50, y: 50 }
    },
    card: {
        tag: 'div',
        className: 'el-card',
        defaultText: 'Card Content',
        defaultProps: { width: 240, height: 160, x: 50, y: 50 }
    },
    input: {
        tag: 'input',
        className: 'el-input',
        defaultProps: { width: 200, height: 40, x: 50, y: 50, placeholder: 'Type here...' }
    },
    text: {
        tag: 'div',
        className: 'el-text',
        defaultText: 'Double-click to edit',
        defaultProps: { width: 200, height: 30, x: 50, y: 50 }
    },
    image: {
        tag: 'div',
        className: 'el-image',
        defaultText: '🖼️ Image',
        defaultProps: { width: 200, height: 150, x: 50, y: 50 }
    }
};

export function createComponent(type, overrides = {}) {
    const registry = componentRegistry[type];
    if (!registry) return null;

    return {
        id: generateId(),
        type,
        tag: registry.tag,
        className: registry.className,
        text: overrides.text !== undefined ? overrides.text : registry.defaultText,
        x: overrides.x !== undefined ? overrides.x : registry.defaultProps.x,
        y: overrides.y !== undefined ? overrides.y : registry.defaultProps.y,
        width: overrides.width !== undefined ? overrides.width : registry.defaultProps.width,
        height: overrides.height !== undefined ? overrides.height : registry.defaultProps.height,
        styles: {
            backgroundColor: '',
            color: '',
            borderRadius: '',
            fontSize: '',
            ...overrides.styles
        },
        animations: [],
        visible: true
    };
}