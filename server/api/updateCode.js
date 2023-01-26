import pool from "../db/mysql";

export default defineEventHandler(async (event) => {
  let result = {};
  const params = await readBody(event);
  const { activationId, code, text } = params;
  //If empty params
  if (!activationId || !code || !text)
    return (result = {
      statusCode: 500,
      message: `Activation number, code and text cannot be null`,
    });
  
  let oldText;
  let oldCode;
  let query = `SELECT text, code FROM handAPI
    WHERE numActivation = '${activationId}'`;
  await pool
    .query(query)
    .then(async (data) => {
      if (!data[0]) {
        result = { message: "Activation code not found" };
        return;
      }
      oldText = data[0][0].text;
      oldCode = data[0][0].code;
  
      //If activation code not found

      //chech old values of text and code
      oldText ? (oldText = `${oldText};${text}`) : (oldText = text);
      oldCode ? (oldCode = `${oldCode};${code}`) : (oldCode = code);

      query = `UPDATE handAPI
      SET text = '${oldText}',
      code = '${oldCode}'
      WHERE numActivation = '${activationId}' 
      `;
      await pool.query(query).then(() =>{
        result = {"status":"SUCCESS"}
      }).catch(async(err) => await(result = err));
    })
    .catch(async(err) => await(result = err));
    
    if (result.status) {await $io.emit("message", "update")};
    
  return result;
});
