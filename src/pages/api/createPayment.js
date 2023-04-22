import { QrCodePix } from 'qrcode-pix';

export default async function handler(req, res) {
    const {body} = req;

    const qrCodePix = QrCodePix({
        version: '01',
        key: 'edup.s@hotmail.com', //or any PIX key
        name: 'Eduardo Prudente Soupinski',
        city: 'CURITIBA',
        message: 'Pay me :)',
        cep: '82300660',
        value: 150.99,
    });

    qrCodePix.base64().then((res) => {
        console.log(res);
    })

    res.status(200).json({message: 'success'})
}