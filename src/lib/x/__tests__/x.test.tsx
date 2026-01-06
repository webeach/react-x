import { cleanup, render, screen } from '@testing-library/react';
import { CSSProperties, ReactNode } from 'react';

import { x } from '../x';

describe('x', () => {
  afterEach(() => {
    cleanup();
  });

  describe('as HTML/SVG tag collection', () => {
    it('should export x.div', () => {
      render(<x.div data-testid="element">Content</x.div>);
      expect(screen.getByTestId('element')).toBeInTheDocument();
    });

    it('should export common HTML tags', () => {
      render(
        <>
          <x.span data-testid="span" />
          <x.button data-testid="button" />
          <x.input data-testid="input" />
          <x.form data-testid="form" />
          <x.a data-testid="a" />
          <x.p data-testid="p" />
          <x.h1 data-testid="h1" />
          <x.ul data-testid="ul" />
          <x.li data-testid="li" />
        </>,
      );

      expect(screen.getByTestId('span').tagName).toBe('SPAN');
      expect(screen.getByTestId('button').tagName).toBe('BUTTON');
      expect(screen.getByTestId('input').tagName).toBe('INPUT');
      expect(screen.getByTestId('form').tagName).toBe('FORM');
      expect(screen.getByTestId('a').tagName).toBe('A');
      expect(screen.getByTestId('p').tagName).toBe('P');
      expect(screen.getByTestId('h1').tagName).toBe('H1');
      expect(screen.getByTestId('ul').tagName).toBe('UL');
      expect(screen.getByTestId('li').tagName).toBe('LI');
    });

    it('should export SVG tags', () => {
      render(
        <x.svg data-testid="svg">
          <x.path data-testid="path" />
          <x.circle data-testid="circle" />
          <x.rect data-testid="rect" />
        </x.svg>,
      );

      expect(screen.getByTestId('svg').tagName).toBe('svg');
      expect(screen.getByTestId('path').tagName).toBe('path');
      expect(screen.getByTestId('circle').tagName).toBe('circle');
      expect(screen.getByTestId('rect').tagName).toBe('rect');
    });
  });

  describe('as HOC', () => {
    it('should wrap custom components', () => {
      const Button = ({
        className,
        children,
      }: {
        className?: string;
        children?: ReactNode;
      }) => (
        <button className={className} data-testid="button">
          {children}
        </button>
      );

      const XButton = x(Button);

      render(<XButton class:primary={true}>Click</XButton>);

      expect(screen.getByTestId('button')).toHaveClass('primary');
      expect(screen.getByTestId('button')).toHaveTextContent('Click');
    });

    it('should support typed CSS variables', () => {
      type ThemeVars = {
        primaryColor: string;
        spacing: number;
      };

      const Box = ({
        className,
        style,
        children,
      }: {
        className?: string;
        style?: CSSProperties;
        children?: ReactNode;
      }) => (
        <div className={className} style={style} data-testid="box">
          {children}
        </div>
      );

      const ThemedBox = x<
        typeof Box extends (props: infer P) => any ? P : never,
        ThemeVars
      >(Box);

      render(
        <ThemedBox var:primaryColor="blue" var:spacing={16}>
          Content
        </ThemedBox>,
      );

      const element = screen.getByTestId('box');
      expect(element.style.getPropertyValue('--primaryColor')).toBe('blue');
      expect(element.style.getPropertyValue('--spacing')).toBe('16');
    });
  });

  describe('class: with different value types', () => {
    it('should handle boolean true', () => {
      render(<x.div data-testid="element" class:active={true} />);
      expect(screen.getByTestId('element')).toHaveClass('active');
    });

    it('should handle boolean false', () => {
      render(<x.div data-testid="element" class:active={false} />);
      expect(screen.getByTestId('element')).not.toHaveClass('active');
    });

    it('should handle null', () => {
      render(<x.div data-testid="element" class:active={null} />);
      expect(screen.getByTestId('element')).not.toHaveClass('active');
    });

    it('should handle undefined', () => {
      render(<x.div data-testid="element" class:active={undefined} />);
      expect(screen.getByTestId('element')).not.toHaveClass('active');
    });

    it('should handle string as alias (CSS Modules)', () => {
      render(<x.div data-testid="element" class:base="Module_class__hash" />);
      const element = screen.getByTestId('element');
      expect(element).toHaveClass('Module_class__hash');
      expect(element).not.toHaveClass('base');
    });

    it('should handle conditional string (truthy)', () => {
      const isActive = true;
      render(
        <x.div
          data-testid="element"
          class:state={isActive && 'Module_active__abc'}
        />,
      );
      expect(screen.getByTestId('element')).toHaveClass('Module_active__abc');
    });

    it('should handle conditional string (falsy)', () => {
      const isActive = false;
      render(
        <x.div
          data-testid="element"
          class:state={isActive && 'Module_active__abc'}
        />,
      );
      expect(screen.getByTestId('element')).not.toHaveClass(
        'Module_active__abc',
      );
      expect(screen.getByTestId('element')).not.toHaveClass('state');
    });

    // Negative/edge cases
    it('should convert NaN to "NaN" string class', () => {
      render(<x.div data-testid="element" class:test={NaN as any} />);
      const element = screen.getByTestId('element');
      expect(element.className).toContain('NaN');
    });

    it('should convert object to "[object Object]" string class', () => {
      render(<x.div data-testid="element" class:test={{} as any} />);
      const element = screen.getByTestId('element');
      expect(element.className).toContain('[object Object]');
    });

    it('should convert number to string class', () => {
      render(<x.div data-testid="element" class:test={123 as any} />);
      const element = screen.getByTestId('element');
      expect(element.className).toContain('123');
    });

    it('should convert 0 to "0" string class', () => {
      render(<x.div data-testid="element" class:test={0 as any} />);
      const element = screen.getByTestId('element');
      expect(element.className).toContain('0');
    });

    it('should handle array (converted to string)', () => {
      render(<x.div data-testid="element" class:test={['a', 'b'] as any} />);
      const element = screen.getByTestId('element');
      // Array.toString() returns "a,b"
      expect(element.className).toContain('a,b');
    });
  });

  describe('full integration', () => {
    it('should handle complex nested structure', () => {
      render(
        <x.div
          data-testid="container"
          class:container={true}
          style:display="flex"
          style:flexDirection="column"
          var:gap="16px"
        >
          <x.header
            data-testid="header"
            class:header={true}
            style:padding="20px"
          >
            <x.h1 data-testid="title" class:title={true}>
              Title
            </x.h1>
          </x.header>
          <x.main
            data-testid="main"
            class:main={true}
            class:active={true}
            style:flex="1"
          >
            <x.p data-testid="paragraph">Content</x.p>
          </x.main>
          <x.footer data-testid="footer" class:footer={true}>
            Footer
          </x.footer>
        </x.div>,
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container');
      expect(container).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
      });
      expect(container.style.getPropertyValue('--gap')).toBe('16px');

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('header');
      expect(header).toHaveStyle({ padding: '20px' });

      const title = screen.getByTestId('title');
      expect(title).toHaveClass('title');
      expect(title).toHaveTextContent('Title');

      const main = screen.getByTestId('main');
      expect(main).toHaveClass('main');
      expect(main).toHaveClass('active');
      expect(main).toHaveStyle({ flex: '1' });

      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('footer');
      expect(footer).toHaveTextContent('Footer');
    });

    it('should work with CSS Modules pattern', () => {
      // Simulating CSS Modules
      const styles = {
        button: 'Button_button__abc123',
        primary: 'Button_primary__def456',
        secondary: 'Button_secondary__ghi789',
        disabled: 'Button_disabled__jkl012',
      };

      type ButtonProps = {
        variant?: 'primary' | 'secondary';
        disabled?: boolean;
        children: ReactNode;
      };

      function Button({
        variant = 'primary',
        disabled,
        children,
      }: ButtonProps) {
        return (
          <x.button
            data-testid="button"
            class:base={styles.button}
            class:variant={
              variant === 'primary' ? styles.primary : styles.secondary
            }
            class:disabled={disabled && styles.disabled}
            disabled={disabled}
          >
            {children}
          </x.button>
        );
      }

      render(<Button variant="primary">Click</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('Button_button__abc123');
      expect(button).toHaveClass('Button_primary__def456');
      expect(button).not.toHaveClass('Button_disabled__jkl012');
    });

    it('should work in realistic card component scenario', () => {
      type CardProps = {
        title: string;
        accentColor?: string;
        children: ReactNode;
      };

      function Card({ title, accentColor = '#007bff', children }: CardProps) {
        return (
          <x.article
            data-testid="card"
            class:card={true}
            var:accentColor={accentColor}
            style:borderLeft="4px solid var(--accentColor)"
            style:padding="20px"
            style:borderRadius="8px"
          >
            <x.h2
              data-testid="card-title"
              style:color="var(--accentColor)"
              style:marginTop="0"
            >
              {title}
            </x.h2>
            <x.div data-testid="card-content">{children}</x.div>
          </x.article>
        );
      }

      render(
        <Card title="Test Card" accentColor="red">
          Card content here
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('card');
      expect(card.style.getPropertyValue('--accentColor')).toBe('red');
      expect(card).toHaveStyle({ padding: '20px' });
      expect(card).toHaveStyle({ borderRadius: '8px' });
      expect(card.style.borderLeft).toContain('var(--accentColor)');

      const title = screen.getByTestId('card-title');
      expect(title.style.color).toBe('var(--accentColor)');
      expect(title).toHaveStyle({ marginTop: '0' });
      expect(title).toHaveTextContent('Test Card');

      expect(screen.getByTestId('card-content')).toHaveTextContent(
        'Card content here',
      );
    });
  });
});
