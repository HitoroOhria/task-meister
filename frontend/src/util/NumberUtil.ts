export const total = (list: number[]): number => {
  return list.reduce((preNumber, curNumber) => sum(preNumber, curNumber), 0);
};

export const sum = (first: number, second: number): number => {
  return first + second;
};

export const pickBiggerNumber = (first: number, second: number): number => {
  return first > second ? first : second;
};
