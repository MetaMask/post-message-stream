import {
  BasePostMessageStream,
  PostMessageEvent,
} from '../BasePostMessageStream';
import { isValidStreamMessage, noop } from '../utils';

interface RuntimePostMessageStreamArgs {
  name: string;
  target: string;
}

/**
 * A {@link chrome.runtime} stream.
 */
export class RuntimePostMessageStream extends BasePostMessageStream {
  #name: string;

  #target: string;

  /**
   * Creates a stream for communicating with other streams across the extension
   * runtime.
   *
   * @param args - Options bag.
   * @param args.name - The name of the stream. Used to differentiate between
   * multiple streams sharing the same runtime.
   * @param args.target - The name of the stream to exchange messages with.
   */
  constructor({ name, target }: RuntimePostMessageStreamArgs) {
    super();

    if (
      typeof chrome === 'undefined' ||
      typeof chrome.runtime?.sendMessage !== 'function'
    ) {
      throw new Error(
        'chrome.runtime.sendMessage is not a function. This class should only be instantiated in a web extension.',
      );
    }

    this.#name = name;
    this.#target = target;
    this._onMessage = this._onMessage.bind(this);

    chrome.runtime.onMessage.addListener(this._onMessage);

    this._handshake();
  }

  protected _postMessage(data: unknown): void {
    chrome.runtime.sendMessage(
      {
        target: this.#target,
        data,
      },
      {},
      // `runtime.sendMessage` assumes a response is sent directly from the
      // target, but we don't need a response here. Not providing a callback
      // would cause the function to return a promise, which we don't want.
      noop,
    );
  }

  private _onMessage(message: PostMessageEvent): void {
    if (!isValidStreamMessage(message) || message.target !== this.#name) {
      return;
    }

    this._onData(message.data);
  }

  _destroy(): void {
    chrome.runtime.onMessage.removeListener(this._onMessage);
  }
}
