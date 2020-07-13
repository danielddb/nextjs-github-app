export const pluralizeContributions = (count: number) => {
  return `contribution${count !== 1 ? 's' : ''}`;
};
