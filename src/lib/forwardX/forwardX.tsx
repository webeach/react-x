import {
  ComponentType,
  CSSProperties,
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  JSX,
  LegacyRef,
} from 'react';

import { XBaseVarMap, XProps } from '../../types/common';

import {
  PROP_CLASS_PREFIX,
  PROP_STYLE_PREFIX,
  PROP_VAR_PREFIX,
} from './constants';

export function forwardX<
  ComponentProps,
  AllowedVars extends XBaseVarMap | string = string,
  ElementType = unknown,
>(Component: ComponentType<ComponentProps>) {
  function XComponent(
    props: ComponentProps & XProps<AllowedVars>,
    ref: ForwardedRef<unknown>,
  ) {
    const finalClassList: string[] = props.className ? [props.className] : [];
    const finalProps: any = {};
    const finalStyle: any = {};

    if (Array.isArray(props.classList)) {
      finalClassList.push(...props.classList.filter(Boolean));
    }

    const entries = Object.entries(props);

    entries.forEach(([propKey, propValue]) => {
      if (propKey.startsWith(PROP_CLASS_PREFIX)) {
        const className = propKey.substring(PROP_CLASS_PREFIX.length);

        if (
          propValue !== null &&
          propValue !== undefined &&
          propValue !== false
        ) {
          finalClassList.push(
            propValue === true ? className : String(propValue),
          );
        }

        return;
      }

      if (propKey.startsWith(PROP_STYLE_PREFIX)) {
        const styleProp = propKey.substring(
          PROP_STYLE_PREFIX.length,
        ) as keyof CSSProperties;

        finalStyle[styleProp] = propValue;

        return;
      }

      if (propKey.startsWith(PROP_VAR_PREFIX)) {
        const styleProp = propKey.substring(PROP_VAR_PREFIX.length);

        finalStyle[`--${styleProp}`] = propValue;

        return;
      }

      finalProps[propKey] = propValue;
    });

    finalProps.className =
      finalClassList.length > 0 ? finalClassList.join(' ') : undefined;
    finalProps.style = Object.assign(finalStyle, finalProps.style);

    delete finalProps.classList;

    return <Component {...finalProps} ref={ref} />;
  }

  return forwardRef(XComponent as ForwardRefRenderFunction<ElementType>) as (
    props: ComponentProps &
      XProps<AllowedVars> & {
        ref?: LegacyRef<ElementType>;
      },
  ) => JSX.Element;
}
