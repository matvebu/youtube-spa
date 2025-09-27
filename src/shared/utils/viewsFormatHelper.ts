export const viewsFormatHelper = (viewsCount: string) => {
  const number = Number(viewsCount);
  return number > 10 ** 6
    ? Math.floor(number / 10 ** 6) + 'M'
    : number > 10 ** 3
      ? Math.floor(number / 10 ** 3) + 'K'
      : number;
};
