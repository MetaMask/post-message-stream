import browser from 'webextension-polyfill';
import {
  BasePostMessageStream,
  PostMessageEvent,
} from '../BasePostMessageStream';
import { isValidStreamMessage } from '../utils';

interface BrowserRuntimePostMessageStreamArgs {
  name: string;
  target: string;
}

/**
 * A {@link browser.runtime} stream.
 */
export class BrowserRuntimePostMessageStream extends BasePostMessageStream {
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
  constructor({ name, target }: BrowserRuntimePostMessageStreamArgs) {
    super();

    if (
      typeof browser === 'undefined' ||
      typeof browser.runtime?.sendMessage !== 'function'
    ) {
      throw new Error(
        'browser.runtime.sendMessage is not a function. This class should only be instantiated in a web extension.',
      );
    }

    this.#name = name;
    this.#target = target;
    this._onMessage = this._onMessage.bind(this);

    browser.runtime.onMessage.addListener(this._onMessage);

    this._handshake();
  }

  protected _postMessage(data: unknown): void {
    // This returns a Promise, which resolves if the receiver responds to the
    // message. Rather than responding to specific messages, we send new
    // messages in response to incoming messages, so we don't care about the
    // Promise.
    browser.runtime.sendMessage({
      target: this.#target,
      data,
    });
  }

  private _onMessage(message: PostMessageEvent): void {
    if (!isValidStreamMessage(message) || message.target !== this.#name) {
      return;
    }

    this._onData(message.data);
  }

  _destroy(): void {
    browser.runtime.onMessage.removeListener(this._onMessage);
  }
}
