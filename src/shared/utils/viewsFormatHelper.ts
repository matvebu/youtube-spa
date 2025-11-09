export const viewsFormatHelper = (viewsCount: string) => {
  const number = Number(viewsCount);

  const formatted = new Intl.NumberFormat('en', { notation: 'compact' }).format(number);
  return formatted;
};
