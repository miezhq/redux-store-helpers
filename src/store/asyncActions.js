import { createAction } from 'redux-actions';
import { snakeCase } from 'lodash';
import * as constants from './constants';

export const actionName = (namespace, identifier, action, status) =>
  `@${namespace}/${action}_${snakeCase(identifier)}_${status}`.toUpperCase();

const genericAction = (namespace, identifier, action, status) =>
  createAction(actionName(namespace, identifier, action, status));

const actionStatusFunction = (status) =>
  (namespace, identifier, action) =>
    genericAction(namespace, identifier, action, status);

export const asyncRequest = (action, namespace, identifier, func) => {
  const [
    requestStart,
    requestSuccess,
    requestError,
  ] = [
    actionStatusFunction(constants.STATUS_START),
    actionStatusFunction(constants.STATUS_SUCCESS),
    actionStatusFunction(constants.STATUS_ERROR)
  ].map((fn) => fn(namespace, identifier, action));

  return (...params) => (dispatch) => {
    dispatch(requestStart());

    return func(...params)
      .then((response) => {
        dispatch(requestSuccess(response));
        return response;
      })
      .catch((err) => {
        dispatch(requestError(err));
        return Promise.reject(err);
      });
  };
};

const createAsyncRequestByActionType = (actionType) =>
  (namespace, identifier, fn) =>
    asyncRequest(actionType, namespace, identifier, fn);

const createResetAction = () =>
  (namespace, identifier) => {
    const action = actionStatusFunction(constants.STATUS_SUCCESS)(namespace, identifier, constants.ACTION_RESET);
    return () => (dispatch) => dispatch(action());
  };



export const getById = createAsyncRequestByActionType(constants.ACTION_FETCH);
export const getList = createAsyncRequestByActionType(constants.ACTION_LIST);
export const mutate = createAsyncRequestByActionType(constants.ACTION_MUTATE);
export const reset = createResetAction();
