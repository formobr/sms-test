import pool from "../db/";

export default defineEventHandler(async (event) => {
    let result
    const params = getQuery(event);
    const {login} = params
    const date = new Date(Date.now())

    //Get fields from Db
    const query = `SELECT datetime, numactivation, clientid, number, service, code  FROM handapi
    WHERE id = '${login}'`
    await pool.query(query).then((data) => result = data.rows).catch((err) => console.log(err))
    return result
})