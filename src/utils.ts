import util from 'util';

export function logAll(object: any) {
  console.log(util.inspect(object, { showHidden: false, depth: null, colors: true }));
}

export function wait(seconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));
}

export function some<T>(promises: Promise<T>[]): Promise<void> {
  return new Promise<void>((res) => {
    promises.forEach((promise) => promise.then(() => res()));
  });
}
