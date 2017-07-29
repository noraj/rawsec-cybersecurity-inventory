/**
 * Export window or global object depending on the environment
 */
export const root = (typeof self === 'object' && self.self === self && self) ||
    (typeof global === 'object' && global.global === global && global) ||
    this;
