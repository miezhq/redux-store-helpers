import { camelCase } from 'lodash';
import { createSelector } from 'reselect';
import { isImmutable } from 'immutable';
import * as constants from '../constants';
import { getMountPoint } from '../utils';

const mountPoint = getMountPoint();

const pathSelector = (namespace: string, identifier: string) => {
  const storePath = [
    mountPoint,
    camelCase(namespace),
    camelCase(identifier),
  ];
  return (state: any) => state.getIn(storePath);
};

export const getAsyncSelectors = (namespace: string, identifier: string) => {
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
  ].map((field: string) =>
    createSelector(
      pathSelector(namespace, identifier),
      (data) => {
        if (!data) {
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
    pathSelector(namespace, identifier),
    (data): boolean =>
      (data && data.get(constants.PROPERTY_STATUS)
        ? data.get(constants.PROPERTY_STATUS) === constants.ACTION_STATUS_RUNNING
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

export const getSelector = (namespace: string, identifier: string) =>
  createSelector(
    pathSelector(namespace, identifier),
    (data) => {
      if (!data) {
        return null;
      }
      return isImmutable(data) ? data.toJS() : data;
    }
  );
