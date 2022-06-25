import { BasePostMessageStream } from '../BasePostMessageStream';
import { isValidStreamMessage, StreamData } from '../utils';

/**
 * Child process-side Node.js `child_process` stream.
 */
export class ProcessMessageStream extends BasePostMessageStream {
  #send: Exclude<typeof process['send'], undefined>;

  constructor() {
    super();

    if (typeof globalThis.process.send !== 'function') {
      throw new Error(
        'Parent IPC channel not found. This class should only be instantiated in a Node.js child process.',
      );
    }

    this.#send = globalThis.process.send;
    this._onMessage = this._onMessage.bind(this);
    globalThis.process.on('message', this._onMessage);

    this._handshake();
  }

  protected _postMessage(data: StreamData): void {
    this.#send({ data });
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
