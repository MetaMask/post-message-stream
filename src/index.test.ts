import * as thisModule from '.';

describe('Test', () => {
  it('has expected number of runtime modules', () => {
    expect(Object.keys(thisModule)).toHaveLength(3);
  });
});
