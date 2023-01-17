import store from '../store'


export default defineEventHandler(() => {
  // API or DB request here

  //...

  //Or default list on server in server/store/index.js

  const {countries, services} = store

  //Return default
  return {
    countries: countries,
    services: services,
  };
});
