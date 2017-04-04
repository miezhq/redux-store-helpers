import { camelCase } from 'lodash';
import { createSelector } from 'reselect';
import { isImmutable } from 'immutable';
import * as constants from './constants';

const typedSelector = (namespace, identifier, type) => {
  const storePath = ['domain', camelCase(namespace), camelCase(identifier), type];
  return (state) => state.getIn(storePath);
};

const simpleSelector = (namespace, identifier) => {
  const storePath = [
    'domain',
    camelCase(namespace),
    camelCase(identifier),
    constants.RESOURCE_TYPE_DATA,
  ];
  return (state) => state.getIn(storePath);
};


const createTypeSelectors = (namespace, identifier, type) => {
  const [
    dataSelector,
    errorSelector,
    statusSelector,
    timestampSelector,
  ] = [
    constants.PROPERTY_DATA,
    constants.PROPERTY_ERROR,
    constants.PROPERTY_STATUS,
    constants.PROPERTY_TIMESTAMP,
  ].map((field) =>
      createSelector(
        typedSelector(namespace, identifier, type),
        (data) => {
          if(!data) {
            return null;
          }

          const fieldData = data.get(field);
          if (!fieldData) {
            return null;
          }

          return isImmutable(fieldData) ? fieldData.toJS() : fieldData;
        }
      ),
    );

  const isLoading = createSelector(
    typedSelector(namespace, identifier, type),
    (data) =>
      (data && data.get('status')
        ? data.get('status') === constants.ACTION_STATUS_RUNNING
        : false),
  );

  return {
    data: dataSelector,
    error: errorSelector,
    status: statusSelector,
    timestamp: timestampSelector,
    isLoading,
  };
};

export const createItemSelectors = (namespace, identifier) =>
  createTypeSelectors(namespace, identifier, constants.RESOURCE_TYPE_ITEM);

export const createListSelectors = (namespace, identifier) =>
  createTypeSelectors(namespace, identifier, constants.RESOURCE_TYPE_LIST);

export const createPostResultSelectors = (namespace, identifier) =>
  createTypeSelectors(namespace, identifier, constants.RESOURCE_TYPE_MUTATION_RESULT);

export const createSimpleSelector = (namespace, identifier) =>
  createSelector(
    simpleSelector(namespace, identifier),
    (data) => {
      if(!data) {
        return null;
      }
      return isImmutable(data) ? data.toJS() : data;
    }
  );
