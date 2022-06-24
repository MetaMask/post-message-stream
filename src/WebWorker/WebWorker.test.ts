import { readFileSync } from 'fs';
import { DEDICATED_WORKER_NAME } from '../utils';
import { WorkerParentPostMessageStream } from './WorkerParentPostMessageStream';
import { WorkerPostMessageStream } from './WorkerPostMessageStream';

const DIST_TEST_PATH = `${__dirname}/../../dist-test`;

describe('WebWorker Streams', () => {
  it('can communicate with a worker and be destroyed', async () => {
    const workerPostMessageStreamDist = readFileSync(
      `${DIST_TEST_PATH}/WorkerPostMessageStream.js`,
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

  describe('Worker Parent Stream', () => {
    it('throws on invalid input', () => {
      expect(
        () => new WorkerParentPostMessageStream({ worker: null } as any),
      ).toThrow('Invalid input.');
    });
  });

  describe('Worker (Child) Stream', () => {
    // This property is set in the WorkerPostMessageStream constructor
    afterEach(() => {
      (self as any).onmessage = undefined;
    });

    it('forwards valid messages', () => {
      const stream = new WorkerPostMessageStream();
      const onDataSpy = jest
        .spyOn(stream, '_onData' as any)
        .mockImplementation();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      self.onmessage!(
        new MessageEvent('foo', {
          data: { data: 'bar', target: DEDICATED_WORKER_NAME },
        }),
      );

      expect(onDataSpy).toHaveBeenCalledTimes(1);
      expect(onDataSpy).toHaveBeenCalledWith('bar');
    });

    it('ignores invalid messages', () => {
      const stream = new WorkerPostMessageStream();
      const onDataSpy = jest
        .spyOn(stream, '_onData' as any)
        .mockImplementation();

      ([
        { data: 'bar' },
        { data: { data: 'bar', target: 'foo' } },
        { data: { data: null, target: 'foo' } },
      ] as const).forEach((invalidMessage) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        self.onmessage!(new MessageEvent<unknown>('foo', invalidMessage));

        expect(onDataSpy).not.toHaveBeenCalled();
      });
    });

    it('can be destroyed', () => {
      const stream = new WorkerPostMessageStream();
      expect(stream.destroy()).toBeUndefined();
    });
  });
});
