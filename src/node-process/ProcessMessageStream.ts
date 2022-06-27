import { BasePostMessageStream } from '../BasePostMessageStream';
import { isValidStreamMessage, StreamData } from '../utils';

/**
 * Child process-side Node.js `child_process` stream.
 */
export class ProcessMessageStream extends BasePostMessageStream {
  constructor() {
    super();

    if (typeof globalThis.process.send !== 'function') {
      throw new Error(
        'Parent IPC channel not found. This class should only be instantiated in a Node.js child process.',
      );
    }

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
