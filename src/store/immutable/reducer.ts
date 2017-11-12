import { Map, List } from 'immutable';
import { camelCase } from 'lodash';
import { ACTION_TYPE_LITERALS } from '../ActionTypes';
import { Action } from '../Action';

const INITIAL_STATE = Map<string, any>();

const ACTION_TYPES: string[] = [
  ACTION_TYPE_LITERALS.PUSH,
  ACTION_TYPE_LITERALS.POP,
  ACTION_TYPE_LITERALS.SET,
  ACTION_TYPE_LITERALS.REMOVE,
  ACTION_TYPE_LITERALS.MERGE,
];

const actionHandlersMap = {
  [ACTION_TYPE_LITERALS.PUSH]: (state: Map<string, any>, storePath: String[], payload: any) =>
    state.updateIn(storePath, (list = List()) => list.push(payload)),
  [ACTION_TYPE_LITERALS.POP]: (state: Map<string, any>, storePath: String[], payload: any) =>
    state.updateIn(storePath, (list = List()) => list.pop()),
  [ACTION_TYPE_LITERALS.MERGE]: (state: Map<string, any>, storePath: String[], payload: any) =>
    state.mergeIn(storePath, payload),
  [ACTION_TYPE_LITERALS.REMOVE]: (state: Map<string, any>, storePath: String[], payload: any) =>
    state.removeIn(storePath),
  [ACTION_TYPE_LITERALS.SET]: (state: Map<string, any>, storePath: String[], payload: any) =>
    state.setIn(storePath, payload),
};

export default (state:Map<string, any> = INITIAL_STATE, action: Action) => {
  const { type, payload } = action;

  const actionTypeRegExp =
    new RegExp('@([A-Z0-9_]+)\/' + // eslint-disable-line
      `(${ACTION_TYPES.join('|')})` +
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
