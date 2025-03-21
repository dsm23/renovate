import type { Decorator } from '.';
import { decorate } from '.';

interface WrapParameters {
  mock: (_: string) => string;
}

function wrap<T>({ mock }: WrapParameters): Decorator<T> {
  return decorate(async ({ args, instance, callback }) => {
    mock('before');
    await callback();
    mock('after');
  });
}

describe('util/decorator/index', () => {
  it('wraps a function', async () => {
    const mock = vi.fn();
    class MyClass {
      @wrap({ mock })
      async underTest() {
        await Promise.resolve();
      }
    }

    const myClass = new MyClass();
    await myClass.underTest();

    expect(mock).toHaveBeenCalledTimes(2);
    expect(mock).toHaveBeenNthCalledWith(1, 'before');
    expect(mock).toHaveBeenNthCalledWith(2, 'after');
  });
});
