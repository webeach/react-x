import { ElementType, forwardRef } from 'react';

import { forwardX } from '../forwardX';

import { TagNameComponentMap } from './types';

export function createTagNameProxy<
  Source extends object & Record<string | symbol, any>,
>(source: Source) {
  const cache = new Map<string, ElementType>();

  return new Proxy(source, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }

      if (typeof prop !== 'string') {
        return undefined;
      }

      const tagName = prop.toLowerCase();

      if (cache.has(tagName)) {
        return cache.get(tagName);
      }

      const Component = forwardX(
        forwardRef((props, ref) => {
          const TagName = tagName as ElementType;
          return <TagName ref={ref} {...props} />;
        }),
      );

      Object.defineProperty(Component, 'displayName', {
        get: () => `x.${tagName}`,
      });

      cache.set(tagName, Component);

      return Component;
    },
  }) as Source & TagNameComponentMap;
}
