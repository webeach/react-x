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
  <p>A React extension library that adds convenient syntax for working with CSS classes, styles, and CSS variables directly in JSX.</p>
</div>

---

## 💎 Features

- 🎨 **Conditional CSS classes** — add classes via `class:className` with CSS Modules support
- 💅 **Inline styles as props** — set styles via `style:property`
- 🔧 **CSS variables** — pass CSS custom properties via `var:variableName`
- 📋 **classList** — array of classes instead of string concatenation
- 🏷️ **All HTML/SVG tags** — ready-to-use components `x.div`, `x.span`, `x.svg`, etc.
- 🔄 **HOC for components** — wrap your components with `x(Component)`
- 📝 **Full TypeScript support** — out of the box

---

## 📦 Installation

```bash
npm install @webeach/react-x
```

or

```bash
pnpm install @webeach/react-x
```

or

```bash
yarn add @webeach/react-x
```

---

## 🚀 Quick Start

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
      Hello, World!
    </x.div>
  );
}
```

Result in DOM:

```html
<div
  class="container active"
  style="padding: 20px; background-color: #f0f0f0; --primaryColor: #007bff;"
>
  Hello, World!
</div>
```

---

## 🛠 API

### The `x` Object

The main export of the library. Works in two ways:

#### 1. As a collection of extended HTML/SVG tags

```tsx
import { x } from '@webeach/react-x';

// HTML tags
<x.div>...</x.div>
<x.span>...</x.span>
<x.button>...</x.button>
<x.input />
<x.form>...</x.form>

// SVG tags
<x.svg>...</x.svg>
<x.path />
<x.circle />
<x.rect />
```

All standard HTML and SVG tags are supported.

#### 2. As a HOC for wrapping components

```tsx
import { x } from '@webeach/react-x';

// Your component
const ButtonInternal = ({ className, style, children, ...props }) => (
  <button className={className} style={style} {...props}>
    {children}
  </button>
);

// Extended component
const Button = x(Button);

// Usage
<Button
  class:primary
  class:large={size === 'large'}
  style:borderRadius="8px"
  var:btnColor="blue"
>
  Click me
</Button>
```

---

### Conditional CSS Classes: `class:`

Add CSS classes conditionally via props with the `class:` prefix.

```tsx
<x.div
  class:visible={isVisible}      // added if isVisible === true
  class:hidden={!isVisible}      // added if isVisible === false
  class:active={isActive}
  class:error={hasError}
  class:my-custom-class          // kebab-case is supported
>
  Content
</x.div>
```

**Supported value types:**
- `boolean` — `true` adds the class, `false` does not
- `string` — used as an **alias** (class name from value, not from key)
- `null | undefined` — class is not added

#### Usage with CSS Modules

Pass a string to use with CSS Modules — the value becomes the class name:

```tsx
import styles from './Button.module.css';

<x.button
  class:base={styles.button}           // adds class from styles.button
  class:primary={styles.primary}       // adds class from styles.primary  
  class:disabled={isDisabled && styles.disabled}  // conditional
>
  Click me
</x.button>
```

If `styles.button = "Button_button__x7f2s"`, the result:

```html
<button class="Button_button__x7f2s Button_primary__a3bc1">
  Click me
</button>
```

**Important:** When passing a string, the **value** is used as the class name, not the key after `class:`.

---

### Class Array: `classList`

An alternative way to pass multiple classes via an array:

```tsx
const classes = ['card', 'card-primary', isLarge && 'card-large'];

<x.div classList={classes}>
  Content
</x.div>
```

Falsy array elements are automatically filtered out.

Can be combined with `className` and `class:`:

```tsx
<x.div
  className="base-class"
  classList={['additional', 'classes']}
  class:conditional
>
  All three methods work together
</x.div>
// Result: class="base-class additional classes conditional"
```

---

### Inline Styles: `style:`

Set CSS properties directly via props with the `style:` prefix.

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
  Flex container
</x.div>
```

