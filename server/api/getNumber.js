import axios from "axios";
import pool from "../db/";

export default defineEventHandler(async (event) => {
  const result = {
    message: null,
    error: null,
  };
  //get params
  const query = getQuery(event);
  const { country, service, shortNameService, clientId, login, apiPassword } = query;
  
  //check client ID and password != null
  if (!apiPassword && !clientId) {
    result.message = "Please enter your client ID and password";
    result.error = true;
    return result;
  }

  //call api Get a number
  const params = {
    clientId: login,
    apiPassword: apiPassword,
    service: service,
    detail: {
      country: country,
    },
  };
  await axios
    .post("https://proxy.otp-service.online/v1/GetNumber", params)
    .then(async (data) => {
      const rows = data.data;
      const { activationId, ammount, number, status, error } = rows;

      //insert information to DB
      const query = `INSERT INTO handapi (numactivation, ammount, service, shortnameservice, number, status, error, clientId, id)
        VALUES ('${activationId}', ${ammount}, '${shortNameService}', '${service}',${number}, ${status}, ${error}, ${clientId}, '${login}')`;
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
