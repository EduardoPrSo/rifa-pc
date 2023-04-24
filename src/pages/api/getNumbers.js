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

    try {
        const getNumbers = await conn.query(`SELECT number, created_at, reference FROM numbers WHERE status = '0'`)
        const numbersData = getNumbers[0];
        numbersData.forEach(async (item) => {
            if (item.created_at + 600 < Math.floor(Date.now() / 1000)) {
                await conn.query(`DELETE FROM numbers WHERE number = '${item.number}'`)
                await conn.query(`DELETE FROM payments WHERE reference = '${item.reference}'`)
            }
        });

        let payedNumbers = await conn.query("SELECT number FROM numbers WHERE status = '1'")
        let nonPayedNumbers = await conn.query("SELECT number FROM numbers WHERE status = '0'")

        payedNumbers = getNumbersFromArray(payedNumbers[0])
        nonPayedNumbers = getNumbersFromArray(nonPayedNumbers[0])
        const numbers = payedNumbers.concat(nonPayedNumbers)

        res.status(200).json({ numbers, payedNumbers, nonPayedNumbers })
        return
    } catch(err) {
        console.log(err);
    } finally {
        await conn.end();
    }
}
  