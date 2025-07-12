declare module 'react';
declare module 'react-native';

declare namespace NodeJS {
  interface Timeout {}
}
declare function setInterval(handler: (...args: any[]) => void, timeout?: number, ...args: any[]): NodeJS.Timeout;
declare function clearInterval(handle?: NodeJS.Timeout): void;
