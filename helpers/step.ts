import { test } from '@playwright/test';

function humanizeClassName(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function sentenceCase(name: string): string {
  const words = humanizeClassName(name).toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function step(description?: string | ((args: any[]) => string)) {
  return function decorator<This extends object, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    return function replacement(this: This, ...args: Args): Promise<Return> {
      const label =
        typeof description === 'function'
          ? description(args)
          : (description ?? sentenceCase(String(context.name)));
      return test.step(`${humanizeClassName(this.constructor.name)}: ${label}`, () =>
        target.call(this, ...args),
      );
    };
  };
}
