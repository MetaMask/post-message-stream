import {
  BasePostMessageStream,
  PostMessageEvent,
  StreamData,
} from './BasePostMessageStream';

interface WindowPostMessageStreamArgs {
  name: string;
  target: string;
  targetWindow?: Window;
}

/**
 * Window.postMessage stream.
 */
export class WindowPostMessageStream extends BasePostMessageStream {
  private _name: string;

  private _target: string;

  private _targetOrigin: string;

  private _targetWindow: Window;

  constructor({ name, target, targetWindow }: WindowPostMessageStreamArgs) {
    if (!name || !target) {
      throw new Error('Invalid input.');
    }
    super();

    this._name = name;
    this._target = target;
    this._targetOrigin = targetWindow ? '*' : location.origin;
    this._targetWindow = targetWindow || window;
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
      typeof message !== 'object' ||
      message.target !== this._name ||
      !message.data
    ) {
      return;
    }

    this._onData(message.data as StreamData);
  }

  _destroy(): void {
    window.removeEventListener('message', this._onMessage as any, false);
  }
}
