import { run } from './sprawl';

const emptyEvent = {};
const emptyContext = {};
const emptyHandlers = {};

describe('sprawl', () => {
  describe('run()', () => {
    it('throws if no action specified', async () => {
      expect(() => run(emptyEvent)).toThrow();
    });

    it('throws if no handlers specified', async () => {
      expect(() => run(emptyEvent, emptyContext, { handlers: emptyHandlers })).toThrow();
    });

    it('throws if no handlers match requested action', async () => {
      expect(() => run({ action: 'foo' }, emptyContext, {
        handlers: {
          someHandlerNotFoo: () => {},
        },
      })).toThrow();
    });

    it('executes the correct handler, passing context, given an action', async () => {
      const testActionName = 'testAction';
      const testActionHandler = jest.fn();
      const inputEvent = {
        action: testActionName,
      };
      const inputContext = { foo: 'bar' };

      const handlers = {
        [testActionName]: testActionHandler,
      };

      await run(inputEvent, inputContext, {
        handlers,
      });

      expect(testActionHandler).toBeCalledWith(expect.objectContaining({
        event: inputEvent,
        context: inputContext,
      }));
    });
  });
});
