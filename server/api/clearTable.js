import pool from "../db/";

export default defineEventHandler(async () => {
  const query = `DELETE FROM handapi`;
  await pool.query(query)
  await $io.emit("message", "update");

  return 'Table cleared'
});
