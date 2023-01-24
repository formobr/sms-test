import pool from "../db/mysql";

export default defineEventHandler(async (event) => {
  const req = getQuery(event);
  const { numActivation } = req;
  const query = `UPDATE handAPI SET hidden = 1 WHERE numActivation = '${numActivation}'`;
  await pool
    .query(query)
    .catch((err) => console.log(err));
  await $io.emit("message", "update");
  return 'Ok';
});
