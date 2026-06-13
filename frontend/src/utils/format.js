export const money = (value) =>
  new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(Number(value || 0));

export const dateTime = (value) =>
  new Date(value).toLocaleString('en-EG', { dateStyle: 'medium', timeStyle: 'short' });
