import assert from 'assert';
import log from './log';
import lambda from './aws/lambda';

export function run(event, context, { handlers } = {}) {
  const { action } = event;

  assert.ok(action, 'no action specified');
  assert.ok(handlers, 'no handlers registered');
  assert.ok(handlers[action], `no handler registered for ${action}`);

  log.trace(`executing ${action}`);

  return handlers[action]({ event, context, log });
}

export async function rpc({
  functionName,
  action,
  functionArn = null,
  params = {},
  options = {},
}) {
  assert.ok(process.env.STACK_FUNCTION_BASE_NAME, 'a base name is required in order to resolve function name');
  assert.ok(action, 'an action is required when invoking remote functions');

  const functionToInvoke = functionName ? `${process.env.STACK_FUNCTION_BASE_NAME}-${functionName}` : functionArn;
  assert.ok(functionToInvoke, 'a function name is required when invoking remote functions');

  log.info(`rpc() invoke ${functionToInvoke}:${action} with params`, params);

  try {
    const result = await lambda.invoke({
      FunctionName: `${process.env.STACK_FUNCTION_BASE_NAME}-${functionName}`,
      Payload: JSON.stringify({
        params,
        action,
      }),
      ...options,
    }).promise();

    log.info(`rpc() ${functionName}:${action} -> RESULT`, result);

    if (result.StatusCode !== 200) {
      log.error(`rpc() invoke ${functionName}:${action} -> STATUS CODE ${result.StatusCode}`, result.Payload);
      return null;
    }

    try {
      return JSON.parse(result.Payload);
    } catch (e) {
      log.error(`rpc() invoke ${functionName}:${action} -> UNABLE TO PARSE JSON`, e);
      return null;
    }
  } catch (e) {
    log.error(e);
    throw e;
  }
}
