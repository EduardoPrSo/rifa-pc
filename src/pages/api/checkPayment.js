import { database } from "@/services/db"

export default async function handler(req, res) {
    const conn = await database();
    const { body } = req;

    try {
        let status = await conn.query(`SELECT status FROM payments WHERE reference = '${body.reference}'`)
        status = status[0][0].status;
        
        res.status(200).json({ status })
        return
    } catch(err) {
        console.log(err);
    } finally {
        await conn.end();
    }
}
  