/**
 *
 */
import { multiply } from '../src/multiply';

describe('First test', () => {
  it('Sould run first test', () => {
    const x = multiply(2, 3);
    expect(x).toEqual(6);
  });
});
