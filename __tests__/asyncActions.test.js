import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { getById, reset, actionName } from '../src/store/asyncActions';
import nock from 'nock'
import expect from 'expect' // You can use any testing library
import Promise from 'es6-promise';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

const NAMESPACE = 'miez';
const IDENTIFIER = 'mydata';

const asyncActionCreator = (creator, namespace, identifier, error, payload) =>
  creator(namespace, identifier, (...params) => new Promise((resolve, reject) => {
    if (error) {
      throw new Error('SomeError');
    }
    resolve(payload);
  })) ;

describe('asyncActions', () => {
  let store = null;

  beforeEach(() => {
    store = mockStore({});
  });

  describe('getById', () => {
    const ID = 123;
    const payload = {id: ID, a: 1, b: 2, c: {d: 3}};
    const startAction = {type: actionName(NAMESPACE, IDENTIFIER,'fetch', 'start')};
    const successAction = {type: actionName(NAMESPACE, IDENTIFIER,'fetch', 'success'), payload};
    const errorAction = {type: actionName(NAMESPACE, IDENTIFIER,'fetch', 'error'), payload: new Error('SomeError'), error: true};

    const expectedActionsSuccess = [startAction, successAction];
    const expectedActionsError = [startAction, errorAction];

    it('creates @{namespace}/FETCH_{identifier}_START', () => {

      const getMiezData = asyncActionCreator(getById, NAMESPACE, IDENTIFIER, false, payload);

      return store.dispatch(getMiezData(ID))
        .then(() => { // return of async actions
          expect(store.getActions()[0]).toEqual(startAction);
        })
    });

    it('creates @{namespace}/FETCH_{identifier}_SUCCESS', () => {

      const getMiezData = asyncActionCreator(getById, NAMESPACE, IDENTIFIER, false, payload);

      return store.dispatch(getMiezData(ID))
        .then(() => { // return of async actions
          expect(store.getActions()).toEqual(expectedActionsSuccess);
        })
    });

    it('creates @{namespace}/FETCH_{identifier}_ERROR', () => {

      const getMiezData = asyncActionCreator(getById, NAMESPACE, IDENTIFIER, true);

      return store.dispatch(getMiezData(ID))
        .catch(() => { // return of async actions
          expect(store.getActions()).toEqual(expectedActionsError);
        });
    });
  });

  describe('reset', () => {
    const successAction = {type: actionName(NAMESPACE, IDENTIFIER,'reset', 'success')};

    it('creates @{namespace}/RESET_{identifier}_SUCCESS', () => {

      const resetMiezData = reset(NAMESPACE, IDENTIFIER);

      store.dispatch(resetMiezData());
      expect(store.getActions()[0]).toEqual(successAction);
    });
  });
});
