export const DATA_ATTRIBUTE_NAME = `data-module`;

export function evaluateAsCSS(css: string, moduleName: string) {
  if (typeof document === 'undefined') return;

  const head = document.getElementsByTagName('head').item(0)!;

  let style;

  if (document.querySelector) {
    style = document.querySelector<HTMLStyleElement>(`style[${DATA_ATTRIBUTE_NAME}="${moduleName}"]`);

    if (style) {
      style.remove();
    }
  }

  style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.setAttribute(DATA_ATTRIBUTE_NAME, moduleName);

  // @ts-ignore
  const internetExplorerSheetObject = style.sheet || style.styleSheet;

  if (internetExplorerSheetObject) {
    internetExplorerSheetObject.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  return head.appendChild(style);
}
