import { Duplex } from 'readable-stream';

function noop () {
  return undefined;
}

const SYN = 'SYN';
const ACK = 'ACK';

/**
 * Incomplete base implementation for postMessage streams.
 */

export class BasePostMessageStream extends Duplex {
  private _init: boolean;

  private _haveSyn: boolean;

  constructor () {

    super({
      objectMode: true,
    });

    // initialization flags
    this._init = false;
    this._haveSyn = false;
  }

  // private

  /**
   * Must be called at end of child constructor to initiate
   * communication with other end.
   */
  protected _handshake () {
    // send synchronization message
    this._write(SYN, null, noop);
    this.cork();
  }

  _onData (data: string) {
    const needsInitialization = !this._init;
    if (needsInitialization) {
      // listen for handshake
      if (data === SYN) {
        this._haveSyn = true;
        this._write(ACK, null, noop);
      } else if (data === ACK) {
        this._init = true;
        if (!this._haveSyn) {
          this._write(ACK, null, noop);
        }
        this.uncork();
      }
    } else {
      // forward message
      try {
        this.push(data);
      } catch (err) {
        this.emit('error', err);
      }
    }
  }

  /**
   * Child classes must implement this function.
   */
  _postMessage (_data: string) {
    throw new Error('Not implemented.');
  }

  // stream plumbing

  _read () {
    return undefined;
  }

  _write (data: string, _encoding: any, cb: () => void) {
    this._postMessage(data);
    cb();
  }
}
