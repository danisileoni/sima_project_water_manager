import { isValid, parse } from 'date-fns';

export const isValidDateYYYY = (timeStr: string) => {
  const today = new Date();
  return {
    date: parse(timeStr, 'dd-MM-yyyy', today),
    valid: isValid(parse(timeStr, 'dd-MM-yyyy', today)),
  };
};
