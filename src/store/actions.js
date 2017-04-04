import { createAction } from 'redux-actions';
import { snakeCase } from 'lodash';
import * as constants from './constants';

const actionName = (namespace, identifier, action) =>
  `@${namespace}/${action}_${snakeCase(identifier)}`.toUpperCase();

const syncAction = (actionType, payloadCreator) =>
  (namespace, identifier) =>
    createAction(
      actionName(namespace, identifier, actionType),
      payloadCreator
    );

export const arrayPush = syncAction(constants.ACTION_PUSH);
export const arrayPop = syncAction(constants.ACTION_POP);
export const set = syncAction(constants.ACTION_SET);
export const remove = syncAction(constants.ACTION_REMOVE);
export const merge = syncAction(constants.ACTION_MERGE);


