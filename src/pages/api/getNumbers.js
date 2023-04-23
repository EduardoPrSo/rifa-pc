import { database } from "@/services/db"

function getNumbersFromArray(array) {
    const numbers = [];
    for (let i = 0; i < array.length; i++) {
        if (typeof array[i].number === 'number') {
            numbers.push(array[i].number);
        }
    }
    return numbers;
}

export default async function handler(req, res) {
    const conn = await database();

    console.log(req.headers.referer)

    if (req.headers.referer !== `${process.env.NEXT_PUBLIC_API_BASE_URL}/`) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }

    try {
        const numbers = await conn.query(`SELECT number FROM numbers`)
        res.status(200).json({ numbers: getNumbersFromArray(numbers[0]) })
    } catch(err) {
        console.log(err);
    } finally {
        await conn.end();
    }
}
  