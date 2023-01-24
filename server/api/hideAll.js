import pool from "../db/mysql";

export default defineEventHandler(async (event) => {
  const req = getQuery(event);
  const { id } = req;
  const query = `UPDATE handAPI SET hidden = 1 WHERE id = '${id}'`;
  await pool
    .query(query)
    .catch((err) => console.log(err));
  await $io.emit("message", "update");
  return 'Ok';
});
