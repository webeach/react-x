import { ComponentType, RefObject } from 'react';

import { XBaseVarMap, XProps } from '../../types/common';
import { TagNameComponentMap } from '../createTagNameProxy';

export type X = {
  <
    ComponentProps,
    AllowedVars extends XBaseVarMap | string = string,
    ElementType = unknown,
  >(
    Component: ComponentType<ComponentProps>,
  ): ComponentType<
    ComponentProps &
      XProps<AllowedVars> & {
        ref?: RefObject<ElementType | undefined>;
      }
  >;
} & TagNameComponentMap;
