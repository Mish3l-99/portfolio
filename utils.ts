// utils.ts
// Utility functions for the project

/**
 * Combines class names conditionally.
 * Usage: cn('foo', condition && 'bar', ['baz', anotherCondition && 'qux'])
 */

interface ClassDictionary {
  [key: string]: boolean | undefined | null;
}
type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassDictionary
  | ClassValue[];

export function cn(...args: ClassValue[]): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) return;
    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      classes.push(cn(...arg));
    } else if (typeof arg === "object") {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
    }
  });

  return classes.join(" ");
}
