import { sendMail } from "@/services/sendMail";
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
            await conn.query(`INSERT INTO numbers (number, name, email, cpf, reference, created_at) VALUES ('${number}', '${body.name}', '${body.email}', '${body.cpf}', '${body.reference}', '${currentTime}')`)
        })

        // await sendMail({        
        //     to: body.email,
        //     subject: 'Muito obrigado por comprar!',
        //     html: `
        //         <h1>Olá, ${body.name}!</h1>
        //         <p>Seu pedido foi realizado com sucesso e seus números são: ${extractNumbers(body.numbers)}</p>
        //         <p>Em breve entraremos em contato para confirmar o pagamento!</p>
        //         <p>Muito obrigado por comprar seus números e boa sorte!</p>
        //     `,
        // });

        // await sendMail({        
        //     to: 'edup.s@hotmail.com',
        //     subject: 'Nova compra de rifa',
        //     html: `
        //         <h2>Dados:</h2>
        //         <p>Nome: ${body.name}</p>
        //         <p>Email: ${body.email}</p>
        //         <p>CPF: ${body.cpf}</p>
        //         <p>Números: ${extractNumbers(body.numbers)}</p>
        //     `,
        // });

        res.status(200).json({ message: 'success' })
    } catch(err) {
        console.log(err);
    } finally {
        await conn.end();
    }
}
  