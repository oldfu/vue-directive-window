import { startEvent, moveEvent } from './common';
import { handleStartEventForResize, cursorChange } from './resize';
import { handleStartEventForMove } from './move';
import { addMaximizeEvent } from './maximize';
import { validate } from './validate';
import DEFAULT_PARAMS from '../config/default-params';

function _prepareParams(customParams) {
  validate(customParams);
  return Object.assign({}, DEFAULT_PARAMS, customParams);
}

function getMoveHandler(finalParams, el) {
  const customMoveHandler = finalParams.customMoveHandler;
  if (customMoveHandler) {
    if (typeof customMoveHandler === 'string') {
      return el.querySelector(customMoveHandler);
    } else {
      return customMoveHandler;
    }
  } else {
    return el;
  }
}

function getMaximizeHandler(finalParams, el) {
  const customMaximizeHandler = finalParams.customMaximizeHandler;
  if (customMaximizeHandler) {
    if (typeof customMaximizeHandler === 'string') {
      return el.querySelector(customMaximizeHandler);
    } else {
      return customMaximizeHandler;
    }
  }

  return null;
}

function isMoveHandlerEqualWindow(window, moveHandler) {
  return window === moveHandler;
}

export function eventBinding(el, customParams) {
  const finalParams = _prepareParams(customParams);
  const moveHandler = getMoveHandler(finalParams, el);
  const maximizeHandler = getMaximizeHandler(finalParams, el);
  const instance = {
    window: el,
    params: finalParams,
    moveHandler,
    maximizeHandler,
    isMoveHandlerEqualWindow: isMoveHandlerEqualWindow(el, moveHandler),
  };

  /* 拖拽移动相关 */
  moveHandler.addEventListener(
    startEvent,
    handleStartEventForMove.bind(instance)
  );

  /* resize相关 */
  el.addEventListener(startEvent, handleStartEventForResize.bind(instance));
  el.addEventListener(moveEvent, cursorChange.bind(instance));

  /* 最大化相关 */
  if (maximizeHandler) {
    addMaximizeEvent.call(instance, maximizeHandler);
  }
}
