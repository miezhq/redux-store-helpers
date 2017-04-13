import immutable from 'immutable';
import { camelCase } from 'lodash';
import * as constants from './constants';

const INITIAL_STATE = immutable.Map({});

const actionHandlersMap = {
  [constants.ACTION_PUSH]: (state, storePath, payload) =>
    state.updateIn(storePath, (list = immutable.List()) => list.push(payload)),
  [constants.ACTION_POP]: (state, storePath, payload) =>
    state.updateIn(storePath, (list = immutable.List()) => list.pop()),
  [constants.ACTION_MERGE]: (state, storePath, payload) =>
    state.mergeIn(storePath, payload),
  [constants.ACTION_REMOVE]: (state, storePath, payload) =>
    state.removeIn(storePath),
  [constants.ACTION_SET]: (state, storePath, payload) =>
    state.setIn(storePath, payload),
};

export default (state = INITIAL_STATE, action = {}) => {
  const { type, payload } = action;

  const actionTypes = [
    constants.ACTION_PUSH,
    constants.ACTION_POP,
    constants.ACTION_SET,
    constants.ACTION_REMOVE,
    constants.ACTION_MERGE,
  ];

  const actionTypeRegExp =
    new RegExp('@([A-Z0-9_]+)\/' + // eslint-disable-line
      `(${actionTypes.join('|')})` +
      '\_([A-Z\_]+)'); // eslint-disable-line

  const matchResult = type.match(actionTypeRegExp);

  if (matchResult) {
    const [
      match, // eslint-disable-line
      namespace,
      actionType, // eslint-disable-line
      identifier,
    ] = matchResult;

    const storePath = [camelCase(namespace), camelCase(identifier)];

    return actionHandlersMap[actionType](state, storePath, payload);
  }

  return state;
}
