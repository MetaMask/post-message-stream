const DuplexStream = require('readable-stream').Duplex
const inherits = require('util').inherits

module.exports = PostMessageStream

inherits(PostMessageStream, DuplexStream)

function PostMessageStream (opts) {
  DuplexStream.call(this, {
    objectMode: true
  })

  this._name = opts.name
  this._target = opts.target
  this._targetWindow = opts.targetWindow || window
  this._origin = (opts.targetWindow ? '*' : window.location.origin)

  // initialization flags
  this._init = false
  this._haveSyn = false

  window.addEventListener('message', this._onMessage.bind(this), false)
  // send syncorization message
  this._write('SYN', null, noop)
  this.cork()
}

// private
PostMessageStream.prototype._onMessage = function (event) {
  var msg = event.data

  // validate message
  if (this._origin !== '*' && event.origin !== this._origin) return
  if (event.source !== this._targetWindow) return
  if (typeof msg !== 'object') return
  if (msg.target !== this._name) return
  if (!msg.data) {
    this.push(null)
    return
  }

  if (!this._init) {
    // listen for handshake
    if (msg.data === 'SYN') {
      this._haveSyn = true
      this._write('ACK', null, noop)
    } else if (msg.data === 'ACK') {
      this._init = true
      if (!this._haveSyn) {
        this._write('ACK', null, noop)
      }
      this.uncork()
    }
  } else {
    // forward message
    try {
      this.push(msg.data)
    } catch (err) {
      this.emit('error', err)
    }
  }
}

// stream plumbing
PostMessageStream.prototype._read = noop

PostMessageStream.prototype._write = function (data, encoding, cb) {
  var message = {
    target: this._target,
    data: data
  }
  this._targetWindow.postMessage(message, this._origin)
  cb()
}

// when a stream is destroyed, send a null message so the other end can end the stream
PostMessageStream.prototype._destroy = function (err, callback) {
  if (err) {
    this.emit('error', err)
  }
  var message = {
    target: this._target,
    data: null
  }
  this._targetWindow.postMessage(message, this._origin)

  callback()
}

// util

function noop () {}
