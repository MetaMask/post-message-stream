import { EventEmitter } from 'stream';
import { parentPort } from 'worker_threads';
import { ThreadMessageStream } from './ThreadMessageStream';

// This file is kept separate due to this module mock.
jest.mock('worker_threads', () => ({
  parentPort: {
    on: jest.fn(),
    postMessage: jest.fn(),
    removeListener: jest.fn(),
  },
}));

describe('ThreadMessageStream', () => {
  it('forwards valid messages', () => {
    const emitter = new EventEmitter();
    jest
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .spyOn(parentPort!, 'on')
      .mockImplementation(
        (event, listener) => emitter.on(event, listener) as any,
      );
    const stream = new ThreadMessageStream();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(parentPort!.on).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
    );

    const onDataSpy = jest.spyOn(stream, '_onData' as any).mockImplementation();
    emitter.emit('message', { data: 'bar' });

    expect(onDataSpy).toHaveBeenCalledTimes(1);
    expect(onDataSpy).toHaveBeenCalledWith('bar');
  });

  it('ignores invalid messages', () => {
    const emitter = new EventEmitter();
    jest
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .spyOn(parentPort!, 'on')
      .mockImplementation(
        (event, listener) => emitter.on(event, listener) as any,
      );
    const stream = new ThreadMessageStream();
    const onDataSpy = jest.spyOn(stream, '_onData' as any).mockImplementation();

    [null, undefined, 'foo', 42, {}, { data: null }].forEach(
      (invalidMessage) => {
        emitter.emit('message', invalidMessage);

        expect(onDataSpy).not.toHaveBeenCalled();
      },
    );
  });

  it('can be destroyed', () => {
    const stream = new ThreadMessageStream();
    stream.destroy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(parentPort!.removeListener).toHaveBeenCalled();
  });
});
