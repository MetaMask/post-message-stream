import * as PostMessageStream from '.';

describe('post-message-stream', () => {
  describe('exports', () => {
    const expectedExports = [
      'WindowPostMessageStream',
      'WebWorkerPostMessageStream',
      'WebWorkerParentPostMessageStream',
      'ProcessParentMessageStream',
      'ProcessMessageStream',
      'ThreadParentMessageStream',
      'ThreadMessageStream',
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
