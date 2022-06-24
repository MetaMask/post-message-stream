import { Worker } from 'worker_threads';
import { BasePostMessageStream } from '../BasePostMessageStream';
import { isValidStreamMessage, StreamData } from '../utils';

interface ParentThreadMessageStreamArgs {
  process: Worker;
}

export class ParentThreadMessageStream extends BasePostMessageStream {
  private _process: Worker;

  constructor({ process }: ParentThreadMessageStreamArgs) {
    super();

    this._process = process;
    this._onMessage = this._onMessage.bind(this);
    this._process.on('message', this._onMessage);

    this._handshake();
  }

  protected _postMessage(data: StreamData): void {
    this._process.postMessage({ data });
  }

  private _onMessage(message: unknown): void {
    if (!isValidStreamMessage(message)) {
      return;
    }

    this._onData(message.data);
  }

  _destroy(): void {
    this._process.removeListener('message', this._onMessage);
  }
}