**Advantages:**
- IDE autocompletion for CSS property names
- Typed values
- Clean syntax without nested objects

Can be combined with regular `style`:

```tsx
<x.div
  style={{ margin: '10px' }}
  style:padding="20px"
  style:color="red"
>
  Styles are merged
</x.div>
```

---

### CSS Variables: `var:`

Pass CSS custom properties (variables) via props with the `var:` prefix.

```tsx
<x.div
  var:primaryColor="#007bff"
  var:secondaryColor="#6c757d"
  var:spacing="16px"
  var:columns={3}
>
  <x.span style:color="var(--primaryColor)">
    Text in primary color
  </x.span>
</x.div>
```

Result in DOM:

```html
<div style="--primaryColor: #007bff; --secondaryColor: #6c757d; --spacing: 16px; --columns: 3;">
  <span style="color: var(--primaryColor);">
    Text in primary color
  </span>
</div>
```

**Supported value types:**
- `string` — `var:color="red"`
- `number` — `var:columns={3}`
- `null` — to reset a variable

---

### CSS Variables Typing

You can type available CSS variables for a component:

```tsx
import { ReactNode } from 'react';
import { x } from '@webeach/react-x';

// Define variable types
type ThemeVars = {
  primaryColor: string;
  secondaryColor: string;
  spacing: number;
};

// Typed component
const ThemedBox = x<{ children: ReactNode }, ThemeVars>(
  ({ children, className, style }) => (
    <div className={className} style={style}>
      {children}
    </div>
  )
);

// Now IDE suggests available variables
<ThemedBox
  var:primaryColor="blue"    // ✓ autocompletion works
  var:secondaryColor="gray"  // ✓
  var:spacing={16}           // ✓
  var:unknownVar="value"     // ✗ TypeScript error
>
  Content
</ThemedBox>
```

---

## 📥 Usage Examples

### Button with Variants

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

### Button with CSS Modules

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

### Themed Card

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

### Responsive Grid

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

### SVG Icon

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

## 📐 Exported Types

```tsx
import type { XClassProps, XStyleProps, XVarProps } from '@webeach/react-x';
```

- **`XClassProps`** — types for `class:*` props
- **`XStyleProps`** — types for `style:*` props (based on `CSSProperties`)
- **`XVarProps<T>`** — types for `var:*` props with optional variable typing

---

## ⚖️ Comparison with Alternatives

| Feature             | react-x                  | clsx/classnames          | styled-components         |
|---------------------|--------------------------|--------------------------|---------------------------|
| Conditional classes | `class:active={bool}`    | `clsx({ active: bool })` | `${bool && 'active'}`     |
| CSS Modules         | `class:x={styles.class}` | `clsx(styles.class)`     | ❌                         |
| Inline styles       | `style:padding="10px"`   | ❌                        | Built-in                  |
| CSS variables       | `var:color="red"`        | ❌                        | `${props => props.color}` |
| TypeScript          | ✅ Full                   | ✅                        | ✅                         |
| Runtime overhead    | Minimal                  | Minimal                  | CSS-in-JS                 |
| Bundle size         | ~2KB                     | ~1KB                     | ~15KB                     |

---

## 🧩 Dependencies

This library has no external dependencies (**Zero dependencies**).

---

## 🔖 Releasing a New Version

Releases are handled automatically via `semantic-release`.

Before publishing a new version, ensure that:

1. All changes are committed and pushed to the `main` branch.
2. Commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:
   - `feat: ...` — for new features
   - `fix: ...` — for bug fixes
   - `chore: ...`, `refactor: ...` and other types — as needed
3. Versioning is determined automatically based on commit types (`patch`, `minor`, `major`).

---

## 👨‍💻 Author

Development and maintenance: [Ruslan Martynov](https://github.com/ruslan-mart)

If you have suggestions or found a bug, open an issue or submit a pull request.

---

## 📄 License

This package is distributed under the [MIT License](./LICENSE).

