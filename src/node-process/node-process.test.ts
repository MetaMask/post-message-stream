import { fork } from 'child_process';
import EventEmitter from 'events';
import { readFileSync, writeFileSync } from 'fs';
import { ProcessMessageStream } from './ProcessMessageStream';
import { ProcessParentMessageStream } from './ProcessParentMessageStream';

const DIST_TEST_PATH = `${__dirname}/../../dist-test`;

class MockProcess extends EventEmitter {
  send(..._args: any[]): void {
    return undefined;
  }
}

describe('Node Child Process Streams', () => {
  it('can communicate with a child process and be destroyed', async () => {
    const childProcessMessageStreamDist = readFileSync(
      `${DIST_TEST_PATH}/ProcessMessageStream.js`,
      'utf8',
    );

    // Create a stream that multiplies incoming data by 5 and returns it
    const setupProcessStream = `
      const { ProcessMessageStream } = require('./ProcessMessageStream');
      const stream = new ProcessMessageStream();
      stream.on('data', (value) => stream.write(value * 5));
    `;

    const code = `${childProcessMessageStreamDist}\n${setupProcessStream}`;

    const tmpFilePath = `${DIST_TEST_PATH}/childprocess-test.js`;
    writeFileSync(tmpFilePath, code);

    const childProcess = fork(tmpFilePath);

    // Create parent stream
    const parentStream = new ProcessParentMessageStream({
      process: childProcess,
    });

    // Get a deferred Promise for the eventual result
    const responsePromise = new Promise((resolve) => {
      parentStream.once('data', (num) => {
        resolve(Number(num));
      });
    });

    // The child should ignore this
    childProcess.send('foo');

    // Send message to child, triggering a response
    parentStream.write(111);

    expect(await responsePromise).toStrictEqual(555);

    // Check that events with falsy data are ignored as expected
    parentStream.once('data', (data) => {
      throw new Error(`Unexpected data on stream: ${data}`);
    });
    childProcess.send(new Event('message'));

    // Terminate child process, destroy parent stream, and check that parent
    // was destroyed
    childProcess.kill();
    parentStream.destroy();
    expect(parentStream.destroyed).toStrictEqual(true);
  });

  describe('ProcessParentMessageStream', () => {
    it('ignores invalid messages', () => {
      const mockProcess: any = new MockProcess();
      const stream = new ProcessParentMessageStream({ process: mockProcess });
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

  describe('ProcessMessageStream', () => {
    let stream: ProcessMessageStream;

    beforeEach(() => {
      stream = new ProcessMessageStream();
    });

    afterEach(() => {
      stream.destroy();
    });

    it('throws if not run in a child process', () => {
      const originalSend = globalThis.process.send;

      globalThis.process.send = undefined;
      expect(() => new ProcessMessageStream()).toThrow(
        'Parent IPC channel not found. This class should only be instantiated in a Node.js child process.',
      );

      globalThis.process.send = originalSend;
    });

    it('forwards valid messages', () => {
      const onDataSpy = jest
        .spyOn(stream, '_onData' as any)
        .mockImplementation();

      (process as any).emit('message', { data: 'bar' });

      expect(onDataSpy).toHaveBeenCalledTimes(1);
      expect(onDataSpy).toHaveBeenCalledWith('bar');
    });

    it('ignores invalid messages', () => {
      const onDataSpy = jest
        .spyOn(stream, '_onData' as any)
        .mockImplementation();

      [null, undefined, 'foo', 42, {}, { data: null }].forEach(
        (invalidMessage) => {
          (process as any).emit('message', invalidMessage);

          expect(onDataSpy).not.toHaveBeenCalled();
        },
      );
    });
  });
});
