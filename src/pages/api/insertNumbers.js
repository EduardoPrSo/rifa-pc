import { database } from "@/services/db"

function extractNumbers(array){
    let numbersExtracted = '';
    array.map((number) => {
        numbersExtracted += `${number}, `;
    })
    
    numbersExtracted = numbersExtracted.slice(0, -2);
    return numbersExtracted;
}

export default async function handler(req, res) {
    const conn = await database();
    const { body } = req;

    const currentTime = Math.floor(Date.now() / 1000);

    try {
        body.numbers.map(async (number) => {
            await conn.query(`INSERT INTO numbers (number, name, email, cpf, tel, reference, created_at) VALUES ('${number}', '${body.name}', '${body.email}', '${body.cpf}', '${body.tel}', '${body.reference}', '${currentTime}')`)
        })

        res.status(200).json({ message: 'success' })
    } catch(err) {
        console.log(err);
    } finally {
        await conn.end();
    }
}
  