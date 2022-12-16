import { RuntimePostMessageStream } from './RuntimePostMessageStream';

describe('RuntimePostMessageStream', () => {
  beforeEach(() => {
    const addListener = jest.fn();
    const sendMessage = jest.fn().mockImplementation((message) => {
      // Propagate message to all listeners.
      addListener.mock.calls.forEach(([listener]) => {
        setTimeout(() => listener(message));
      });
    });

    Object.assign(global, {
      chrome: {
        runtime: {
          sendMessage,
          onMessage: {
            addListener,
            removeListener: jest.fn(),
          },
        },
      },
    });
  });

  it('throws if chrome.runtime.sendMessage is not a function', () => {
    // @ts-expect-error - Invalid function type.
    chrome.runtime.sendMessage = undefined;

    expect(
      () => new RuntimePostMessageStream({ name: 'foo', target: 'bar' }),
    ).toThrow(
      'chrome.runtime.sendMessage is not a function. This class should only be instantiated in a web extension.',
    );
  });

  it('can communicate between streams and be destroyed', async () => {
    // Initialize sender stream
    const streamA = new RuntimePostMessageStream({
      name: 'a',
      target: 'b',
    });

    // Initialize receiver stream. Multiplies incoming values by 5 and
    // returns them.
    const streamB = new RuntimePostMessageStream({
      name: 'b',
      target: 'a',
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

    const throwingListener = (data: any) => {
      throw new Error(`Unexpected data on stream: ${data}`);
    };

    streamA.once('data', throwingListener);
    streamB.once('data', throwingListener);

    chrome.runtime.sendMessage(new Event('message'), {}, () => undefined);

    // Destroy streams and confirm that they were destroyed
    streamA.destroy();
    streamB.destroy();
    expect(streamA.destroyed).toStrictEqual(true);
    expect(streamB.destroyed).toStrictEqual(true);
  });
});
