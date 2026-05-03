# Nexus Builder — Visual UI Editor

> Мини-Figma в браузере. Визуальный редактор интерфейсов с drag-and-drop, анимационным таймлайном и экспортом production-ready кода.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)

---

## Что это такое

**Nexus Builder** — это браузерный визуальный редактор UI-компонентов, демонстрирующий навыки фронтенд-разработчика уровня middle+/senior.

Проект написан без готовых библиотек типа `react-dnd` или `fabric.js`. Вся логика drag-and-drop, ресайза, snap-to-grid, истории команд и генерации кода — с нуля на чистом JavaScript с архитектурой, приближённой к TypeScript (strict types, generics, discriminated unions).

Это не To-Do список. Это архитектурная система, которую обычно строят команды из 5–8 человек.

---

## Структура проекта

```
nexus-builder/
│
├── index.html                 # Точка входа, подключает css/main.css и js/app.js
│
├── css/                       # Скомпилированные стили (не редактировать вручную)
│   ├── main.css              # Результат компиляции scss/main.scss
│   └── main.css.map          # Source map для отладки
│
├── scss/                      # Исходники стилей (ITCSS архитектура)
│   ├── main.scss             # Точка входа, импортирует все partials
│   ├── _variables.scss       # CSS Custom Properties, темы, spacing scale
│   ├── _layout.scss          # Сетка приложения, toolbar, workspace, panels
│   ├── _canvas.scss          # Холст, grid, guides, элементы, resize-handles
│   ├── _sidebar.scss         # Панель компонентов слева
│   ├── _properties.scss      # Панель свойств справа
│   ├── _layers.scss          # Панель слоёв (дерево элементов)
│   ├── _timeline.scss        # Анимационный таймлайн снизу
│   └── _components.scss      # Модальное окно, кнопки, скроллбар
│
└── js/                        # Логика приложения (ES Modules)
    ├── app.js                # Инициализация, keyboard shortcuts, табы
    ├── state.js              # Централизованное состояние (Store)
    ├── history.js            # Command Pattern для Undo/Redo
    ├── canvas.js             # Рендер холста, свойств, слоёв
    ├── dragdrop.js           # Drag & Drop + Resize с математикой
    ├── components.js         # Реестр компонентов и фабрика
    ├── properties.js         # Логика панели свойств (live-редактирование)
    ├── layers.js             # Панель слоёв (дерево элементов)
    ├── timeline.js           # Анимационный таймлайн
    ├── responsive.js         # Переключение breakpoints
    └── codegen.js            # Генератор HTML/SCSS кода
```

---

## Ключевые фичи

### 1. Canvas Engine (ядро редактора)
- **Drag & Drop с векторной математикой** — элементы перемещаются по дельте позиции
- **Snap-to-Grid** — динамическая сетка 20×20px с визуальными направляющими
- **Resize Handles** — 4 точки ресайза (nw, ne, sw, se) с сохранением пропорций
- **Z-Index & Layer Panel** — древовидная структура слоёв с визуальным отображением порядка

### 2. Component System
- Библиотека UI-компонентов: **Button, Card, Input, Text, Image**
- У каждого компонента — строго типизированные пропсы (TypeScript-style discriminated unions)
- **Design Tokens** — система CSS Custom Properties для цветов, типографики, spacing

### 3. Animation Timeline
- Панель с timeline как в After Effects
- CSS-анимации с кастомными easing
- Добавление keyframe'ов к выбранному элементу
- Экспорт анимаций в `@keyframes` SCSS

### 4. Responsive Studio
- Переключение breakpoints: **Desktop (1200px) / Tablet (768px) / Mobile (375px)**
- Плавные CSS-переходы при смене breakpoint
- Визуальные индикаторы текущего режима

### 5. Code Generator
- Парсинг дерева компонентов в реальном времени
- Экспорт в читаемый **HTML + SCSS**
- Модальное окно с переключением вкладок HTML / CSS
- Готовый production-ready код

### 6. History & State Management
- **Command Pattern** на TypeScript Generics
- Каждое действие — команда с `execute()` и `undo()`
- История на 50 шагов с группировкой действий
- Полная сериализация state в JSON

### 7. UX & Accessibility
- **Keyboard-First Workflow**
  - `Tab` — навигация
  - `Delete` — удаление выбранного элемента
  - `Ctrl+Z` / `Ctrl+Y` — Undo/Redo
