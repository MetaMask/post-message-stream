import { parentPort } from 'worker_threads';
import { BasePostMessageStream } from '../BasePostMessageStream';
import { isValidStreamMessage, StreamData } from '../utils';

/**
 * Child thread-side Node.js `worker_threads` stream.
 */
export class ThreadMessageStream extends BasePostMessageStream {
  #parentPort: Exclude<typeof parentPort, null>;

  constructor() {
    super();

    if (!parentPort) {
      throw new Error(
        'Parent port not found. This class should only be instantiated in a Node.js worker thread.',
      );
    }

    this.#parentPort = parentPort;

    this._onMessage = this._onMessage.bind(this);
    this.#parentPort.on('message', this._onMessage);

    this._handshake();
  }

  protected _postMessage(data: StreamData): void {
    this.#parentPort.postMessage({ data });
  }

  private _onMessage(message: unknown): void {
    if (!isValidStreamMessage(message)) {
      return;
    }

    this._onData(message.data);
  }

  _destroy(): void {
    this.#parentPort.removeListener('message', this._onMessage);
  }
}
