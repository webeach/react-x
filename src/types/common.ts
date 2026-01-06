import { CSSProperties } from 'react';

export type XBaseVarMap = Record<string, string | number | null>;

export type XClassProps = {
  [key: `class:${string}`]: boolean | string | null | undefined;
};

export type XProps<AllowedVars extends XBaseVarMap | string = string> =
  XClassProps &
    XStyleProps &
    XVarProps<AllowedVars> & {
      className?: string;
      classList?: Array<string> | ReadonlyArray<string>;
      style?: CSSProperties;
    };

export type XStyleProps = {
  [StyleKey in keyof CSSProperties as `style:${StyleKey}`]?: CSSProperties[StyleKey];
};

export type XVarProps<AllowedVars extends XBaseVarMap | string = string> =
  AllowedVars extends string
    ? {
        [VarKey in AllowedVars as `var:${VarKey}`]: string | number | null;
      }
    : {
        [VarKey in keyof AllowedVars as `var:${VarKey & string}`]?: AllowedVars[VarKey];
      };