- **Dark/Light Theme** — переключение через CSS Custom Properties, сохранение в `localStorage`
- **PWA-ready** — структура под Service Worker

---

## Технологический стек

| Технология | Что демонстрируется |
|-----------|---------------------|
| **HTML5** | Семантическая структура (`<aside>`, `<main>`, `<section>`), ARIA-разметка |
| **SCSS** | ITCSS архитектура, partials (`_*.scss`), CSS Custom Properties, Container Queries, Grid, Flexbox, `clip-path`, `backdrop-filter` |
| **JavaScript (ES2022)** | Векторная алгебра drag-and-drop, collision detection, алгоритм diff для Undo/Redo |
| **TypeScript-паттерны** | Discriminated unions, Generics, strict типизация state tree, Type Guards |
| **Архитектура** | Command Pattern, Observer-like state management, модульная структура ES Modules |

---

## Как запустить

### Быстрый старт (уже скомпилировано)

```bash
# Просто откройте index.html в браузере
# Или запустите через Live Server в VS Code
```

Файл `css/main.css` уже скомпилирован из `scss/`. Если вы не меняли стили — просто открывайте `index.html`.

### Разработка (если меняете SCSS)

```bash
# Установите Sass глобально
npm install -g sass

# Запустите watcher — SCSS будет автоматически компилироваться в CSS
sass --watch scss/main.scss css/main.css

# Или через VS Code + расширение Live Sass Compiler
# (оно создаст main.css и main.css.map автоматически)
```

> **Важно:** `index.html` подключает `css/main.css`, а не `scss/main.scss`. Браузер не умеет читать SCSS напрямую.

### Требования
- Современный браузер (Chrome 90+, Firefox 88+, Safari 14+)
- Поддержка ES Modules, CSS Grid, CSS Custom Properties
- Для разработки: Node.js + Sass (если редактируете стили)

---

## Примеры использования

### Создание кнопки
1. Перетащите **Button** из левой панели на canvas
2. Кликните по кнопке — откроется панель свойств справа
3. Измените цвет, текст, размер — изменения применяются мгновенно
4. Нажмите `Ctrl+Z` чтобы отменить

### Экспорт кода
1. Расположите элементы на canvas
2. Нажмите кнопку **Export Code** в toolbar
3. В модальном окне переключайтесь между HTML и SCSS
4. Копируйте готовый production-ready код

### Анимация
1. Выберите элемент на canvas
2. Нажмите **+ Add Keyframe** в таймлайне снизу
3. Настройте время, свойство и easing
4. Экспортируйте анимацию в CSS

---

## Архитектурные решения

### Почему Command Pattern для Undo/Redo?
Вместо тяжёлых snapshot'ов state используется паттерн Команда. Каждое действие инкапсулирует:
- `execute()` — прямое действие
- `undo()` — обратное действие

**Преимущества:**
- Хранение 50+ шагов истории без нагрузки на память
- Группировка действий (весь drag — одна команда)
- Легкое расширение новыми типами команд

### Почему `transform` вместо `top/left`?
Для достижения **60fps** при drag 50+ элементов используется CSS `transform: translate()` вместо изменения `top`/`left`. GPU-ускорение `transform` обеспечивает плавность даже на слабых устройствах.

### Почему CSS Custom Properties для тем?
Вместо переключения классов тема переключается через один атрибут `data-theme` на `<body>`. Все цвета — CSS переменные, переключение происходит мгновенно без пересчёта стилей.

### ITCSS в SCSS
Стили организованы по методологии **ITCSS** (Inverted Triangle CSS):
1. **Settings** (`_variables.scss`) — переменные, токены
2. **Generic** — сбросы, box-sizing
3. **Elements** — базовые стили body
4. **Objects** — сетки, layout-объекты
5. **Components** — конкретные UI-компоненты
6. **Utilities** — вспомогательные классы

---

## Roadmap

- [ ] **Multi-select** — выделение нескольких элементов рамкой
- [ ] **Grouping** — группировка элементов
- [ ] **Real-time Collaboration** — WebRTC синхронизация
- [ ] **React Export** — экспорт не только HTML, но и JSX компонентов
- [ ] **Plugin System** — API для сторонних компонентов
- [ ] **Import from Figma** — парсинг Figma API

---

## Лицензия

MIT © 2026 — создайте что-то крутое.

---

> *"Бизнес платит за надёжность и предсказуемость кода. Nexus Builder доказывает, что вы умеете строить сложные интерактивные системы, а не просто верстать лендинги."*
