import type { DuplexOptions } from 'readable-stream';
import {
  BasePostMessageStream,
  PostMessageEvent,
} from '../BasePostMessageStream';
import { DEDICATED_WORKER_NAME, isValidStreamMessage } from '../utils';

export interface WorkerParentStreamArgs extends DuplexOptions {
  worker: Worker;
}

/**
 * Parent-side dedicated `WebWorker.postMessage` stream. Designed for use with
 * dedicated workers only.
 */
export class WebWorkerParentPostMessageStream extends BasePostMessageStream {
  private _target: string;

  private _worker: Worker;

  /**
   * Creates a stream for communicating with a dedicated `WebWorker`.
   *
   * @param args - Options bag.
   * @param args.worker - The Web Worker to exchange messages with. The worker
   * must instantiate a `WebWorkerPostMessageStream`.
   */
  constructor({ worker, ...streamOptions }: WorkerParentStreamArgs) {
    super(streamOptions);

    this._target = DEDICATED_WORKER_NAME;
    this._worker = worker;
    this._worker.onmessage = this._onMessage.bind(this) as any;

    this._handshake();
  }

  protected _postMessage(data: unknown): void {
    this._worker.postMessage({
      target: this._target,
      data,
    });
  }

  private _onMessage(event: PostMessageEvent): void {
    const message = event.data;

    if (!isValidStreamMessage(message)) {
      return;
    }

    this._onData(message.data);
  }

  _destroy(): void {
    this._worker.onmessage = null;
    this._worker = null as any;
  }
}
