import { camelCase, get } from 'lodash';
import { ACTION_TYPE_LITERALS } from './ActionTypes';
import { Action } from './Action';
import update from 'immutability-helper';

const INITIAL_STATE = {};

const ACTION_TYPES: string[] = [
  ACTION_TYPE_LITERALS.PUSH,
  ACTION_TYPE_LITERALS.POP,
  ACTION_TYPE_LITERALS.SET,
  ACTION_TYPE_LITERALS.REMOVE,
  ACTION_TYPE_LITERALS.MERGE,
];

export default (state:any = INITIAL_STATE, action: Action) => {
  const { type, payload } = action;

  const actionTypeRegExp =
    new RegExp('@([A-Z0-9_]+)\/' + // eslint-disable-line
      `(${ACTION_TYPES.join('|')})` +
      '\_([A-Z\_]+)'); // eslint-disable-line

  const matchResult = type.match(actionTypeRegExp);

  if (matchResult) {
    const [
      match, // eslint-disable-line
      namespace,
      actionType, // eslint-disable-line
      identifier,
    ] = matchResult;

    const itemNamespace = camelCase(namespace);
    const itemIdentifier = camelCase(namespace);

    if (actionType === ACTION_TYPE_LITERALS.PUSH) {
      const list = get(state, [itemNamespace, itemIdentifier], []);

      return {
        ...state,
        [itemNamespace]: {
          [itemIdentifier]: [
            ...list, payload
          ]
        }
      }
    }

    if (actionType === ACTION_TYPE_LITERALS.POP) {
      const list = get(state, [itemNamespace, itemIdentifier], []);

      return {
        ...state,
        [itemNamespace]: {
          [itemIdentifier]: list.slice(0, -1)
        }
      };
    }

    if (actionType === ACTION_TYPE_LITERALS.MERGE) {
      return update(state, {
        [itemNamespace]: {
          [itemIdentifier]: {$merge: payload}
        }
      });
    }

    if (actionType === ACTION_TYPE_LITERALS.SET) {
      return update(state, {
        [itemNamespace]: {
          [itemIdentifier]: {$set: payload}
        }
      });
    }

    if (actionType === ACTION_TYPE_LITERALS.REMOVE) {
      return update(state, {
        [itemNamespace]: {$unset: [itemIdentifier]}
      });
    }
  }

  return state;
}
