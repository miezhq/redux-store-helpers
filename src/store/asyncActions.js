import { createAction } from 'redux-actions';
import { snakeCase } from 'lodash';
import * as constants from './constants';

const actionName = (namespace, identifier, action, status) =>
  `@${namespace}/${action}_${snakeCase(identifier)}_${status}`.toUpperCase();

const genericAction = (namespace, identifier, action, status) =>
  createAction(actionName(namespace, identifier, action, status));

const actionStatusFunction = (status) =>
  (namespace, identifier, action) =>
    genericAction(namespace, identifier, action, status);

export const asyncRequest = (method, namespace, identifier, func) => {
  const [
    requestStart,
    requestSuccess,
    requestError,
  ] = [
    actionStatusFunction(constants.STATUS_START),
    actionStatusFunction(constants.STATUS_SUCCESS),
    actionStatusFunction(constants.STATUS_ERROR)
  ].map((fn) => fn(namespace, identifier, method));

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

const createResetAction = (actionType) =>
  (namespace, identifier) =>
    actionStatusFunction(constants.STATUS_RESET)(namespace, identifier, actionType);

export const getById = createAsyncRequestByActionType(constants.ACTION_FETCH);
export const resetItem = createResetAction(constants.ACTION_FETCH);

export const getList = createAsyncRequestByActionType(constants.ACTION_LIST);
export const resetList = createResetAction(constants.ACTION_LIST);

export const postData = createAsyncRequestByActionType(constants.ACTION_POST);
export const resetPostData = createResetAction(constants.ACTION_POST);
