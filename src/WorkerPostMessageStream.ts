/* istanbul ignore file */
// We ignore coverage for the entire file due to limits on our instrumentation,
// but it is in fact covered by our tests.
import {
  BasePostMessageStream,
  PostMessageEvent,
  StreamData,
} from './BasePostMessageStream';
import { DEDICATED_WORKER_NAME } from './enums';

/**
 * Worker-side dedicated web worker `postMessage` stream.
 */
export class WorkerPostMessageStream extends BasePostMessageStream {
  private _name: string;

  /**
   * Note: Designed for use in web workers only.
   *
   * Creates a stream for communicating with the window that created this web
   * worker.
   */
  constructor() {
    super();

    this._name = DEDICATED_WORKER_NAME;
    self.onmessage = this._onMessage.bind(this) as any;

    this._handshake();
  }

  protected _postMessage(data: StreamData): void {
    // Cast of self.postMessage due to usage of DOM lib
    (self.postMessage as (message: any) => void)({ data });
  }

  private _onMessage(event: PostMessageEvent): void {
    const message = event.data;

    // validate message
    if (
      typeof message !== 'object' ||
      message.target !== this._name ||
      !message.data
    ) {
      return;
    }

    this._onData(message.data as StreamData);
  }

  // worker stream lifecycle assumed to be coterminous with global scope
  _destroy(): void {
    return undefined;
  }
}
