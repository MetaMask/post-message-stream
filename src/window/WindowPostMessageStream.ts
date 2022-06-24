import {
  BasePostMessageStream,
  PostMessageEvent,
} from '../BasePostMessageStream';
import { isValidStreamMessage } from '../utils';

interface WindowPostMessageStreamArgs {
  name: string;
  target: string;
  targetWindow?: Window;
  targetOrigin?: string;
}

/**
 * Window.postMessage stream.
 */
export class WindowPostMessageStream extends BasePostMessageStream {
  private _name: string;

  private _target: string;

  private _targetOrigin: string;

  private _targetWindow: Window;

  /**
   * Creates a stream for communicating with other streams across the same or
   * different window objects.
   *
   * @param args - Options bag.
   * @param args.name - The name of the stream. Used to differentiate between
   * multiple streams sharing the same window object.
   * @param args.target - The name of the stream to exchange messages with.
   * @param args.targetWindow - The window object of the target stream. Defaults
   * to `window`.
   * @param args.targetOrigin - The target origin for the iframe. Defaults to location.origin, allows '*' to be passed.
   */
  constructor({
    name,
    target,
    targetWindow = window,
    targetOrigin = location.origin,
  }: WindowPostMessageStreamArgs) {
    if (!name || !target) {
      throw new Error('Invalid input.');
    }
    super();

    this._name = name;
    this._target = target;
    this._targetOrigin = targetOrigin;
    this._targetWindow = targetWindow;
    this._onMessage = this._onMessage.bind(this);

    window.addEventListener('message', this._onMessage as any, false);

    this._handshake();
  }

  protected _postMessage(data: unknown): void {
    this._targetWindow.postMessage(
      {
        target: this._target,
        data,
      },
      this._targetOrigin,
    );
  }

  private _onMessage(event: PostMessageEvent): void {
    const message = event.data;

    // validate message
    if (
      (this._targetOrigin !== '*' && event.origin !== this._targetOrigin) ||
      event.source !== this._targetWindow ||
      !isValidStreamMessage(message) ||
      message.target !== this._name
    ) {
      return;
    }

    this._onData(message.data);
  }

  _destroy(): void {
    window.removeEventListener('message', this._onMessage as any, false);
  }
}
