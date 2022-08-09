# Changelog

**0.0.6**

- Supports Server Side
- Changes: `LiveModules.subscribe` returns `undefined` (return type `void`)

**0.0.5**

- New: `LiveModules.require(tagOrName:string)`;
- Changed: `LiveModules.importModule(): Promise<any>` now returns the module if it marks as required.

**0.0.4**

- New option `subOnStartup` to enable/disable subscribe on startup;
- New option `jsMarker` to change the marker for js content.

**0.0.3**

- CSS supports;
- import by name.
