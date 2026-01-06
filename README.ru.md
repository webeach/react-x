<div align="center">
  <img alt="react-x" src="./assets/logo.svg" height="240">
  <p>
    <a href="https://www.npmjs.com/package/@webeach/react-x">
       <img src="https://img.shields.io/npm/v/@webeach/react-x.svg?color=646fe1&labelColor=9B7AEF" alt="npm package" />
    </a>
    <a href="https://github.com/webeach/react-x/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/webeach/react-x/ci.yml?color=646fe1&labelColor=9B7AEF" alt="build" />
    </a>
    <a href="https://www.npmjs.com/package/@webeach/react-x">
      <img src="https://img.shields.io/npm/dm/@webeach/react-x.svg?color=646fe1&labelColor=9B7AEF" alt="npm downloads" />
    </a>
  </p>
  <p><a href="./README.md">🇺🇸 English version</a> | <a href="./README.ru.md">🇷🇺 Русская версия</a></p>
  <p>Библиотека расширения возможностей React, добавляющая удобный синтаксис для работы с CSS классами, стилями и CSS-переменными прямо в JSX.</p>
</div>

---

## 💎 Особенности

- 🎨 **Условные CSS-классы** — добавляйте классы через `class:имяКласса` с поддержкой CSS Modules
- 💅 **Inline-стили как пропсы** — задавайте стили через `style:свойство`
- 🔧 **CSS-переменные** — передавайте CSS custom properties через `var:имяПеременной`
- 📋 **classList** — массив классов вместо конкатенации строк
- 🏷️ **Все HTML/SVG теги** — готовые компоненты `x.div`, `x.span`, `x.svg` и т.д.
- 🔄 **HOC для компонентов** — оборачивайте свои компоненты через `x(Component)`
- 📝 **Полная типизация** — TypeScript из коробки

---

## 📦 Установка

```bash
npm install @webeach/react-x
```

или

```bash
pnpm install @webeach/react-x
```

или

```bash
yarn add @webeach/react-x
```

---

## 🚀 Быстрый старт

```tsx
import { x } from '@webeach/react-x';

function App() {
  const isActive = true;
  const isDisabled = false;

  return (
    <x.div
      class:container={true}
      class:active={isActive}
      class:disabled={isDisabled}
      style:padding="20px"
      style:backgroundColor="#f0f0f0"
      var:primaryColor="#007bff"
    >
      Привет, мир!
    </x.div>
  );
}
```

Результат в DOM:

```html
<div
  class="container active"
  style="padding: 20px; background-color: #f0f0f0; --primaryColor: #007bff;"
>
  Привет, мир!
</div>
```

---

## 🛠 API

### Объект `x`

Главный экспорт библиотеки. Работает двумя способами:

#### 1. Как коллекция расширенных HTML/SVG тегов

```tsx
import { x } from '@webeach/react-x';

// HTML теги
<x.div>...</x.div>
<x.span>...</x.span>
<x.button>...</x.button>
<x.input />
<x.form>...</x.form>

// SVG теги
<x.svg>...</x.svg>
<x.path />
<x.circle />
<x.rect />
```

Поддерживаются все стандартные HTML и SVG теги.

#### 2. Как HOC для оборачивания компонентов

```tsx
import { x } from '@webeach/react-x';

// Ваш компонент
const ButtonInternal = ({ className, style, children, ...props }) => (
  <button className={className} style={style} {...props}>
    {children}
  </button>
);

// Расширенный компонент
const Button = x(Button);

// Использование
<Button
  class:primary
  class:large={size === 'large'}
  style:borderRadius="8px"
  var:btnColor="blue"
>
  Нажми меня
</Button>
```

---

### Условные CSS-классы: `class:`

Добавляйте CSS-классы условно через пропсы с префиксом `class:`.

```tsx
<x.div
  class:visible={isVisible}      // добавится если isVisible === true
  class:hidden={!isVisible}      // добавится если isVisible === false
  class:active={isActive}
  class:error={hasError}
  class:my-custom-class          // можно использовать kebab-case
>
  Контент
</x.div>
```

**Поддерживаемые типы значений:**
- `boolean` — `true` добавляет класс, `false` не добавляет
- `string` — используется как **алиас** (имя класса из значения, а не из ключа)
- `null | undefined` — класс не добавляется

