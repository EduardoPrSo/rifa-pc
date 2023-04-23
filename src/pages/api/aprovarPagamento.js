export default async function handler(req, res){

    const { body } = req;

    await fetch(`https://sandbox.api.pagseguro.com/orders/${body.id}/pay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.NEXT_PUBLIC_PAGSEGURO_TOKEN,
        },
        body: JSON.stringify({
            "charges": [
                {
                    "reference_id": body.reference,
                    "description": "descricao do pagamento",
                    "amount": {
                        "value": body.value,
                        "currency": "BRL"
                    },
                    "payment_method": {
                        "type": "CREDIT_CARD",
                        "installments": 1,
                        "capture": true,
                        "card": {
                            "number": "4111111111111111",
                            "exp_month": "12",
                            "exp_year": "2026",
                            "security_code": "123",
                            "holder": {
                                "name": "Jose da Silva"
                            },
                            "store": false
                        }
                    },
                    "metadata": {
                        "Key": "value"
                    },
                }
            ]
        })
    });

    res.status(200).json({ message: 'success' })
}