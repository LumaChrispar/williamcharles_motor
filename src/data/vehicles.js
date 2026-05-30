import { getShowroomVehicles, getVehicleById as fetchCarApiVehicle } from './carApi';

let cachedVehicles = null;
let fetchingPromise = null;

export async function fetchAllVehicles() {
  if (cachedVehicles) return cachedVehicles;
  if (fetchingPromise) return fetchingPromise;
  
  fetchingPromise = getShowroomVehicles().then(cars => {
    cachedVehicles = cars;
    return cachedVehicles;
  }).catch(err => {
    console.error('Failed to fetch from CarAPI:', err);
    return []; // Return empty array on failure
  });
  
  return fetchingPromise;
}

export const getAvailableVehicles = async () => {
  const cars = await fetchAllVehicles();
  return cars.filter(v => !v.sold);
};

export const getSoldVehicles = async () => {
  const cars = await fetchAllVehicles();
  return cars.filter(v => v.sold);
};

export const getFeaturedVehicles = async () => {
  const cars = await fetchAllVehicles();
  return cars.filter(v => v.featured && !v.sold).slice(0, 8);
};

export const getVehicleById = async (id) => {
  const cars = await fetchAllVehicles();
  return cars.find(v => v.id === id) || await fetchCarApiVehicle(id);
};

export const getRelatedVehicles = async (id, limit = 4) => {
  const current = await getVehicleById(id);
  if (!current) return [];
  const cars = await fetchAllVehicles();
  return cars
    .filter(v => v.id !== current.id && !v.sold)
    .sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      if (a.make === current.make) scoreA += 3;
      if (b.make === current.make) scoreB += 3;
      if (a.bodyType === current.bodyType) scoreA += 2;
      if (b.bodyType === current.bodyType) scoreB += 2;
      if (a.fuelType === current.fuelType) scoreA += 1;
      if (b.fuelType === current.fuelType) scoreB += 1;
      return scoreB - scoreA;
    })
    .slice(0, limit);
};

export const getAllMakes = async () => {
  const cars = await fetchAllVehicles();
  return [...new Set(cars.filter(v => !v.sold).map(v => v.make))];
};

export const getAllBodyTypes = async () => {
  const cars = await fetchAllVehicles();
  return [...new Set(cars.filter(v => !v.sold).map(v => v.bodyType))];
};
