import { ChildProcess } from 'child_process';
import { BasePostMessageStream } from '../BasePostMessageStream';
import { isValidStreamMessage, StreamData } from '../utils';

interface ParentProcessMessageStreamArgs {
  process: ChildProcess;
}

export class ParentProcessMessageStream extends BasePostMessageStream {
  private _process: ChildProcess;

  constructor({ process }: ParentProcessMessageStreamArgs) {
    super();

    this._process = process;
    this._onMessage = this._onMessage.bind(this);
    this._process.on('message', this._onMessage);

    this._handshake();
  }

  protected _postMessage(data: StreamData): void {
    this._process.send({ data });
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
