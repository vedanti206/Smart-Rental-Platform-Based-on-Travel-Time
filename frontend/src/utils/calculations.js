export const calculateTotalCost = (rent, distanceKm, workingDays = 22) => {
  const travelCostPerDay = distanceKm * 2 * 0.50;
  const monthlyTravelCost = travelCostPerDay * workingDays;
  
  const estimatedUtilities = rent * 0.10;

  return {
    rent,
    travel: Math.round(monthlyTravelCost),
    utilities: Math.round(estimatedUtilities),
    total: Math.round(rent + monthlyTravelCost + estimatedUtilities)
  };
};

export const predictCommuteCondition = (distanceKm, timeMins) => {
  if (!distanceKm || !timeMins) return 'Unknown';
  
  const speed = distanceKm / (timeMins / 60);
  if (speed > 40) return 'Light';
  if (speed > 20) return 'Moderate';
  return 'Heavy';
};
