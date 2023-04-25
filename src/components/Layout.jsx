import styled from "styled-components"
import { useState } from "react";
import { InfinitySpin } from 'react-loader-spinner'
import { fetchAPI } from "@/services/fetchAPI";

export default function Layout({ blockedNumbers }){
    const [unavailableNumbers] = useState(blockedNumbers.numbers);
    const [payedNumbers] = useState(blockedNumbers.payedNumbers)
    const [selectedNumbers, setSelectedNumbers] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [payment, setPayment] = useState(false);
    const [loading, setLoading] = useState(false);

    const [pixKey, setPixKey] = useState('');
    const [pixImg, setPixImg] = useState('');
    const [pixKeyCopied, setPixKeyCopied] = useState(false);

    const [waitingPayment, setWaitingPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(false);
    
    const numbers = [];

    const pcConfig = [
        'RYZEN 5 3600',
        'B450 AORUS ELITE',
        '16GB DDR4 3000MHZ',
        'CX500',
        'GTX 1070 FTW',
        'SSD 240GB',
        'HD 1TB',
        'Ml240l RGB',
        'NZXT S340'
    ]

    for (let i = 1; i <= 350; i++) {
        numbers.push(
            <Number 
                key={i} 
                onClick={()=>selectNumber(i)} 
                style={{
                    color: unavailableNumbers.includes(i) ? payedNumbers.includes(i) ? 'red' : 'orange' : selectedNumbers.includes(i) ? '#45b6fe' : 'yellowgreen', 
                    border: unavailableNumbers.includes(i) ? payedNumbers.includes(i) ? '1.5px solid red' : '1.5px solid orange' : `1.5px solid ${selectedNumbers.includes(i) ? '#45b6fe' : 'yellowgreen'}`
                }}>{i}
            </Number>
        );
    }

    function teste(){
        return alert('teste');
    }

    function selectNumber(number) {
        if(unavailableNumbers.includes(number)) return;

        if(selectedNumbers.includes(number)) {
            setSelectedNumbers(selectedNumbers.filter((selectedNumber) => selectedNumber !== number));
            return;
        }
        setSelectedNumbers([...selectedNumbers, number]);
    }

    function buyButton() {
        if(selectedNumbers.length === 0) return;
        setShowForm(true);
    }
    
    async function submitBuy(e) {
        e.preventDefault();
        setLoading(true);
        const name = e.target.name.value;
        const email = e.target.email.value;
        const cpf = e.target.cpf.value;
        const tel = e.target.tel.value;

        const data = {
            name,
            email,
            cpf,
            tel,
            numbers: selectedNumbers,
        }

        const qrCodeData = await fetchAPI(`api/createPayment`, data)
        data['reference'] = qrCodeData.reference

        setPixKey(qrCodeData.pixKey);
        setPixImg(qrCodeData.qrCode);
        setWaitingPayment(true);
        await fetchAPI(`api/insertNumbers`, data)

        setPayment(true);
        setLoading(false);

        const checkPayment = setInterval(async () => {
            console.log(waitingPayment)
            if (!waitingPayment) return clearInterval(checkPayment);
            const response = await fetchAPI(`api/checkPayment`, {reference: qrCodeData.reference})
            if(response.status == '1') {
                clearInterval(checkPayment);
                setPaymentStatus(true);
            }
        }, 10000);
    }

    function closeForm() {
        setPayment(false);
        setPixKey('');
        setPixImg('');
        setShowForm(false);
        setPixKeyCopied(false);
        setWaitingPayment(false);
        setPaymentStatus(false);
        if (payment) {
            location.reload();
        }
    }

    const copyPixButton = {
        color: pixKeyCopied ? 'yellowgreen' : 'black',
        border: `1px solid ${pixKeyCopied ? 'yellowgreen' : '#000000cc'}`
    }

    return (
        <LayoutContainer>
            <FormContainer display={showForm ? 'flex' : 'none'} onSubmit={(e)=>submitBuy(e)}>
                {!payment ? 
                <>
                    {!loading ? 
                    <>
                        <h1>Formulário de compra</h1>
                        <h4 className="closeButton" onClick={closeForm}>x</h4>
                        <input type="text" id="name" name="name" placeholder="Digite seu nome" required />
                        <input type="email" id="email" name="email" placeholder="Digite seu e-mail" required />
                        <input type="text" id="cpf" name="cpf" placeholder="Digite seu CPF" required onInput={(e)=>{e.target.value = e.target.value.replace(/[^0-9]+/g, '')}} />
                        <input type="text" id="tel" name="tel" placeholder="Digite seu telefone" required onInput={(e)=>{e.target.value = e.target.value.replace(/[^0-9]+/g, '')}} />
                        <p>O seu total é <span className="spanPrice">R${selectedNumbers.length * 10},00</span></p>
                        <button className="buyButton">COMPRAR</button>
                    </> 
                        : 
                    <>
                        <h1>Aguarde...</h1>  
                        <InfinitySpin 
                            width='200'
                            color="#000000b0"
                        />
                    </>}
                </>
                    : 
                <>
                    {!paymentStatus ? 
                    <>
                        <h4 className="closeButton" onClick={closeForm}>x</h4>
                        <h1>Faça seu pagamento!</h1>
                        <img src={pixImg} />
                        <p className="inputPixKey" onClick={()=>{navigator.clipboard.writeText(pixKey);setPixKeyCopied(true)}} readOnly style={copyPixButton}>{!pixKeyCopied ? 'Clique para copiar a chave pix!' : 'Copiado!'}</p>  
                        <p className="paymentObs">Se o pagamento não for realizado em 10 minutos os números voltam para a lista!</p>  
                    </>
                        :
                    <>
                        <h4 className="closeButton" onClick={closeForm}>x</h4>
                        <h1>Pagamento aprovado!</h1>
                        <h1>Muito obrigado e boa sorte!</h1>
                    </>}
                </>}
            </FormContainer>
            <h1>Rifinha do PC</h1>
            <ContentDiv>
                <DescriptionContainer>
                    <AnunceImage src="./IMG_1433.jpg" alt="Computador Gamer" />
                    <h2>Configuração do PC</h2>
                    <ConfigDiv>
                        {pcConfig.map((config, index) => {
                            return <ConfigItem key={index}>{config}</ConfigItem>
                        })}
                    </ConfigDiv>
                </DescriptionContainer>
                <Numbersdiv>
                    <p>Cada número custa R$10,00</p>
                    <NumbersContainer>
                        {numbers.map((number) => {
                            return number
                        })}
                    </NumbersContainer>
                    <ButtonContainer>
                        <Button color={'red'} onClick={()=>setSelectedNumbers([])}>LIMPAR</Button>
                        <Button color={'yellowgreen'} onClick={buyButton}>COMPRAR</Button>
                    </ButtonContainer>
                </Numbersdiv>
            </ContentDiv>
        </LayoutContainer>
    )
}

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    gap: 20px;
    margin-bottom: 100px;
    position: absolute;

    @media screen and (min-width: 1024px) {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        min-height: auto;

        h1 {
            width: 100%;
            text-align: center;
        }
    }
`

const FormContainer = styled.form`
    position: fixed;
    top: 20%;
    display: ${props => props.display};
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 95%;
    height: auto;
    padding: 3%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border-radius: 10px;

    h1 {
        margin-bottom: 30px;
        font-size: 8vw;

        @media screen and (min-width: 1024px) {
            font-size: 1.5rem;
        }
    }

    h2 {
        margin: 30px 0 30px 0;
    }

    input {
        width: 90%;
        height: 40px;
        border: 1px solid #000000cc;
        border-radius: 20px;
        padding: 5px;
        font-size: 1.2rem;
        outline: none;
        padding: 0 15px;
    }

    .closeButton{
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 1.3rem;
        cursor: pointer;

        &:hover {
            color: red;
        }
    }

    .buyButton{
        width: 90%;
        height: 4.5vh;
        background-color: #fff;
        border: 1px solid yellowgreen;
        color: yellowgreen;
        border-radius: 20px;
        transition: .3s;
        font-size: 5vw;
        cursor: pointer;

        &:hover {
            background-color: yellowgreen;
            color: #fff;
        }

        @media screen and (min-width: 1024px) {
            font-size: 1.2vw;
            margin-bottom: 0;
        }
    }

    @media screen and (min-width: 1024px) {
        top: 15%;
        width: 30%;
    }

    span{
        color: blue;
        cursor: pointer;
        text-decoration: underline;
    }

    .inputPixKey{
        display: flex;
        align-items: center;
        height: 40px;
        color: ${props => props.color ? 'yellowgreen' : 'black'};
        border: 1px solid ${props => props.color ? 'yellowgreen' : '#000000cc'};
        border-radius: 20px;
        padding: 5px;
        font-size: 1.2rem;
        outline: none;
        padding: 0 15px;
        margin-top: 10px;
        cursor: pointer
    }

    img{
        width: 60%;
        height: auto;
    }

    .paymentObs{
        font-size: 0.9rem;
        text-align: center;
    }

    .spanPrice{
        text-decoration: none;
        color: black;
        font-weight: 600;
    }
`

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: auto;

    @media screen and (min-width: 1024px) {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
`

const DescriptionContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    h2 {
        margin-top: 10px;
        width: 100%;
        text-align: center;
    }

    @media screen and (min-width: 1024px) {
        display: flex;
        width: 30%;
        height: 70vh;
        border-radius: 10px;
    }
`

const ConfigDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 2%;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin-bottom: 10px;
`

const ConfigItem = styled.p`
    white-space: nowrap;
    width: auto;
    display: flex;
    padding: 1% 2%;
    border: 1px solid #000000cc;
    color: #000000cc;
    border-radius: 20px;
    
    @media screen and (min-width: 1024px) {
        font-size: .8vw;
        font-weight: 600;
        padding: 1%;
    }
`

const AnunceImage = styled.img`
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 10px 10px 0 0;
    box-shadow: none;

    @media screen and (min-width: 1024px) {
        width: 100%;
    }
`

const Numbersdiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-wrap: wrap;
    width: 95%;
    align-items: center;

    @media screen and (min-width: 1024px) {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex-wrap: wrap;
        width: 40%;
        height: 70vh;
        padding: 2%;
        align-items: center;
        justify-content: space-around;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        padding: 1% 2%;

        p {
            width: 100%;
            text-align: center;
        }
    }
`

const NumbersContainer = styled.div`
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    width: 95%;
    height: 35vh;
    overflow-y: scroll;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    padding: 2%;
    border-radius: 10px;

    @media screen and (min-width: 1024px) {
        width: 100%;
        height: 50vh;
        justify-content: center;
        box-shadow: none;
        border: 1px solid rgba(0, 0, 0, 0.199);
    }
`

const Number = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20.25vw;
    height: 4.5vh;
    background-color: #fff;
    border: 1.5px solid yellowgreen;
    color: yellowgreen;
    font-size: 1.7rem;
    border-radius: 20px;
    cursor: pointer;

    @media screen and (min-width: 1024px) {
        width: 7vw;
    }
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 95%;
    gap: 5px;
`

const Button = styled.button`
    width: 50%;
    height: 4.5vh;
    background-color: #fff;
    border: 1px solid ${props => props.color};
    color: ${props => props.color};
    border-radius: 20px;
    transition: .3s;
    margin-bottom: 60px;
    font-size: 5vw;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.color};
        color: #fff;
    }

    @media screen and (min-width: 1024px) {
        margin-bottom: 0;
        font-size: 1.2vw;
    }
`