import { database } from "@/services/db"

function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
  
    code = code.substr(0, 3) + '-' + code.substr(3);
    return code;
}

export default async function handler(req, res){
    const conn = await database();
    const { body } = req;

    const request = await fetch(process.env.NEXT_PUBLIC_PAGSEGURO_CREATE_PAYMENT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.NEXT_PUBLIC_PAGSEGURO_TOKEN,
        },
        body: JSON.stringify({
            "reference_id": generateCode(),
            "customer": {
                "name": body.name,
                "email": body.email,
                "tax_id": body.cpf,
            },
            "items": [
                {
                    "name": "Números",
                    "quantity": body.numbers.length,
                    "unit_amount": 10
                }
            ],
            "qr_codes": [
                {
                    "amount": {
                        "value": body.amount * 100
                    },
                }
            ],
            "notification_urls": [
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webhook}`
            ]

        })
    });

    const response = await request.json();

    const id = response.id;
    const reference = response.reference_id;
    const qrCode = response.qr_codes[0].links[0].href;
    const pixKey = response.qr_codes[0].text;

    try{
        await conn.query(`INSERT INTO payments (reference, transaction_id) VALUES ('${reference}', '${id}')`)
    } catch (error) {
        console.log(error)
    } finally {
        conn.end();
    }

    res.status(200).json({ qrCode, pixKey })
}