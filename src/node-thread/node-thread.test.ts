import EventEmitter from 'events';
import { readFileSync, writeFileSync } from 'fs';
import { Worker } from 'worker_threads';
import { ParentThreadMessageStream } from './ParentThreadMessageStream';

const DIST_TEST_PATH = `${__dirname}/../../dist-test`;

class MockProcess extends EventEmitter {
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
    const setupProcessStream = `
      const { ThreadMessageStream } = require('./ThreadMessageStream');
      const stream = new ThreadMessageStream();
      stream.on('data', (value) => stream.write(value * 5));
    `;

    const code = `${dist}\n${setupProcessStream}`;

    const tmpFilePath = `${DIST_TEST_PATH}/thread-test.js`;
    writeFileSync(tmpFilePath, code);

    const process = new Worker(tmpFilePath);

    // Create parent stream
    const parentStream = new ParentThreadMessageStream({ process });

    // Get a deferred Promise for the eventual result
    const responsePromise = new Promise((resolve) => {
      parentStream.once('data', (num) => {
        resolve(Number(num));
      });
    });

    // The child should ignore this
    process.postMessage('foo');

    // Send message to child, triggering a response
    parentStream.write(111);

    expect(await responsePromise).toStrictEqual(555);

    // Check that events with falsy data are ignored as expected
    parentStream.once('data', (data) => {
      throw new Error(`Unexpected data on stream: ${data}`);
    });
    process.postMessage(new Event('message'));

    // Terminate child process, destroy parent stream, and check that parent
    // was destroyed
    process.terminate();
    parentStream.destroy();
    expect(parentStream.destroyed).toStrictEqual(true);
  });

  describe('ParentThreadMessageStream', () => {
    it('ignores invalid messages', () => {
      const mockProcess: any = new MockProcess();
      const stream = new ParentThreadMessageStream({ process: mockProcess });
      const onDataSpy = jest
        .spyOn(stream, '_onData' as any)
        .mockImplementation();

      [null, undefined, 'foo', 42, {}, { data: null }].forEach(
        (invalidMessage) => {
          mockProcess.emit('message', invalidMessage);

          expect(onDataSpy).not.toHaveBeenCalled();
        },
      );
    });
  });
});
