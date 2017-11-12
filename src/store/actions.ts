import { createAction } from 'redux-actions';
import { snakeCase } from 'lodash';
import { ActionTypes, ActionType } from './ActionTypes';

const actionName = (namespace: string, identifier: string, action: ActionType) =>
  `@${namespace}/${ActionTypes[action]}_${snakeCase(identifier)}`.toUpperCase();

const syncAction = (actionType: ActionType, payloadCreator?: any) =>
  (namespace: string, identifier: string) =>
    createAction(
      actionName(namespace, identifier, actionType),
      payloadCreator
    );

export const arrayPush = syncAction(ActionTypes.PUSH);
export const arrayPop = syncAction(ActionTypes.POP);
export const set = syncAction(ActionTypes.SET);
export const remove = syncAction(ActionTypes.REMOVE);
export const merge = syncAction(ActionTypes.MERGE);


