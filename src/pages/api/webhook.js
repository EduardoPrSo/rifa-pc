const sdk = require('api')('@devpagseguro/v1.0#c6eeq1pl0qo9ub0');
import { database } from "@/services/db"

export default async function handler(req, res){
    const conn = await database();

    const { body } = req;
    
    const notificationCode = body.notificationCode;

    console.log(notificationCode)

    sdk.consultaPeloCDigoDeNotificacao({email: 'edup.s@hotmail.com', token: '1379F92EA26C4E9BAC3DEBFDEE8E4310', notificationcode: notificationCode})
      .then(({ data }) => console.log(data))
      .catch(err => console.error(err));

    res.status(200).json({ message: 'success' })
}