export enum ActionTypes {
  FETCH = 0,
  LIST = 1,
  MUTATE = 2,
  RESET = 3,
  PUSH = 4,
  POP = 5,
  SET = 6,
  REMOVE = 7,
  MERGE = 8,
}

export const ACTION_TYPE_LITERALS = {
  FETCH: ActionTypes[ActionTypes.FETCH],
  LIST: ActionTypes[ActionTypes.LIST],
  MUTATE: ActionTypes[ActionTypes.MUTATE],
  RESET: ActionTypes[ActionTypes.RESET],
  PUSH: ActionTypes[ActionTypes.PUSH],
  POP: ActionTypes[ActionTypes.POP],
  SET: ActionTypes[ActionTypes.SET],
  REMOVE: ActionTypes[ActionTypes.REMOVE],
  MERGE: ActionTypes[ActionTypes.MERGE],
};

export type AsyncActionType = ActionTypes.FETCH | ActionTypes.LIST | ActionTypes.MUTATE | ActionTypes.RESET;
export type ActionType = ActionTypes.PUSH | ActionTypes.POP | ActionTypes.SET | ActionTypes.REMOVE | ActionTypes.MERGE;
