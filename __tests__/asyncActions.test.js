import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { getById } from '../src/store/asyncActions';
import nock from 'nock'
import expect from 'expect' // You can use any testing library
import Promise from 'es6-promise';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('asyncActions', () => {

  const ID = 123;
  const payload = { id: ID, a: 1, b: 2, c: { d: 3 } };
  const startAction = { type: '@MIEZ/FETCH_MYDATA_START' };
  const successAction = { type: '@MIEZ/FETCH_MYDATA_SUCCESS', payload};
  const errorAction = { type: '@MIEZ/FETCH_MYDATA_ERROR', payload: new Error('SomeError'), error: true};

  const expectedActionsSuccess = [ startAction, successAction ];
  const expectedActionsError = [ startAction, errorAction ];

  it('creates @{namespace}/FETCH_{identifier}_START', () => {

    const getMiezData = getById('miez', 'mydata', (id) => new Promise((resolve, reject) => {
      resolve(payload);
    }));

    const store = mockStore({});

    return store.dispatch(getMiezData(ID))
      .then(() => { // return of async actions
        expect(store.getActions()[0]).toEqual(startAction);
      })
  });

  it('creates @{namespace}/FETCH_{identifier}_SUCCESS', () => {

    const getMiezData = getById('miez', 'mydata', (id) => new Promise((resolve, reject) => {
      resolve(payload);
    }));

    const store = mockStore({});

    return store.dispatch(getMiezData(ID))
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActionsSuccess);
      })
  });

  it('creates @{namespace}/FETCH_{identifier}_ERROR', () => {

    const getMiezData = getById('miez', 'mydata', (id) => new Promise((resolve, reject) => {
      reject(new Error('SomeError'));
    }));

    const store = mockStore({});

    return store.dispatch(getMiezData(ID))
      .catch(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActionsError);
      })
  })

});
