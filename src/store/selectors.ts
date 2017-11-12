import { camelCase } from 'lodash';
import { createSelector } from 'reselect';
import * as constants from './constants';
import { getMountPoint } from './utils';
import { get } from 'lodash';

const mountPoint = getMountPoint();

const pathSelector = (namespace: string, identifier: string) => {
  const storePath = [
    mountPoint,
    camelCase(namespace),
    camelCase(identifier),
  ];
  return (state: any) =>  get(state, storePath, null);
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

        return get(data, field, null);
      }
    ),
  );

  const isLoading = createSelector(
    pathSelector(namespace, identifier),
    (data): boolean => {
      if (!data) {
        return false;
      }
      const status = get(data, constants.PROPERTY_STATUS, null);

      if (!status) {
        return false;
      }

      return status === constants.ACTION_STATUS_RUNNING
    }
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
    (data) => data || null
  );
