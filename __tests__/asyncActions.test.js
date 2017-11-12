import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { getById, reset, getList, mutate } from '../dist/store/async/actions';
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

const createAction = (namespace, identifier, actionType, status, payload, error = null) => {

  const action = {
    type: `@${namespace}/${actionType}_${identifier}_${status}`.toUpperCase()
  };

  if (status === 'SUCCESS' && payload){
    action['payload'] = payload;
  }

  if(error) {
    action['payload'] = error;
    action['error'] = true;
  }

  return action;
};

describe('asyncActions', () => {
  let store = null;

  beforeEach(() => {
    store = mockStore({});
  });

  describe('getById', () => {
    const ID = 123;
    const payload = {id: ID, a: 1, b: 2, c: {d: 3}};
    const actionType = 'FETCH';
    const startAction = createAction(NAMESPACE, IDENTIFIER, actionType, 'START', payload);
    const successAction = createAction(NAMESPACE, IDENTIFIER, actionType, 'SUCCESS', payload);
    const errorAction = createAction(NAMESPACE, IDENTIFIER, actionType, 'ERROR', payload, new Error('SomeError'));

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

  describe('getList', () => {
    const ID = 123;
    const payload = {id: ID, a: 1, b: 2, c: {d: 3}};
    const actionType = 'LIST';
    const startAction = createAction(NAMESPACE, IDENTIFIER, actionType, 'START', payload);
    const successAction = createAction(NAMESPACE, IDENTIFIER, actionType, 'SUCCESS', payload);
    const errorAction = createAction(NAMESPACE, IDENTIFIER, actionType, 'ERROR', payload, new Error('SomeError'));

    const expectedActionsSuccess = [startAction, successAction];
    const expectedActionsError = [startAction, errorAction];

    it('creates @{namespace}/LIST_{identifier}_START', () => {

      const getMiezData = asyncActionCreator(getList, NAMESPACE, IDENTIFIER, false, payload);

      return store.dispatch(getMiezData(ID))
        .then(() => { // return of async actions
          expect(store.getActions()[0]).toEqual(startAction);
        })
    });

    it('creates @{namespace}/LIST_{identifier}_SUCCESS', () => {

      const getMiezData = asyncActionCreator(getList, NAMESPACE, IDENTIFIER, false, payload);

      return store.dispatch(getMiezData(ID))
        .then(() => { // return of async actions
          expect(store.getActions()).toEqual(expectedActionsSuccess);
        })
    });

    it('creates @{namespace}/LIST_{identifier}_ERROR', () => {

      const getMiezData = asyncActionCreator(getList, NAMESPACE, IDENTIFIER, true);

      return store.dispatch(getMiezData(ID))
        .catch(() => { // return of async actions
          expect(store.getActions()).toEqual(expectedActionsError);
        });
    });
  });

  describe('mutate', () => {
    const ID = 123;
    const payload = {id: ID, a: 1, b: 2, c: {d: 3}};
    const actionType = 'MUTATE';
    const startAction = createAction(NAMESPACE, IDENTIFIER, actionType, 'START', payload);
    const successAction = createAction(NAMESPACE, IDENTIFIER, actionType, 'SUCCESS', payload);
    const errorAction = createAction(NAMESPACE, IDENTIFIER, actionType, 'ERROR', payload, new Error('SomeError'));

    const expectedActionsSuccess = [startAction, successAction];
    const expectedActionsError = [startAction, errorAction];

    it('creates @{namespace}/LIST_{identifier}_START', () => {

      const getMiezData = asyncActionCreator(mutate, NAMESPACE, IDENTIFIER, false, payload);

      return store.dispatch(getMiezData(ID))
        .then(() => { // return of async actions
          expect(store.getActions()[0]).toEqual(startAction);
        })
    });

    it('creates @{namespace}/LIST_{identifier}_SUCCESS', () => {

      const getMiezData = asyncActionCreator(mutate, NAMESPACE, IDENTIFIER, false, payload);

      return store.dispatch(getMiezData(ID))
        .then(() => { // return of async actions
          expect(store.getActions()).toEqual(expectedActionsSuccess);
        })
    });

    it('creates @{namespace}/LIST_{identifier}_ERROR', () => {

      const getMiezData = asyncActionCreator(mutate, NAMESPACE, IDENTIFIER, true);

      return store.dispatch(getMiezData(ID))
        .catch(() => { // return of async actions
          expect(store.getActions()).toEqual(expectedActionsError);
        });
    });
  });

  describe('reset', () => {
    const successAction = createAction(NAMESPACE, IDENTIFIER, 'RESET', 'SUCCESS');

    it('creates @{namespace}/RESET_{identifier}_SUCCESS', () => {

      const resetMiezData = reset(NAMESPACE, IDENTIFIER);

      store.dispatch(resetMiezData());
      expect(store.getActions()[0]).toEqual(successAction);
    });
  });
});
