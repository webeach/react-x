import { cleanup, render, screen } from '@testing-library/react';

import { forwardX } from '../../forwardX';
import { createTagNameProxy } from '../createTagNameProxy';

describe('createTagNameProxy', () => {
  afterEach(() => {
    cleanup();
  });

  it('should create proxy with forwardX function', () => {
    const proxy = createTagNameProxy(forwardX);

    expect(proxy).toBeDefined();
    expect(typeof proxy).toBe('function');
  });

  it('should return extended component for HTML tag names', () => {
    const proxy = createTagNameProxy(forwardX);

    const XDiv = proxy.div;
    expect(XDiv).toBeDefined();

    render(<XDiv data-testid="element" class:test={true} />);
    expect(screen.getByTestId('element')).toHaveClass('test');
  });

  it('should return same component for same tag name (caching)', () => {
    const proxy = createTagNameProxy(forwardX);

    const XDiv1 = proxy.div;
    const XDiv2 = proxy.div;

    expect(XDiv1).toBe(XDiv2);
  });

  it('should handle different tag names', () => {
    const proxy = createTagNameProxy(forwardX);

    render(
      <>
        <proxy.div data-testid="div" class:div-class={true} />
        <proxy.span data-testid="span" class:span-class={true} />
        <proxy.section data-testid="section" class:section-class={true} />
      </>,
    );

    expect(screen.getByTestId('div')).toHaveClass('div-class');
    expect(screen.getByTestId('span')).toHaveClass('span-class');
    expect(screen.getByTestId('section')).toHaveClass('section-class');
  });

  it('should convert tag names to lowercase', () => {
    const proxy = createTagNameProxy(forwardX);

    const XDiv = proxy.DIV!;

    render(<XDiv data-testid="element" />);
    expect(screen.getByTestId('element').tagName).toBe('DIV');
  });

  it('should set displayName for debugging', () => {
    const proxy = createTagNameProxy(forwardX);

    const XButton = proxy.button;

    expect(XButton.displayName).toBe('x.button');
  });

  it('should pass through existing properties on source', () => {
    const source = Object.assign(forwardX, { customProp: 'value' });
    const proxy = createTagNameProxy(source);

    expect(proxy.customProp).toBe('value');
  });

  it('should return undefined for symbol properties', () => {
    const proxy = createTagNameProxy(forwardX);

    const sym = Symbol('test');
    expect((proxy as any)[sym]).toBeUndefined();
  });

  it('should work with SVG elements', () => {
    const proxy = createTagNameProxy(forwardX);

    render(
      <proxy.svg data-testid="svg" class:icon={true}>
        <proxy.path data-testid="path" class:path-class={true} d="M0 0" />
        <proxy.circle data-testid="circle" cx="10" cy="10" r="5" />
      </proxy.svg>,
    );

    expect(screen.getByTestId('svg')).toHaveClass('icon');
    expect(screen.getByTestId('path')).toHaveClass('path-class');
    expect(screen.getByTestId('circle')).toBeInTheDocument();
  });

  it('should support all extended props on generated components', () => {
    const proxy = createTagNameProxy(forwardX);

    render(
      <proxy.article
        data-testid="element"
        className="base"
        classList={['list-item']}
        class:active={true}
        style:padding="20px"
        var:accentColor="blue"
      >
        Content
      </proxy.article>,
    );

    const element = screen.getByTestId('element');

    expect(element).toHaveClass('base');
    expect(element).toHaveClass('list-item');
    expect(element).toHaveClass('active');
    expect(element).toHaveStyle({ padding: '20px' });
    expect(element.style.getPropertyValue('--accentColor')).toBe('blue');
    expect(element).toHaveTextContent('Content');
  });

  it('should support string value as class alias (CSS Modules)', () => {
    const proxy = createTagNameProxy(forwardX);

    render(
      <proxy.button
        data-testid="element"
        class:base="Button_button__abc123"
        class:variant="Button_primary__def456"
      >
        Click
      </proxy.button>,
    );

    const element = screen.getByTestId('element');
    expect(element).toHaveClass('Button_button__abc123');
    expect(element).toHaveClass('Button_primary__def456');
  });
});
