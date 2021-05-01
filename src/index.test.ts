import { readFileSync } from 'fs';
import pathUtils from 'path';
import http from 'http';
import finalHandler from 'finalhandler';
import serveStatic from 'serve-static';
import * as PostMessageStream from '.';

const {
  WindowPostMessageStream,
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

      // create a stream that multiplies incoming data by 5 and returns it
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

      // Send message to worker, triggering a response
      parentStream.write(111);

      expect(await responsePromise).toStrictEqual(555);

      // Check that events with falsy data are ignored as expected.
      parentStream.once('data', (data) => {
        throw new Error(`Unexpected data on stream: ${data}`);
      });
      worker.dispatchEvent(new Event('message'));

      // Terminate worker, destroy parent, and check that parent was destroyed
      worker.terminate();
      parentStream.destroy();
      expect(parentStream.destroyed).toStrictEqual(true);
    });
  });

  describe('Window', () => {
    const PORT = 9031;

    /**
     * Create a server that statically serves the dist-test/ directory on port
     * 9031.
     *
     * Credit: https://stackabuse.com/node-http-servers-for-static-file-serving/
     */
    function createServer() {
      const root = pathUtils.join(__dirname, '../dist-test');
      const serve = serveStatic(root, { cacheControl: false });

      const server = http.createServer((req: any, res: any) => {
        const done = finalHandler(req, res);
        serve(req, res, done as any);
      });

      return server.listen(PORT);
    }

    let server: http.Server;
    beforeAll(() => {
      server = createServer();
    });

    afterAll(() => {
      server.close();
    });

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
      // eslint-disable-next-line prefer-const
      let parentStream: PostMessageStream.WindowPostMessageStream;
      const childWindow = window.open(`http://localhost:${PORT}`) as Window;

      // Instantiate the parent stream. Overwrite its _targetWindow property
      // because Electron's Context Isolation proxies window objects and breaks
      // referential equality.
      // If _targetWindow and event.source aren't referentially equal, the
      // message is discarded.
      const messageListener = (event: any) => {
        (parentStream as any)._targetWindow = event.source;
      };
      window.addEventListener('message', messageListener, false);
      parentStream = new WindowPostMessageStream({
        name: 'parent',
        target: 'child',
        targetWindow: childWindow as any,
      });

      // Get a deferred Promise for the result
      const responsePromise = new Promise((resolve) => {
        parentStream.once('data', (num) => {
          resolve(Number(num));
        });
      });

      // Send message to child window, triggering a response
      parentStream.write(111);

      expect(await responsePromise).toStrictEqual(555);

      // Check that events without e.g. the correct source are ignored as
      // expected.
      parentStream.once('data', (data) => {
        throw new Error(`Unexpected data on stream: ${data}`);
      });
      window.removeEventListener('message', messageListener, false);
      window.dispatchEvent(new Event('message'));

      // Close child window, destroy parent, and check that parent was destroyed
      childWindow.close();
      parentStream.destroy();
      expect(parentStream.destroyed).toStrictEqual(true);
    });
  });

  // For line coverage in BasePostMessageStream
  describe('Base', () => {
    it('handles errors thrown when pushing data', async () => {
      const stream = new WindowPostMessageStream({ name: 'name', target: 'target' })
      await new Promise<void>((resolve) => {
        stream.push = () => { throw new Error('push error') }
        stream.once('error', (error) => {
          expect(error.message).toStrictEqual('push error');
          resolve();
        });
        (stream as any)._init = true;
        (stream as any)._onData({});
      })
    })
  })
});
