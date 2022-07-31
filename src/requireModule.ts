export function requireModule(moduleName: string) {
  if (typeof window !== 'undefined') {
    if (window.require) {
      return window.require(moduleName);
    }
  }

  if (typeof Package !== 'undefined') {
    if (Package['modules'] && Package['modules'].meteorInstall) {
      return Package['modules'].meteorInstall({})(moduleName);
    }
  }
}
