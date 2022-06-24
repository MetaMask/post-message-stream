import { parentPort } from 'worker_threads';
import { BasePostMessageStream } from '../BasePostMessageStream';
import { isValidStreamMessage, StreamData } from '../utils';

export class ThreadMessageStream extends BasePostMessageStream {
  constructor() {
    super();

    this._onMessage = this._onMessage.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parentPort!.on('message', this._onMessage);

    this._handshake();
  }

  protected _postMessage(data: StreamData): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parentPort!.postMessage(data);
  }

  private _onMessage(message: unknown): void {
    if (!isValidStreamMessage(message)) {
      return;
    }

    this._onData(message.data);
  }

  _destroy(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parentPort!.removeListener('message', this._onMessage);
  }
}
