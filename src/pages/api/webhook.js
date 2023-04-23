import { database } from "@/services/db"

export default async function handler(req, res){
    const conn = await database();

    const { body } = req;
    
    const notificationCode = body.notificationCode;

    const request = await fetch(`https://ws.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=edup.s@hotmail.com&token=1379F92EA26C4E9BAC3DEBFDEE8E4310`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    console.log(request)

    res.status(200).json({ message: 'success' })
}