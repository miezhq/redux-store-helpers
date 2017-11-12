import reduceReducers from 'reduce-reducers';
import syncReducer from './store/reducer'
import asyncReducer from './store/async/reducer';
import { setMountPoint as mPoint } from "./store/utils";

export {
  arrayPop,
  arrayPush,
  merge,
  set,
  remove as unset
} from './store/actions';

export {
  getById,
  getList,
  mutate,
  create,
  update,
  remove,
  reset
} from './store/async/actions';

export const setMountPoint = mPoint;

export const reducer = reduceReducers(
  syncReducer, asyncReducer
);

export { getAsyncSelectors, getSelector } from './store/selectors';
