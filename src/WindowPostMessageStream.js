const BasePostMessageStream = require('./BasePostMessageStream')

/**
 * Window.postMessage stream.
 */
module.exports = class WindowPostMessageStream extends BasePostMessageStream {

  constructor ({
    name,
    target,
    targetWindow,
  } = {}) {

    super()

    this._name = name
    this._target = target
    this._targetWindow = targetWindow || window
    this._origin = (targetWindow ? '*' : location.origin)
    this._onMessage = this._onMessage.bind(this)

    window.addEventListener('message', this._onMessage, false)

    this._handshake()
  }

  // private

  _onMessage (event) {
    const message = event.data

    // validate message
    if (
      (this._origin !== '*' && event.origin !== this._origin) ||
      (event.source !== this._targetWindow) ||
      (typeof message !== 'object') ||
      (message.target !== this._name) ||
      (!message.data)
    ) {
      return
    }

    this._onData(message.data)
  }

  _postMessage (data) {
    this._targetWindow.postMessage({
      target: this._target,
      data,
    }, this._origin)
  }

  _destroy () {
    window.removeEventListener('message', this._onMessage, false)
  }
}
