import { readFileSync } from 'fs';
import * as PostMessageStream from '.';

const {
  WindowPostMessageStream,
  WorkerPostMessageStream,
  WorkerParentPostMessageStream,
} = PostMessageStream;

describe('post-message-stream', () => {
  describe('exports', () => {
    const expectedExports = [
      'WindowPostMessageStream',
      'WorkerPostMessageStream',
      'WorkerParentPostMessageStream',
    ];

    it('package has expected exports', () => {
      expect(Object.keys(PostMessageStream)).toHaveLength(
        expectedExports.length,
      );
      for (const exportName of expectedExports) {
        expect(exportName in PostMessageStream).toStrictEqual(true);
      }
    });
  });

  describe('Worker', () => {
    it('throws on invalid input', () => {
      expect(
        () => new (WorkerParentPostMessageStream as any)({ worker: null }),
      ).toThrow('Invalid input.');
    });

    it('can communicate with a worker and be destroyed', async () => {
      const workerPostMessageStreamDist = readFileSync(
        `${__dirname}/../dist-test/WorkerPostMessageStream.js`,
        'utf8',
      );

      // Create a stream that multiplies incoming data by 5 and returns it
      const setupWorkerStream = `
        const stream = new self.PostMessageStream.WorkerPostMessageStream();
        stream.on('data', (value) => stream.write(value * 5));
      `;

      const code = `${workerPostMessageStreamDist}\n${setupWorkerStream}`;
      const worker = new Worker(URL.createObjectURL(new Blob([code])));

      // Create parent stream
      const parentStream = new WorkerParentPostMessageStream({ worker });

      // Get a deferred Promise for the eventual result
      const responsePromise = new Promise((resolve) => {
        parentStream.once('data', (num) => {
          resolve(Number(num));
        });
      });

      // The worker should ignore this
      worker.postMessage('foo');

      // Send message to worker, triggering a response
      parentStream.write(111);

      expect(await responsePromise).toStrictEqual(555);

      // Check that events with falsy data are ignored as expected
      parentStream.once('data', (data) => {
        throw new Error(`Unexpected data on stream: ${data}`);
      });
      worker.dispatchEvent(new Event('message'));

      // Terminate worker, destroy parent, and check that parent was destroyed
      worker.terminate();
      parentStream.destroy();
      expect(parentStream.destroyed).toStrictEqual(true);
    });

    // Just for index.ts function coverage
    it('can initialize a WorkerPostMessageStream', () => {
      expect(Boolean(new WorkerPostMessageStream())).toStrictEqual(true);
    });
  });

  describe('Window', () => {
    it('throws on invalid input', () => {
      expect(
        () =>
          new (WindowPostMessageStream as any)({
            name: null,
            target: 'target',
          }),
      ).toThrow('Invalid input.');
      expect(
        () =>
          new (WindowPostMessageStream as any)({ name: 'name', target: null }),
      ).toThrow('Invalid input.');
    });

    it('can communicate between windows and be destroyed', async () => {
      // Initialize sender stream
      const streamA = new WindowPostMessageStream({
        name: 'a',
        target: 'b',
      });

      // Prevent stream A from receiving stream B's synchronization message, to
      // force execution down a particular path for coverage purposes.
      const originalStreamAListener = (streamA as any)._onMessage;
      const streamAListener = (event: MessageEvent) => {
        if (event.data.data === 'SYN') {
          return undefined;
        }
        return originalStreamAListener(event);
      };
      window.removeEventListener('message', originalStreamAListener, false);
      window.addEventListener('message', streamAListener, false);

      // Initialize receiver stream. Multiplies incoming values by 5 and
      // returns them.
      const streamB = new WindowPostMessageStream({
        name: 'b',
        target: 'a',
        // This shouldn't make a difference, it's just for coverage purposes
        targetWindow: window,
      });
      streamB.on('data', (value) => streamB.write(value * 5));

      // Get a deferred Promise for the result
      const responsePromise = new Promise((resolve) => {
        streamA.once('data', (num) => {
          resolve(Number(num));
        });
      });

      // Write to stream A, triggering a response from stream B
      streamA.write(111);

      expect(await responsePromise).toStrictEqual(555);

      // Check that events without e.g. the correct event.source are ignored as
      // expected
      const throwingListener = (data: any) => {
        throw new Error(`Unexpected data on stream: ${data}`);
      };
      streamA.once('data', throwingListener);
      streamB.once('data', throwingListener);
      window.dispatchEvent(new Event('message'));

      // Destroy streams and confirm that they were destroyed
      streamA.destroy();
      streamB.destroy();
      expect(streamA.destroyed).toStrictEqual(true);
      expect(streamB.destroyed).toStrictEqual(true);
    });

    it('can take targetOrigin as an option', () => {
      const stream = new (WindowPostMessageStream as any)({
        name: 'foo',
        target: 'target',
        targetOrigin: '*',
      });
      expect(stream._targetOrigin).toStrictEqual('*');
    });
  });

  // For line coverage in BasePostMessageStream
  describe('Base', () => {
    it('handles errors thrown when pushing data', async () => {
      const stream = new WindowPostMessageStream({
        name: 'name',
        target: 'target',
      });

      await new Promise<void>((resolve) => {
        stream.push = () => {
          throw new Error('push error');
        };

        stream.once('error', (error) => {
          expect(error.message).toStrictEqual('push error');
          resolve();
        });

        (stream as any)._init = true;
        (stream as any)._onData({});
      });
    });
  });
});
