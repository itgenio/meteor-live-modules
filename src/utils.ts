import { LiveModulesConfig } from './config';

export function isJSContent(content: string) {
  return content.startsWith(LiveModulesConfig.jsMarker);
}

export function isJSModule(content: string, url?: string) {
  if (url) {
    const parts = url.split('?');

    if (parts[0].endsWith('.js') || parts[0].endsWith('.cjs')) return true;
  }

  if (content) {
    return isJSContent(content);
  }

  return false;
}

export function isCSSModule(content: string, url?: string) {
  if (url) {
    const parts = url.split('?');

    if (parts[0].endsWith('.css')) return true;
  }

  if (content) {
    return !isJSContent(content);
  }

  return false;
}
