import { BasePostMessageStream } from './BasePostMessageStream';

/**
 * Window.postMessage stream.
 */
export class WindowPostMessageStream extends BasePostMessageStream {
  private _name: string;

  private _target: string;

  private _targetWindow: Window;

  private _origin: string;

  constructor (
    {
      name = '',
      target = 'target',
      targetWindow = self,
    }: {
      name?: string;
      target?: string;
      targetWindow?: Window;
    } = {}
  ) {

    super();

    this._name = name;
    this._target = target;
    this._targetWindow = targetWindow;
    this._origin = '*';
    this._onMessage = this._onMessage.bind(this);

    this._targetWindow.addEventListener('message', this._onMessage, false);

    this._handshake();
  }

  // private

  _onMessage (event: MessageEvent) {
    const message = event.data;

    // validate message
    if (
      (this._origin !== '*' && event.origin !== this._origin) ||
      (event.source !== this._targetWindow) ||
      (typeof message !== 'object') ||
      (message.target !== this._name) ||
      (!message.data)
    ) {
      return;
    }

    this._onData(message.data);
  }

  _postMessage (data: any) {
    this._targetWindow.postMessage({
      target: this._target,
      data,
    }, this._origin);
  }

  _destroy () {
    window.removeEventListener('message', this._onMessage, false);
  }
}
