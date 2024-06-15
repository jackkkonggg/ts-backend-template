export function wait(seconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));
}

export function some<T>(promises: Promise<T>[]): Promise<void> {
  return new Promise<void>((res) => {
    promises.forEach((promise) => promise.then(() => res()));
  });
}
