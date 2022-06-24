import { fork } from 'child_process';
import EventEmitter from 'events';
import { readFileSync, writeFileSync } from 'fs';
import { ChildProcessMessageStream } from './ChildProcessMessageStream';
import { ParentProcessMessageStream } from './ParentProcessMessageStream';

const DIST_TEST_PATH = `${__dirname}/../../dist-test`;

class MockProcess extends EventEmitter {
  send(..._args: any[]): void {
    return undefined;
  }
}

describe('Node Child Process Streams', () => {
  it('can communicate with a child process and be destroyed', async () => {
    const childProcessMessageStreamDist = readFileSync(
      `${DIST_TEST_PATH}/ChildProcessMessageStream.js`,
      'utf8',
    );

    // Create a stream that multiplies incoming data by 5 and returns it
    const setupProcessStream = `
      const { ChildProcessMessageStream } = require('./ChildProcessMessageStream');
      const stream = new ChildProcessMessageStream();
      stream.on('data', (value) => stream.write(value * 5));
    `;

    const code = `${childProcessMessageStreamDist}\n${setupProcessStream}`;

    const tmpFilePath = `${DIST_TEST_PATH}/childprocess-test.js`;
    writeFileSync(tmpFilePath, code);

    const process = fork(tmpFilePath);

    // Create parent stream
    const parentStream = new ParentProcessMessageStream({ process });

    // Get a deferred Promise for the eventual result
    const responsePromise = new Promise((resolve) => {
      parentStream.once('data', (num) => {
        resolve(Number(num));
      });
    });

    // The child should ignore this
    process.send('foo');

    // Send message to child, triggering a response
    parentStream.write(111);

    expect(await responsePromise).toStrictEqual(555);

    // Check that events with falsy data are ignored as expected
    parentStream.once('data', (data) => {
      throw new Error(`Unexpected data on stream: ${data}`);
    });
    process.send(new Event('message'));

    // Terminate child process, destroy parent stream, and check that parent
    // was destroyed
    process.kill();
    parentStream.destroy();
    expect(parentStream.destroyed).toStrictEqual(true);
  });

  describe('ParentProcessMessageStream', () => {
    it('ignores invalid messages', () => {
      const mockProcess: any = new MockProcess();
      const stream = new ParentProcessMessageStream({ process: mockProcess });
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

  describe('ChildProcessMessageStream', () => {
    let stream: ChildProcessMessageStream;

    beforeEach(() => {
      stream = new ChildProcessMessageStream();
    });

    afterEach(() => {
      stream.destroy();
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