#### Использование с CSS Modules

Передавайте строку для использования с CSS Modules — значение становится именем класса:

```tsx
import styles from './Button.module.css';

<x.button
  class:base={styles.button}           // добавит класс из styles.button
  class:primary={styles.primary}       // добавит класс из styles.primary  
  class:disabled={isDisabled && styles.disabled}  // условно
>
  Нажми меня
</x.button>
```

Если `styles.button = "Button_button__x7f2s"`, результат:

```html
<button class="Button_button__x7f2s Button_primary__a3bc1">
  Нажми меня
</button>
```

**Важно:** При передаче строки используется **значение** как имя класса, а не ключ после `class:`.

---

### Массив классов: `classList`

Альтернативный способ передачи нескольких классов через массив:

```tsx
const classes = ['card', 'card-primary', isLarge && 'card-large'];

<x.div classList={classes}>
  Контент
</x.div>
```

Falsy элементы массива автоматически фильтруются.

Можно комбинировать с `className` и `class:`:

```tsx
<x.div
  className="base-class"
  classList={['additional', 'classes']}
  class:conditional
>
  Все три способа работают вместе
</x.div>
// Результат: class="base-class additional classes conditional"
```

---

### Inline-стили: `style:`

Задавайте CSS-свойства напрямую через пропсы с префиксом `style:`.

```tsx
<x.div
  style:display="flex"
  style:justifyContent="center"
  style:alignItems="center"
  style:gap="10px"
  style:padding="20px"
  style:backgroundColor="#f5f5f5"
  style:borderRadius="8px"
>
  Flex контейнер
</x.div>
```

**Преимущества:**
- Автодополнение в IDE для имён CSS-свойств
- Типизация значений
- Чистый синтаксис без вложенных объектов

Можно комбинировать с обычным `style`:

```tsx
<x.div
  style={{ margin: '10px' }}
  style:padding="20px"
  style:color="red"
>
  Стили объединяются
</x.div>
```

---

### CSS-переменные: `var:`

Передавайте CSS custom properties (переменные) через пропсы с префиксом `var:`.

```tsx
<x.div
  var:primaryColor="#007bff"
  var:secondaryColor="#6c757d"
  var:spacing="16px"
  var:columns={3}
>
  <x.span style:color="var(--primaryColor)">
    Текст основным цветом
  </x.span>
</x.div>
```

Результат в DOM:

```html
<div style="--primaryColor: #007bff; --secondaryColor: #6c757d; --spacing: 16px; --columns: 3;">
  <span style="color: var(--primaryColor);">
    Текст основным цветом
  </span>
</div>
```

**Поддерживаемые типы значений:**
- `string` — `var:color="red"`
- `number` — `var:columns={3}`
- `null` — для сброса переменной

---

### Типизация CSS-переменных

Можно типизировать доступные CSS-переменные для компонента:

```tsx
import { ReactNode } from 'react';
import { x } from '@webeach/react-x';

// Определяем тип переменных
type ThemeVars = {
  primaryColor: string;
  secondaryColor: string;
  spacing: number;
};

// Типизированный компонент
const ThemedBox = x<{ children: ReactNode }, ThemeVars>(
  ({ children, className, style }) => (
    <div className={className} style={style}>
      {children}
    </div>
  )
);

// Теперь IDE подсказывает доступные переменные
<ThemedBox
  var:primaryColor="blue"    // ✓ автодополнение работает
  var:secondaryColor="gray"  // ✓
  var:spacing={16}           // ✓
  var:unknownVar="value"     // ✗ ошибка TypeScript
>
  Контент
</ThemedBox>
```

---

## 📥 Примеры использования

### Кнопка с вариантами

```tsx
import { ReactNode } from 'react';
import { x } from '@webeach/react-x';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: ReactNode;
};

function Button({ variant = 'primary', size = 'medium', disabled, children }: ButtonProps) {
  return (
    <x.button
      class:btn
      class:btn-primary={variant === 'primary'}
      class:btn-secondary={variant === 'secondary'}
      class:btn-danger={variant === 'danger'}
      class:btn-sm={size === 'small'}
      class:btn-lg={size === 'large'}
      class:disabled={disabled}
      disabled={disabled}
    >
      {children}
    </x.button>
  );
}
```

