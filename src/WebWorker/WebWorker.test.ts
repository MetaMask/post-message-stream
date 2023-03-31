import { readFileSync } from 'fs';
import { DEDICATED_WORKER_NAME } from '../utils';
import { WebWorkerParentPostMessageStream } from './WebWorkerParentPostMessageStream';
import { WebWorkerPostMessageStream } from './WebWorkerPostMessageStream';

const DIST_TEST_PATH = `${__dirname}/../../dist-test`;

describe('WebWorker Streams', () => {
  it('can communicate with a worker and be destroyed', async () => {
    const workerPostMessageStreamDist = readFileSync(
      `${DIST_TEST_PATH}/WebWorkerPostMessageStream.js`,
      'utf8',
    );

    // Create a stream that multiplies incoming data by 5 and returns it
    const setupWorkerStream = `
        const stream = new self.PostMessageStream.WebWorkerPostMessageStream();
        stream.on('data', (value) => stream.write(value * 5));
      `;

    const code = `${workerPostMessageStreamDist}\n${setupWorkerStream}`;
    const worker = new Worker(URL.createObjectURL(new Blob([code])));

    // Create parent stream
    const parentStream = new WebWorkerParentPostMessageStream({ worker });

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

  describe('WebWorkerPostMessageStream', () => {
    class WorkerGlobalScope {
      postMessage = jest.fn();

      onmessage = undefined;
    }

    const originalSelf: any = self;

    beforeEach(() => {
      (globalThis as any).WorkerGlobalScope = WorkerGlobalScope;
      (globalThis as any).self = new WorkerGlobalScope();
    });

    afterEach(() => {
      delete (globalThis as any).WorkerGlobalScope;
      (globalThis as any).self = originalSelf;
    });

    it('throws if not run in a WebWorker (self undefined)', () => {
      (globalThis as any).self = undefined;
      expect(() => new WebWorkerPostMessageStream()).toThrow(
        'WorkerGlobalScope not found. This class should only be instantiated in a WebWorker.',
      );
    });

    it('throws if not run in a WebWorker (WorkerGlobalScope undefined)', () => {
      (globalThis as any).WorkerGlobalScope = undefined;
      expect(() => new WebWorkerPostMessageStream()).toThrow(
        'WorkerGlobalScope not found. This class should only be instantiated in a WebWorker.',
      );
    });

    it('can be destroyed', () => {
      (globalThis as any).self = originalSelf;
      const stream = new WebWorkerPostMessageStream();
      expect(stream.destroy()).toBeUndefined();
    });

    it('forwards valid messages', () => {
      (globalThis as any).self = originalSelf;
      const addEventListenerSpy = jest.spyOn(globalThis, 'addEventListener');
      const stream = new WebWorkerPostMessageStream();

      const onDataSpy = jest
        .spyOn(stream, '_onData' as any)
        .mockImplementation();

      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
      const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      listener(
        new MessageEvent('foo', {
          data: { data: 'bar', target: DEDICATED_WORKER_NAME },
        }),
      );

      expect(onDataSpy).toHaveBeenCalledTimes(1);
      expect(onDataSpy).toHaveBeenCalledWith('bar');
    });

    it('ignores invalid messages', () => {
      (globalThis as any).self = originalSelf;
      const addEventListenerSpy = jest.spyOn(globalThis, 'addEventListener');
      const stream = new WebWorkerPostMessageStream();

      const onDataSpy = jest
        .spyOn(stream, '_onData' as any)
        .mockImplementation();

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;

      (
        [
          { data: 'bar' },
          { data: { data: 'bar', target: 'foo' } },
          { data: { data: null, target: 'foo' } },
        ] as const
      ).forEach((invalidMessage) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        listener(new MessageEvent<unknown>('foo', invalidMessage));

        expect(onDataSpy).not.toHaveBeenCalled();
      });
    });
  });
});
