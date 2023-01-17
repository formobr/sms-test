import pool from "../db/";

export default defineEventHandler(async (event) => {
  let result = {};
  const params = getQuery(event);
  const { numActivation, number, code, text } = params;
  //If empty params
  if (!numActivation || !number || !code || !text)
    return (result = {
      statusCode: 500,
      message: `Activation number, number, code and text cannot be null`,
    });
  const date = new Date(Date.now());
  let oldText;
  let oldCode;
  let query = `SELECT text, code FROM handapi
    WHERE numActivation = '${numActivation}'`;
  await pool
    .query(query)
    .then(async (data) => {
      if (!data.rows[0]) {
        result = { message: "Activation code not found" };
        return;
      }
      oldText = data.rows[0].text;
      oldCode = data.rows[0].code;
      //If activation code not found

      //chech old values of text and code
      oldText ? (oldText = `${oldText};${text}`) : (oldText = text);
      oldCode ? (oldCode = `${oldCode};${code}`) : (oldCode = code);

      query = `UPDATE handapi
      SET datetime = '${date.toISOString()}',
      number = ${number},
      text = '${oldText}',
      code = '${oldCode}'
      WHERE numactivation = '${numActivation}' 
      `;
      await pool.query(query).then(() =>{
        result = {message: 'Update succsessful', statusCode: 200}
      }).catch(async(err) => await(result = err));
    })
    .catch(async(err) => await(result = err));
    if (result.statusCode) $io.emit("message", "update");
  
  return result;
});
