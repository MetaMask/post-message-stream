import { readFileSync } from 'fs';
import { runInNewContext } from 'vm';

import {
  WindowPostMessageStream,
  WorkerPostMessageStream,
  WorkerParentPostMessageStream,
} from '.';

describe('Basic', () => {
  it('can construct message stream classes', () => {
    const windowStream = new WindowPostMessageStream();
    expect(windowStream).toBeTruthy();
    const workerStream = new WorkerPostMessageStream();
    expect(workerStream).toBeTruthy();
  });
});

describe('Umd build works', () => {
  it('can run the umd bundle in a fresh context', () => {
    const postMessageStreamDist = readFileSync(`${__dirname}/../dist/bundle.js`, 'utf8');
    const vmGlobal: any = {};
    const context = { self: vmGlobal };
    runInNewContext(postMessageStreamDist, context);
    expect(vmGlobal.PostMessageStream).toBeTruthy();
    expect(vmGlobal.PostMessageStream.WindowPostMessageStream).toBeTruthy();
    expect(vmGlobal.PostMessageStream.WorkerPostMessageStream).toBeTruthy();
    expect(vmGlobal.PostMessageStream.WorkerParentPostMessageStream).toBeTruthy();
  });
});

describe('Worker', () => {
  it('can communicate with a worker', async () => {
    // create a worker that transforms stream input by multiplying by 5
    const postMessageStreamDist = readFileSync(`${__dirname}/../dist/bundle.js`, 'utf8');
    const customWorker = (`
    try {
      const stream = new self.PostMessageStream.WorkerPostMessageStream();
      stream.on('data', (input) => stream.write(input * 5));
      self.postMessage(456);
    } catch (err) {
      self.postMessage(err.message);
    }
    `);
    const code = `${postMessageStreamDist};\n${customWorker}`;
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

    expect(response).toEqual(555);
  });
});
