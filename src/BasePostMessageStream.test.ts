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
