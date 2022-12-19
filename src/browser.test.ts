import * as PostMessageStream from './browser';

// `BrowserRuntimePostMessageStream` imports `webextension-polyfill` which
// throws an error if it's not in a browser environment. We need to mock it
// here to prevent that error.
jest.mock('webextension-polyfill', () => undefined);

describe('post-message-stream', () => {
  describe('browser exports', () => {
    const expectedExports = [
      'BasePostMessageStream',
      'WindowPostMessageStream',
      'WebWorkerPostMessageStream',
      'WebWorkerParentPostMessageStream',
      'BrowserRuntimePostMessageStream',
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
});
