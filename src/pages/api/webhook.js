import { database } from "@/services/db"
import { JSDOM } from 'jsdom';

export default async function handler(req, res){
    const conn = await database();

    const { body } = req;
    
    const notificationCode = body.notificationCode;

    const request = await fetch(`https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=edup.s@hotmail.com&token=1379F92EA26C4E9BAC3DEBFDEE8E4310`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml',
        }
    });

    const response = await request.text();
    const dom = new JSDOM(response);
    
    const reference = dom.window.document.getElementsByTagName('reference')[0].textContent;
    const status = dom.window.document.getElementsByTagName('status')[0].textContent;

    console.log(reference, status)

    res.status(200).json({ message: 'success' })
}