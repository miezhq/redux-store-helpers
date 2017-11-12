import { Map } from 'immutable';
import { camelCase } from 'lodash';
import { ACTION_TYPE_LITERALS } from '../../ActionTypes';
import * as constants from '../../constants';
import { STATUS_LITERALS } from '../../async/Statuses';
import { Action } from '../../Action';

const INITIAL_STATE = Map<string, any>();

const ASYNC_ACTION_TYPES: string[] = [
  ACTION_TYPE_LITERALS.FETCH,
  ACTION_TYPE_LITERALS.LIST,
  ACTION_TYPE_LITERALS.MUTATE,
  ACTION_TYPE_LITERALS.RESET,
];

const STATUSES: string[] = [
  STATUS_LITERALS.START,
  STATUS_LITERALS.SUCCESS,
  STATUS_LITERALS.ERROR,
];

export default (state = INITIAL_STATE, action: Action) => {
  const { type, payload } = action;

  const actionTypeRegExp =
    new RegExp('@([A-Z0-9_]+)\/' + // eslint-disable-line
      `(${ASYNC_ACTION_TYPES.join('|')})` +
      '\_([A-Z\_]+)_' + // eslint-disable-line
      `(${STATUSES.join('|')})`);

  const matchResult = type.match(actionTypeRegExp);

  if (matchResult) {
    const [
      match, // eslint-disable-line
      namespace,
      actionType, // eslint-disable-line
      identifier,
      status,
    ] = matchResult;

    const storePath = [camelCase(namespace), camelCase(identifier)];

    if (actionType === ACTION_TYPE_LITERALS.RESET) {
      return state.setIn(storePath, {
        [constants.PROPERTY_STATUS]: null,
        [constants.PROPERTY_TIMESTAMP]: new Date(),
        [constants.PROPERTY_DATA]: undefined,
      });
    }

    if (status === STATUS_LITERALS.START) {
      return state.mergeIn(storePath, {
        [constants.PROPERTY_STATUS]: constants.ACTION_STATUS_RUNNING,
        [constants.PROPERTY_TIMESTAMP]: new Date(),
      });
    }

    if (status === STATUS_LITERALS.SUCCESS) {
      return state.mergeIn(storePath, {
        [constants.PROPERTY_STATUS]: constants.ACTION_STATUS_DONE,
        [constants.PROPERTY_TIMESTAMP]: new Date(),
        [constants.PROPERTY_DATA]: payload,
        [constants.PROPERTY_ERROR]: undefined,
      });
    }

    if (status === STATUS_LITERALS.ERROR) {
      return state.mergeIn(storePath, {
        [constants.PROPERTY_STATUS]: constants.ACTION_STATUS_FAILED,
        [constants.PROPERTY_TIMESTAMP]: new Date(),
        [constants.PROPERTY_DATA]: undefined,
        [constants.PROPERTY_ERROR]: payload,
      });
    }
  }

  return state;
};
