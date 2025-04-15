import * as PostMessageStream from './node';

describe('post-message-stream/node', () => {
  describe('exports', () => {
    it('has expected exports', () => {
      expect(Object.keys(PostMessageStream).sort()).toMatchInlineSnapshot(`
        Array [
          "BasePostMessageStream",
          "BrowserRuntimePostMessageStream",
          "ProcessMessageStream",
          "ProcessParentMessageStream",
          "ThreadMessageStream",
          "ThreadParentMessageStream",
          "WebWorkerParentPostMessageStream",
          "WebWorkerPostMessageStream",
          "WindowPostMessageStream",
          "isValidStreamMessage",
        ]
      `);
    });
  });
});
