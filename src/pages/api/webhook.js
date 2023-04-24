import { database } from "@/services/db"
import { JSDOM } from 'jsdom';

export default async function handler(req, res){
    const conn = await database();

    const { body } = req;
    
    const id = body.id;
    const reference_id = body.reference_id;
    const status = body.charges[0].status;

    if (status !== 'PAID') {
        res.status(200).json({ message: 'success' })
        return;
    }

    try {
        await conn.query(`UPDATE payments SET status = '1' WHERE reference = '${reference_id}' AND transaction_id = '${id}'`);
        await conn.query(`UPDATE numbers SET status = '1' WHERE reference = '${reference_id}'`);
    } catch(err) {
        console.log(err);
    } finally {
        await conn.end();
    }

    res.status(200).json({ message: 'success' })

    // const notificationCode = body.notificationCode;
    // const apiURL = `${process.env.NEXT_PUBLIC_PAGSEGURO_WEBHOOK_URL}/${notificationCode}?email=${process.env.NEXT_PUBLIC_PAGSEGURO_EMAIL}&token=${process.env.NEXT_PUBLIC_PAGSEGURO_TOKEN}`

    // const request = await fetch(apiURL, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/xml',
    //     }
    // });

    // const response = await request.text();
    // const dom = new JSDOM(response);
    
    // const reference = dom.window.document.getElementsByTagName('reference')[0].textContent;
    // const status = dom.window.document.getElementsByTagName('status')[0].textContent;
}