enum Statuses {
  START = 0,
  SUCCESS = 1,
  ERROR= 2,
}

export const STATUS_LITERALS = {
  START: Statuses[Statuses.START],
  SUCCESS: Statuses[Statuses.SUCCESS],
  ERROR: Statuses[Statuses.ERROR],
};

export type Status = Statuses.START | Statuses.SUCCESS | Statuses.ERROR;

export default Statuses;
