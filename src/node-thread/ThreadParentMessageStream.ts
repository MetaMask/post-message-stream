import { Worker } from 'worker_threads';
import type { DuplexOptions } from 'readable-stream';
import { BasePostMessageStream } from '../BasePostMessageStream';
import { isValidStreamMessage, StreamData } from '../utils';

export interface ThreadParentMessageStreamArgs extends DuplexOptions {
  thread: Worker;
}

/**
 * Parent-side Node.js `worker_threads` stream.
 */
export class ThreadParentMessageStream extends BasePostMessageStream {
  private _thread: Worker;

  /**
   * Creates a stream for communicating with a Node.js `worker_threads` thread.
   *
   * @param args - Options bag.
   * @param args.thread - The thread to communicate with.
   */
  constructor({ thread, ...streamOptions }: ThreadParentMessageStreamArgs) {
    super(streamOptions);

    this._thread = thread;
    this._onMessage = this._onMessage.bind(this);
    this._thread.on('message', this._onMessage);

    this._handshake();
  }

  protected _postMessage(data: StreamData): void {
    this._thread.postMessage({ data });
  }

  private _onMessage(message: unknown): void {
    if (!isValidStreamMessage(message)) {
      return;
    }

    this._onData(message.data);
  }

  _destroy(): void {
    this._thread.removeListener('message', this._onMessage);
  }
}
