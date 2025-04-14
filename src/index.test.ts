import * as PostMessageStream from '.';

describe('post-message-stream', () => {
  describe('exports', () => {
    it('has expected exports', () => {
      expect(Object.keys(PostMessageStream).sort()).toMatchInlineSnapshot(`
        Array [
          "BasePostMessageStream",
          "BrowserRuntimePostMessageStream",
          "WebWorkerParentPostMessageStream",
          "WebWorkerPostMessageStream",
          "WindowPostMessageStream",
          "isValidStreamMessage",
        ]
      `);
    });

    it('exports `isValidStreamMessage`', () => {
      // Tested for coverage purposes.
      expect(PostMessageStream.isValidStreamMessage).toBeInstanceOf(Function);
    });
  });
});
