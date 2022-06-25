import EventEmitter from 'events';
import { readFileSync, writeFileSync } from 'fs';
import { Worker } from 'worker_threads';
import { ThreadParentMessageStream } from './ThreadParentMessageStream';
import { ThreadMessageStream } from './ThreadMessageStream';

const DIST_TEST_PATH = `${__dirname}/../../dist-test`;

class MockThread extends EventEmitter {
  postMessage(..._args: any[]): void {
    return undefined;
  }
}

describe('Node Thread Streams', () => {
  it('can communicate with a thread and be destroyed', async () => {
    const dist = readFileSync(
      `${DIST_TEST_PATH}/ThreadMessageStream.js`,
      'utf8',
    );

    // Create a stream that multiplies incoming data by 5 and returns it
    const setupThreadStream = `
      const { ThreadMessageStream } = require('./ThreadMessageStream');
      const stream = new ThreadMessageStream();
      stream.on('data', (value) => stream.write(value * 5));
    `;

    const code = `${dist}\n${setupThreadStream}`;

    const tmpFilePath = `${DIST_TEST_PATH}/thread-test.js`;
    writeFileSync(tmpFilePath, code);

    const thread = new Worker(tmpFilePath);

    // Create parent stream
    const parentStream = new ThreadParentMessageStream({ thread });

    // Get a deferred Promise for the eventual result
    const responsePromise = new Promise((resolve) => {
      parentStream.once('data', (num) => {
        resolve(Number(num));
      });
    });

    // The child should ignore this
    thread.postMessage('foo');

    // Send message to child, triggering a response
    parentStream.write(111);

    expect(await responsePromise).toStrictEqual(555);

    // Check that events with falsy data are ignored as expected
    parentStream.once('data', (data) => {
      throw new Error(`Unexpected data on stream: ${data}`);
    });
    thread.postMessage(new Event('message'));

    // Terminate child thread, destroy parent stream, and check that parent
    // was destroyed
    thread.terminate();
    parentStream.destroy();
    expect(parentStream.destroyed).toStrictEqual(true);
  });

  describe('ThreadParentMessageStream', () => {
    it('ignores invalid messages', () => {
      const mockThread: any = new MockThread();
      const stream = new ThreadParentMessageStream({ thread: mockThread });
      const onDataSpy = jest
        .spyOn(stream, '_onData' as any)
        .mockImplementation();

      [null, undefined, 'foo', 42, {}, { data: null }].forEach(
        (invalidMessage) => {
          mockThread.emit('message', invalidMessage);

          expect(onDataSpy).not.toHaveBeenCalled();
        },
      );
    });
  });

  describe('ThreadMessageStream', () => {
    it('throws if not run in a worker thread', () => {
      expect(() => new ThreadMessageStream()).toThrow(
        'Parent port not found. This class should only be instantiated in a Node.js worker thread.',
      );
    });
  });
});
