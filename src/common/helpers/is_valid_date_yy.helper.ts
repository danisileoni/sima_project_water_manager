import { isValid, parse } from 'date-fns';

export const isValidDateYY = (timeStr: string) => {
  const today = new Date();
  return {
    date: parse(timeStr, 'dd/MM/yy', today),
    valid: isValid(parse(timeStr, 'dd/MM/yy', today)),
  };
};
