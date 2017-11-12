import thunk from 'redux-thunk';
import { getById, reset, getList, mutate } from '../dist/store/async/actions';
import expect from 'expect'; // You can use any testing library
import Promise from 'es6-promise';
import asyncReducer from '../dist/store/async/reducer';
import { actionName } from '../dist/store/async/actions';
import { ActionTypes } from '../dist/store/ActionTypes';
import Statuses from '../dist/store/async/Statuses';
import MockDate from 'mockdate';

const NAMESPACE = 'miez';
const IDENTIFIER = 'mydata';

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(asyncReducer(undefined, {})).toEqual({});
  });

  it('should handle an async reset action', () => {
    MockDate.set('2017-01-01T00:00:00.000Z');

    const expectedState = {
      [NAMESPACE]: {
        [IDENTIFIER]: {
          status: null,
          ts: new Date(),
          data: undefined
        }
      }
    };

    const action = actionName(NAMESPACE, IDENTIFIER, ActionTypes.RESET, Statuses.SUCCESS);
    expect(asyncReducer({}, { type: action })).toEqual(expectedState);
  });
});
