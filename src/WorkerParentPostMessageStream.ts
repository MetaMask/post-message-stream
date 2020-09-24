import { BasePostMessageStream } from './BasePostMessageStream';
import { DEDICATED_WORKER_NAME } from './enums';

/**
 * Parent-side Dedicated Worker postMessage stream.
 */
export class WorkerParentPostMessageStream extends BasePostMessageStream {
  private _target: string;

  private _worker: any;

  constructor (
    {
      worker,
    }: {
      worker: Worker;
    }
  ) {

    super();

    this._target = DEDICATED_WORKER_NAME;
    this._worker = worker;
    this._worker.onmessage = this._onMessage.bind(this);

    this._handshake();
  }

  // private

  _onMessage (event: MessageEvent) {
    const message = event.data;

    // validate message
    if (
      (typeof message !== 'object') ||
      (!message.data)
    ) {
      return;
    }

    this._onData(message.data);
  }

  _postMessage (data: any) {
    this._worker.postMessage({
      target: this._target,
      data,
    });
  }

  _destroy () {
    this._worker.onmessage = null;
    this._worker = null;
  }
}
