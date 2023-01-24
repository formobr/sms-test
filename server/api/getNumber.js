import axios from "axios";
import pool from "../db/mysql";

export default defineEventHandler(async (event) => {

  const result = {
    message: null,
    error: null,
  };
  //get params
  const query = getQuery(event);
  const { country, provider, service, shortNameService, clientId, login, apiPassword } = query;
  //check client ID and password != null
  if (!apiPassword && !clientId) {
    result.message = "Please enter your client ID and password";
    result.error = true;
    return result;
  }

  //call api Get a number
  let params = {
    clientId: login,
    apiPassword: apiPassword,
    service: service,
    detail: {
      country: country,
      provider: provider
    },
  };
  if (provider === 'ANY') {
    params = {
      clientId: login,
      apiPassword: apiPassword,
      service: service,
      detail: {
        country: country
      },
    };
  }
  await axios
    .post("https://proxy.otp-service.online/v1/GetNumber", params)
    .then(async (data) => {
      const rows = data.data;
      const { activationId, ammount, number, status, error } = rows;
      const date = new Date(Date.now());
      //insert information to DB
      const query = `INSERT INTO handAPI (numActivation, ammount, service, shortNameService, number, status, error, clientID, id, datetime, operator)
        VALUES ('${activationId}', ${ammount}, '${shortNameService}', '${service}',${number}, ${status}, ${error}, ${clientId}, '${login}', '${date.toISOString().slice(0, 19).replace('T', ' ')}', '${provider}')`;
      await pool.query(query).then(() => {
        // on success
        result.message = `Saved in DB`;
      });
    })
    .catch((err) => {
      //on error
      console.log(err);
      result.message = "Some error accured, please check the logs";
      result.error = true;
    });
  return result;
});
