# Changelog

**0.0.9**

- Add options `eval` and `require` for import

**0.0.8**

- Breaking change: when import a module, try to require installed module and if it doesn't exist, load it
- Add option `disableCache`

**0.0.7**

- Server side modules now support `url` too. Thanks to `meteor/fetch`.

**0.0.6**

- Supports Server Side. Works only for modules with source.
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
