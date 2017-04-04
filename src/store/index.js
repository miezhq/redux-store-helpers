import reduceReducers from 'reduce-reducers';
import syncReducer from './reducer'
import asyncReducer from './asyncReducer';

export const reducer = reduceReducers(
  syncReducer, asyncReducer
);
