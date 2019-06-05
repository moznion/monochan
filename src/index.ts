class InternalHandler<T> {
  private _resolve: (value?: T | PromiseLike<T>) => void;
  // tslint:disable-next-line
  private _reject: (reason?: any) => void;

  constructor() {
    this._resolve = () => {};
    this._reject = () => {};
  }

  // tslint:disable-next-line
  init(resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) {
    this._resolve = resolve;
    this._reject = reject;
  }

  resolve(payload?: T): void {
    this._resolve(payload);
  }

  // tslint:disable-next-line
  reject(err?: any): void {
    this._reject(err);
  }
}

export class Monochan<T> {
  // @ts-ignore
  private promise: Promise<T>;
  // @ts-ignore
  private handler: InternalHandler<T>;

  constructor() {
    this.init();
  }

  private init() {
    this.handler = new InternalHandler<T>();
    this.promise = new Promise<T>((resolve, reject) => {
      this.handler.init(resolve, reject);
    });
  }

  async wait(): Promise<T> {
    return this.promise;
  }

  send(payload?: T): void {
    this.handler.resolve(payload);
    this.init();
  }

  // tslint:disable-next-line
  raise(err?: any): void {
    this.handler.reject(err);
    this.init();
  }
}
