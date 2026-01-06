import { cleanup, render, screen } from '@testing-library/react';
import { ComponentPropsWithRef, forwardRef } from 'react';

import { forwardX } from '../forwardX';

describe('forwardX', () => {
  afterEach(() => {
    cleanup();
  });

  describe('class: props', () => {
    it('should add class when value is true', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:active={true} />);

      expect(screen.getByTestId('element')).toHaveClass('active');
    });

    it('should not add class when value is false', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:active={false} />);

      expect(screen.getByTestId('element')).not.toHaveClass('active');
    });

    it('should not add class when value is null', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:active={null} />);

      expect(screen.getByTestId('element')).not.toHaveClass('active');
    });

    it('should not add class when value is undefined', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:active={undefined} />);

      expect(screen.getByTestId('element')).not.toHaveClass('active');
    });

    it('should use string value as class name alias', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:base="Button_button__x7f2s" />);

      const element = screen.getByTestId('element');
      expect(element).toHaveClass('Button_button__x7f2s');
      expect(element).not.toHaveClass('base');
    });

    it('should handle CSS Modules style usage', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      // Simulating CSS Modules
      const styles = {
        button: 'Button_button__abc123',
        primary: 'Button_primary__def456',
        disabled: 'Button_disabled__ghi789',
      };

      render(
        <XDiv
          class:base={styles.button}
          class:variant={styles.primary}
          class:state={styles.disabled}
        />,
      );

      const element = screen.getByTestId('element');
      expect(element).toHaveClass('Button_button__abc123');
      expect(element).toHaveClass('Button_primary__def456');
      expect(element).toHaveClass('Button_disabled__ghi789');
    });

    it('should handle conditional CSS Modules (falsy string)', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      const isDisabled = false;
      const styles = { disabled: 'Button_disabled__ghi789' };

      render(<XDiv class:disabled={isDisabled && styles.disabled} />);

      const element = screen.getByTestId('element');
      expect(element).not.toHaveClass('Button_disabled__ghi789');
      expect(element).not.toHaveClass('disabled');
    });

    it('should handle multiple conditional classes', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(
        <XDiv
          class:active={true}
          class:disabled={false}
          class:visible={true}
        />,
      );

      const element = screen.getByTestId('element');
      expect(element).toHaveClass('active');
      expect(element).toHaveClass('visible');
      expect(element).not.toHaveClass('disabled');
    });

    it('should support kebab-case class names', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:my-custom-class={true} />);

      expect(screen.getByTestId('element')).toHaveClass('my-custom-class');
    });

    it('should combine with className prop', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv className="base" class:active={true} />);

      const element = screen.getByTestId('element');
      expect(element).toHaveClass('base');
      expect(element).toHaveClass('active');
    });

    // Edge cases / negative tests
    it('should add "NaN" as class when value is NaN', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:test={NaN as any} />);

      const element = screen.getByTestId('element');
      expect(element).toHaveClass('NaN');
      expect(element).not.toHaveClass('test');
    });

    it('should add "[object Object]" as class when value is an object', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:test={{} as any} />);

      const element = screen.getByTestId('element');
      expect(element.className).toContain('[object Object]');
      expect(element).not.toHaveClass('test');
    });

    it('should add number as string class when value is a number', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:test={42 as any} />);

      const element = screen.getByTestId('element');
      expect(element.className).toContain('42');
    });

    it('should add "0" as class when value is 0 (edge case)', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:test={0 as any} />);

      const element = screen.getByTestId('element');
      // 0 !== null, 0 !== undefined, 0 !== false → should add "0"
      expect(element.className).toContain('0');
    });

    it('should not add class when value is empty string', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv class:test={'' as any} />);

      const element = screen.getByTestId('element');
      // Empty string is truthy check passes but results in empty class
      // This depends on implementation - checking actual behavior
      expect(element.className).toBe('');
    });
  });

  describe('classList prop', () => {
    it('should add classes from array', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv classList={['one', 'two', 'three']} />);

      const element = screen.getByTestId('element');
      expect(element).toHaveClass('one');
      expect(element).toHaveClass('two');
      expect(element).toHaveClass('three');
    });

    it('should filter falsy values from classList', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv classList={['valid', '', 'another']} />);

      const element = screen.getByTestId('element');
      expect(element).toHaveClass('valid');
      expect(element).toHaveClass('another');
      expect(element.className).toBe('valid another');
    });

    it('should combine classList with className and class: props', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(
        <XDiv
          className="base"
          classList={['from-list']}
          class:conditional={true}
        />,
      );

      const element = screen.getByTestId('element');
      expect(element).toHaveClass('base');
      expect(element).toHaveClass('from-list');
      expect(element).toHaveClass('conditional');
    });
  });

  describe('style: props', () => {
    it('should apply inline style from style: prop', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv style:padding="20px" />);

      expect(screen.getByTestId('element')).toHaveStyle({ padding: '20px' });
    });

    it('should handle multiple style: props', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(
        <XDiv
          style:display="flex"
          style:justifyContent="center"
          style:alignItems="center"
        />,
      );

      const element = screen.getByTestId('element');
      expect(element).toHaveStyle({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      });
    });

    it('should combine style: props with style object', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv style={{ margin: '10px' }} style:padding="20px" />);

      const element = screen.getByTestId('element');
      expect(element).toHaveStyle({ margin: '10px' });
      expect(element).toHaveStyle({ padding: '20px' });
    });

    it('should let style object override style: props', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv style:padding="20px" style={{ padding: '10px' }} />);

      expect(screen.getByTestId('element')).toHaveStyle({ padding: '10px' });
    });
  });

  describe('var: props', () => {
    it('should apply CSS variable from var: prop', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv var:primaryColor="#007bff" />);

      const element = screen.getByTestId('element');
      expect(element.style.getPropertyValue('--primaryColor')).toBe('#007bff');
    });

    it('should handle multiple var: props', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(
        <XDiv
          var:primary="#007bff"
          var:secondary="#6c757d"
          var:spacing="16px"
        />,
      );

      const element = screen.getByTestId('element');
      expect(element.style.getPropertyValue('--primary')).toBe('#007bff');
      expect(element.style.getPropertyValue('--secondary')).toBe('#6c757d');
      expect(element.style.getPropertyValue('--spacing')).toBe('16px');
    });

    it('should handle numeric values for var: props', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv var:columns={3} />);

      const element = screen.getByTestId('element');
      expect(element.style.getPropertyValue('--columns')).toBe('3');
    });

    it('should combine var: props with style: props and style object', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(
        <XDiv
          style={{ margin: '10px' }}
          style:padding="20px"
          var:color="red"
        />,
      );

      const element = screen.getByTestId('element');
      expect(element).toHaveStyle({ margin: '10px' });
      expect(element).toHaveStyle({ padding: '20px' });
      expect(element.style.getPropertyValue('--color')).toBe('red');
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to the component', () => {
      const InnerDiv = forwardRef<HTMLDivElement, ComponentPropsWithRef<'div'>>(
        (props, ref) => <div {...props} ref={ref} data-testid="element" />,
      );

      const XDiv = forwardX(InnerDiv);

      let capturedRef: HTMLDivElement | null = null;

      render(
        <XDiv
          ref={(el: HTMLDivElement) => {
            capturedRef = el;
          }}
        />,
      );

      expect(capturedRef).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('regular props passthrough', () => {
    it('should pass through regular props', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv id="my-id" data-custom="value" aria-label="label" />);

      const element = screen.getByTestId('element');
      expect(element).toHaveAttribute('id', 'my-id');
      expect(element).toHaveAttribute('data-custom', 'value');
      expect(element).toHaveAttribute('aria-label', 'label');
    });

    it('should pass children correctly', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(
        <XDiv>
          <span>Child content</span>
        </XDiv>,
      );

      expect(screen.getByTestId('element')).toHaveTextContent('Child content');
    });
  });

  describe('edge cases', () => {
    it('should handle empty props', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv />);

      const element = screen.getByTestId('element');
      expect(element).toBeInTheDocument();
      expect(element.className).toBe('');
    });

    it('should not have classList in final props', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(<XDiv classList={['one', 'two']} />);

      const element = screen.getByTestId('element');
      expect(element).not.toHaveAttribute('classlist');
    });

    it('should handle all features combined', () => {
      const XDiv = forwardX((props: ComponentPropsWithRef<'div'>) => (
        <div {...props} data-testid="element" />
      ));

      render(
        <XDiv
          className="base"
          classList={['list-class']}
          class:conditional={true}
          class:inactive={false}
          style={{ margin: '5px' }}
          style:padding="10px"
          var:theme="dark"
          id="combined"
          data-test="value"
        >
          Content
        </XDiv>,
      );

      const element = screen.getByTestId('element');

      // Classes
      expect(element).toHaveClass('base');
      expect(element).toHaveClass('list-class');
      expect(element).toHaveClass('conditional');
      expect(element).not.toHaveClass('inactive');

      // Styles
      expect(element).toHaveStyle({ margin: '5px' });
      expect(element).toHaveStyle({ padding: '10px' });

      // CSS variable
      expect(element.style.getPropertyValue('--theme')).toBe('dark');

      // Regular props
      expect(element).toHaveAttribute('id', 'combined');
      expect(element).toHaveAttribute('data-test', 'value');

      // Children
      expect(element).toHaveTextContent('Content');
    });
  });
});
