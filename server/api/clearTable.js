import pool from "../db/mysql";

export default defineEventHandler(async () => {
  const query = `DELETE FROM handAPI`;
  await pool.query(query)
  await $io.emit("message", "update");

  return 'Table cleared'
});