### Кнопка с CSS Modules

```tsx
import { ReactNode } from 'react';
import { x } from '@webeach/react-x';

import styles from './Button.module.css';

type ButtonProps = {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  children: ReactNode;
};

function Button({ variant = 'primary', disabled, children }: ButtonProps) {
  return (
    <x.button
      class:base={styles.button}
      class:variant={variant === 'primary' ? styles.primary : styles.secondary}
      class:disabled={disabled && styles.disabled}
      disabled={disabled}
    >
      {children}
    </x.button>
  );
}
```

### Карточка с темой

```tsx
import { x } from '@webeach/react-x';

function Card({ title, children, accentColor = '#007bff' }) {
  return (
    <x.article
      class:card
      var:accentColor={accentColor}
      style:borderLeft="4px solid var(--accentColor)"
      style:padding="20px"
      style:borderRadius="8px"
      style:boxShadow="0 2px 8px rgb(0 0 0 / 0.1)"
    >
      <x.h2 style:color="var(--accentColor)" style:marginTop="0">
        {title}
      </x.h2>
      {children}
    </x.article>
  );
}
```

### Адаптивная сетка

```tsx
import { x } from '@webeach/react-x';

function Grid({ columns = 3, gap = '16px', children }) {
  return (
    <x.div
      style:display="grid"
      style:gridTemplateColumns={`repeat(${columns}, 1fr)`}
      style:gap={gap}
    >
      {children}
    </x.div>
  );
}
```

### SVG иконка

```tsx
import { x } from '@webeach/react-x';

function Icon({ size = 24, color = 'currentColor' }) {
  return (
    <x.svg
      var:iconSize={`${size}px`}
      var:iconColor={color}
      style:width="var(--iconSize)"
      style:height="var(--iconSize)"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--iconColor)"
      strokeWidth="2"
    >
      <x.path d="M12 2L2 7l10 5 10-5-10-5z" />
      <x.path d="M2 17l10 5 10-5" />
      <x.path d="M2 12l10 5 10-5" />
    </x.svg>
  );
}
```

---

## 📐 Экспортируемые типы

```tsx
import type { XClassProps, XStyleProps, XVarProps } from '@webeach/react-x';
```

- **`XClassProps`** — типы для пропсов `class:*`
- **`XStyleProps`** — типы для пропсов `style:*` (на основе `CSSProperties`)
- **`XVarProps<T>`** — типы для пропсов `var:*` с опциональной типизацией переменных

---

## ⚖️ Сравнение с альтернативами

| Возможность      | react-x                  | clsx/classnames          | styled-components         |
|------------------|--------------------------|--------------------------|---------------------------|
| Условные классы  | `class:active={bool}`    | `clsx({ active: bool })` | `${bool && 'active'}`     |
| CSS Modules      | `class:x={styles.class}` | `clsx(styles.class)`     | ❌                         |
| Inline стили     | `style:padding="10px"`   | ❌                        | Встроено                  |
| CSS переменные   | `var:color="red"`        | ❌                        | `${props => props.color}` |
| TypeScript       | ✅ Полный                 | ✅                        | ✅                         |
| Runtime overhead | Минимальный              | Минимальный              | CSS-in-JS                 |
| Размер бандла    | ~2KB                     | ~1KB                     | ~15KB                     |

---

## 🧩 Зависимости

Библиотека не имеет внешних зависимостей (**Zero dependencies**).

---

## 🔖 Выпуск новой версии

Релизы обрабатываются автоматически с помощью `semantic-release`.

Перед публикацией новой версии убедись, что:

1. Все изменения закоммичены и запушены в ветку `main`.
2. Сообщения коммитов соответствуют формату [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/):
   - `feat: ...` — для новых фич
   - `fix: ...` — для исправлений багов
   - `chore: ...`, `refactor: ...` и другие типы — по необходимости
3. Версионирование определяется автоматически на основе типа коммитов (`patch`, `minor`, `major`).

---

## 👨‍💻 Автор

Разработка и поддержка: [Руслан Мартынов](https://github.com/ruslan-mart)

Если у тебя есть предложения или найден баг, открывай issue или отправляй pull request.

---

## 📄 Лицензия

Этот пакет распространяется под [лицензией MIT](./LICENSE).


