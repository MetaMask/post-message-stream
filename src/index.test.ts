import { readFileSync } from 'fs';
import * as PostMessageStream from '.';

describe('exports', () => {
  const expectedExports = [
    'WindowPostMessageStream',
    'WorkerPostMessageStream',
    'WorkerParentPostMessageStream',
  ];

  it('package has expected exports', () => {
    expect(Object.keys(PostMessageStream)).toHaveLength(expectedExports.length);
    for (const exportName of expectedExports) {
      expect(exportName in PostMessageStream).toStrictEqual(true);
    }
  });
});

const { WindowPostMessageStream, WorkerParentPostMessageStream } = PostMessageStream;

// describe('Window', () => {
//   it('', async () => {
//     const workerPostMessageStreamDist = readFileSync(
//       `${__dirname}/../dist-test/WorkerPostMessageStream.js`,
//       'utf8',
//     );
//   })
// })

describe('Worker', () => {
  it('can communicate with a worker and be destroyed', async () => {
    // create a worker that transforms stream input by multiplying by 5
    const workerPostMessageStreamDist = readFileSync(
      `${__dirname}/../dist-test/WorkerPostMessageStream.js`,
      'utf8',
    );

    const customWorker = `
    try {
      const stream = new self.PostMessageStream.WorkerPostMessageStream();
      stream.on('data', (input) => stream.write(input * 5));
      self.postMessage(456);
    } catch (err) {
      self.postMessage(err.message);
    }
    `;

    const code = `${workerPostMessageStreamDist};\n${customWorker}`;
    const worker = new Worker(URL.createObjectURL(new Blob([code])));

    // send input on the stream
    const stream = new WorkerParentPostMessageStream({ worker });
    stream.write(111);

    // wait for first item out of stream
    const response = await new Promise((resolve) => {
      stream.once('data', (num) => {
        resolve(Number(num));
      });
    });

    expect(response).toStrictEqual(555);

    // Terminate worker and check that parent was destroyed
    worker.terminate();
    stream.destroy();
    expect(stream.destroyed).toStrictEqual(true);
  });
});
