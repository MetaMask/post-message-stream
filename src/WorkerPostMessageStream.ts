import { BasePostMessageStream } from './BasePostMessageStream';
import { DEDICATED_WORKER_NAME } from './enums';

/**
 * Worker-side Dedicated Worker postMessage stream.
 */
export class WorkerPostMessageStream extends BasePostMessageStream {
  private _name: string;

  constructor () {
    super();
    this._name = DEDICATED_WORKER_NAME;
    self.onmessage = this._onMessage.bind(this);
    this._handshake();
  }

  // private

  _onMessage (event: MessageEvent) {
    const message = event.data;

    // validate message
    if (
      (typeof message !== 'object') ||
      (message.target !== this._name) ||
      (!message.data)
    ) {
      return;
    }

    this._onData(message.data);
  }

  _postMessage (data: any) {
    // typescript thinks you need to provide a second arg but thats wrong and breaks in electron workers if you do that
    // you can provide `undefined`, but typescript doesnt like that either
    // https://github.com/Microsoft/TypeScript/issues/20595#issuecomment-587297818
    (self as unknown as Worker).postMessage({ data });
  }

  // worker stream lifecycle assumed to be coterminous with global scope
  _destroy () {
    return undefined;
  }
}
