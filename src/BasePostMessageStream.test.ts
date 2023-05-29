import { WindowPostMessageStream } from './window/WindowPostMessageStream';

describe('BasePostMessageStream', () => {
  let stream: WindowPostMessageStream;

  beforeEach(() => {
    stream = new WindowPostMessageStream({
      name: 'name',
      target: 'target',
    });
  });

  afterEach(() => {
    stream.destroy();
  });

  it('checks logger receiving messages', async () => {
    await new Promise<void>((resolve) => {
      stream._setLogger('name', 'target', (source, destination, out, data) => {
        expect(source).toStrictEqual('name');
        expect(destination).toStrictEqual('target');
        expect(out).toStrictEqual(false);
        expect(data).toStrictEqual({ data: 123 });
        resolve();
      });

      (stream as any)._init = true;
      (stream as any)._onData({ data: 123 });
    });
  });

  it('checks logger sending messages', async () => {
    await new Promise<void>((resolve) => {
      stream._setLogger('name', 'target', (source, destination, out, data) => {
        expect(source).toStrictEqual('name');
        expect(destination).toStrictEqual('target');
        expect(out).toStrictEqual(true);
        expect(data).toStrictEqual({ data: 123 });
        resolve();
      });

      (stream as any)._init = true;
      (stream as any)._write({ data: 123 });
    });
  });

  it('handles errors thrown when pushing data', async () => {
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

  it('does nothing if receiving junk data during synchronization', async () => {
    const _stream: any = stream;

    const spies = [
      jest.spyOn(_stream, 'push').mockImplementation(),
      jest.spyOn(_stream, 'emit').mockImplementation(),
      jest.spyOn(_stream, '_write').mockImplementation(),
      jest.spyOn(_stream, 'uncork').mockImplementation(),
    ];

    _stream._onData({});
    spies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
  });
});
