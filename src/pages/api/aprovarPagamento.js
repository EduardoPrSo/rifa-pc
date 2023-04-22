export default async function handler(req, res){

    const request = await fetch('https://api.mercadopago.com/v1/payments', {
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

    const response = await request.json();

    res.status(200).json({ message: 'success', response })
}