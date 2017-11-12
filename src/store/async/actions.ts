import { createAction } from 'redux-actions';
import { snakeCase } from 'lodash';
import Statuses, { Status } from './Statuses';
import { ActionTypes, AsyncActionType } from '../ActionTypes';
import { Promise } from 'es6-promise';

export const actionName = (namespace: string, identifier: string, action: AsyncActionType, status: Status): string =>
  `@${namespace}/${ActionTypes[action]}_${snakeCase(identifier)}_${Statuses[status]}`.toUpperCase();

const genericAction = (namespace: string, identifier: string, action: AsyncActionType, status: Statuses) =>
  createAction(actionName(namespace, identifier, action, status));

const actionStatusFunction = (status: Status) =>
  (namespace: string, identifier: string, action: AsyncActionType) =>
    genericAction(namespace, identifier, action, status);

type AsyncFunction<R> = (...args: any[]) => R;

export const asyncRequest = (action: AsyncActionType, namespace: string, identifier: string, func: AsyncFunction<Promise<any>>) => {
  const [
    requestStart,
    requestSuccess,
    requestError,
  ] = [
    actionStatusFunction(Statuses.START),
    actionStatusFunction(Statuses.SUCCESS),
    actionStatusFunction(Statuses.ERROR)
  ].map((fn): Function => fn(namespace, identifier, action));

  return (...params:any[]) => (dispatch: any) => {
    dispatch(requestStart());

    return func(...params)
      .then((response: any) => {
        dispatch(requestSuccess(response));
        return response;
      })
      .catch((err: Error) => {
        dispatch(requestError(err));
        return Promise.reject(err);
      });
  };
};

const createAsyncRequestByActionType = (actionType: AsyncActionType) =>
  (namespace: string, identifier: string, fn: any) =>
    asyncRequest(actionType, namespace, identifier, fn);

const createResetAction = () =>
  (namespace: string, identifier: string) => {
    const action = actionStatusFunction(Statuses.SUCCESS)(namespace, identifier, ActionTypes.RESET);
    return () => (dispatch: any) => dispatch(action());
  };

export const getById = createAsyncRequestByActionType(ActionTypes.FETCH);
export const getList = createAsyncRequestByActionType(ActionTypes.LIST);
export const mutate = createAsyncRequestByActionType(ActionTypes.MUTATE);
export const create = mutate;
export const update = mutate;
export const remove = mutate;
export const reset = createResetAction();
