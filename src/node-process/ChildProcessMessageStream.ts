import { BasePostMessageStream } from '../BasePostMessageStream';
import { isValidStreamMessage, StreamData } from '../utils';

export class ChildProcessMessageStream extends BasePostMessageStream {
  constructor() {
    super();

    this._onMessage = this._onMessage.bind(this);
    globalThis.process.on('message', this._onMessage);

    this._handshake();
  }

  protected _postMessage(data: StreamData): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    globalThis.process.send!({ data });
  }

  private _onMessage(message: unknown): void {
    if (!isValidStreamMessage(message)) {
      return;
    }

    this._onData(message.data);
  }

  _destroy(): void {
    globalThis.process.removeListener('message', this._onMessage);
  }
}
