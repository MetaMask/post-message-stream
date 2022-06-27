import type { ChildProcess } from 'child_process';
import { BasePostMessageStream } from '../BasePostMessageStream';
import { isValidStreamMessage, StreamData } from '../utils';

interface ProcessParentMessageStreamArgs {
  process: ChildProcess;
}

/**
 * Parent-side Node.js `child_process` stream.
 */
export class ProcessParentMessageStream extends BasePostMessageStream {
  private _process: ChildProcess;

  /**
   * Creates a stream for communicating with a Node.js `child_process` process.
   *
   * @param args - Options bag.
   * @param args.process - The process to communicate with.
   */
  constructor({ process }: ProcessParentMessageStreamArgs) {
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
