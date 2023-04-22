export default async function handler(req, res){

    const request = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer TEST-893561390454146-041815-7774e232ec658dfad1dfc2eeff836173-1279349380',
        },
        body: JSON.stringify({
            "transaction_amount": 10,
            "description": "Número da rifa",
            "payment_method_id": "pix",
            "payer": {
                "email": "edup.s@hotmail.com",
            },
            "notification_url": `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webhook}`
        })
    });

    const response = await request.json();

    const id = response.id;
    const qrCode = response.point_of_interaction.transaction_data.qr_code;

    fetch('https://api.mercadopago.com/v1/payments/'+id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer TEST-893561390454146-041815-7774e232ec658dfad1dfc2eeff836173-1279349380',
        },
        body: JSON.stringify({
            "capture": true,
            "status": "approved",
          })
    });

    res.status(200).json({ message: 'success', id, qrCode })
}