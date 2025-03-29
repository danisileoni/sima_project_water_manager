import { isValid, parse } from 'date-fns';

export const isValidTime = (timeStr: string) => {
  const today = new Date();
  return isValid(parse(timeStr, 'HH:mm', today));
};
