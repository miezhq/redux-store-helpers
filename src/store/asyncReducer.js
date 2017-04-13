import immutable from 'immutable';
import { camelCase } from 'lodash';
import * as constants from './constants';

const INITIAL_STATE = immutable.Map({});

export default (state = INITIAL_STATE, action = {}) => {
  const { type, payload } = action;

  const actionTypes = [
    constants.ACTION_FETCH,
    constants.ACTION_LIST,
    constants.ACTION_MUTATE,
    constants.ACTION_RESET,
  ];

  const statuses = [
    constants.STATUS_SUCCESS,
    constants.STATUS_ERROR,
    constants.STATUS_START,
  ];

  const actionTypeRegExp =
    new RegExp('@([A-Z0-9_]+)\/' + // eslint-disable-line
      `(${actionTypes.join('|')})` +
      '\_([A-Z\_]+)_' + // eslint-disable-line
      `(${statuses.join('|')})`);

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

    if (actionType === constants.ACTION_RESET) {
      return state.setIn(storePath, {
        [constants.PROPERTY_STATUS]: null,
        [constants.PROPERTY_TIMESTAMP]: new Date(),
        [constants.PROPERTY_DATA]: undefined,
      });
    }

    if (status === constants.STATUS_START) {
      return state.mergeIn(storePath, {
        [constants.PROPERTY_STATUS]: constants.ACTION_STATUS_RUNNING,
        [constants.PROPERTY_TIMESTAMP]: new Date(),
      });
    }

    if (status === constants.STATUS_SUCCESS) {
      return state.mergeIn(storePath, {
        [constants.PROPERTY_STATUS]: constants.ACTION_STATUS_DONE,
        [constants.PROPERTY_TIMESTAMP]: new Date(),
        [constants.PROPERTY_DATA]: payload,
      });
    }

    if (status === constants.STATUS_ERROR) {
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
