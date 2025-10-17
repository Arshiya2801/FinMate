export const formatCurrency = (amount, currencyCode = 'USD') => {
  if (typeof amount !== 'number') {
    amount = 0;
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};