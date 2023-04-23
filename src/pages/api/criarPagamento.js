import { database } from "@/services/db"

export default async function handler(req, res){
    const conn = await database();

    const request = await fetch('https://sandbox.api.pagseguro.com/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '1379F92EA26C4E9BAC3DEBFDEE8E4310',
        },
        body: JSON.stringify({
            "reference_id": "ex-00001",
            "customer": {
                "name": "Jose da Silva",
                "email": "email@test.com",
                "tax_id": "12345678909",
                "phones": [
                    {
                        "country": "55",
                        "area": "11",
                        "number": "999999999",
                        "type": "MOBILE"
                    }
                ]
            },
            "items": [
                {
                    "name": "nome do item",
                    "quantity": 1,
                    "unit_amount": 100
                }
            ],
            "qr_codes": [
                {
                    "amount": {
                        "value": 500
                    },
                    "expiration_date": "2023-08-29T20:15:59-03:00",
                }
            ],
            "shipping": {
                "address": {
                    "street": "Avenida Brigadeiro Faria Lima",
                    "number": "1384",
                    "complement": "apto 12",
                    "locality": "Pinheiros",
                    "city": "São Paulo",
                    "region_code": "SP",
                    "country": "BRA",
                    "postal_code": "01452002"
                }
            },
            "notification_urls": [
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webhook}`
            ]

        })
    });

    const response = await request.json();

    const id = response.id;
    const qrCode = response.qr_codes[0].links[0].href;
    const pixKey = response.qr_codes[0].text;

    try{
        await conn.query(`INSERT INTO payments (transaction_id) VALUES ('${id}')`)
    } catch (error) {
        console.log(error)
    } finally {
        conn.end();
    }

    res.status(200).json({ message: 'success' })
}