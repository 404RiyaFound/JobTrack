import axios from 'axios';

const dummyApi = axios.create({ baseURL: 'https://dummyjson.com' });

export const fetchDummyJobs = async () => {
  const { data } = await dummyApi.get('/products?limit=20');
  return data.products;
};

export const getCompanyLogoUrl = (domain) =>
  `https://logo.clearbit.com/${domain}`;
