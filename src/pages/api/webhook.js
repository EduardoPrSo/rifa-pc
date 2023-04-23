import { database } from "@/services/db"

export default async function handler(req, res){
    const conn = await database();

    const { body } = req;
    
    console.log(body);
    // const id = body.id;
    // const status = body.charges[0].status;

    // if(status === 'PAID'){
    //     try {
    //         await conn.query(`UPDATE payments SET status = 1 WHERE transaction_id = ${id}`)
    //     } catch(err) {
    //         console.log(err);
    //     } finally {
    //         await conn.end();
    //     }
    // }

    res.status(200).json({ message: 'success' })
}