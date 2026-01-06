import { createTagNameProxy } from '../createTagNameProxy';
import { forwardX } from '../forwardX';

import { X } from './types';

/**
 * Extended React component factory and HTML/SVG tag collection.
 *
 * Provides two ways to use:
 *
 * **1. As extended HTML/SVG tags:**
 * ```tsx
 * <x.div class:active={isActive} style:padding="20px" var:color="blue">
 *   Content
 * </x.div>
 * ```
 *
 * **2. As a HOC to wrap custom components:**
 * ```tsx
 * const Button = x(ButtonInternal);
 *
 * <Button class:primary style:borderRadius="8px" var:btnColor="red">
 *   Click me
 * </Button>
 * ```
 *
 * **Extended props:**
 * - `class:name` — conditional CSS class:
 *   - `boolean` — `true` adds class from key, `false` skips
 *   - `string` — uses value as class name (for CSS Modules)
 *   - `null | undefined` — skips
 * - `classList` — array of class names (falsy values are filtered)
 * - `style:property` — inline CSS property as a prop
 * - `var:name` — CSS custom property (variable)
 *
 * @example
 * // Conditional classes (boolean)
 * <x.button class:btn class:btn-primary={isPrimary} class:disabled={isDisabled}>
 *   Submit
 * </x.button>
 *
 * @example
 * // CSS Modules support (string value as alias)
 * import styles from './Button.module.css';
 *
 * <x.button
 *   class:base={styles.button}
 *   class:variant={styles.primary}
 *   class:state={isDisabled && styles.disabled}
 * >
 *   Click me
 * </x.button>
 *
 * @example
 * // Inline styles and CSS variables
 * <x.div
 *   style:display="flex"
 *   style:gap="16px"
 *   var:primaryColor="#007bff"
 * >
 *   <x.span style:color="var(--primaryColor)">Styled text</x.span>
 * </x.div>
 *
 * @example
 * // Wrapping a custom component with typed CSS variables
 * type ThemeVars = { accentColor: string; spacing: number };
 * const ThemedCard = x<CardProps, ThemeVars>(Card);
 *
 * <ThemedCard var:accentColor="red" var:spacing={16}>
 *   Content
 * </ThemedCard>
 */
export const x = createTagNameProxy(forwardX) as X;
