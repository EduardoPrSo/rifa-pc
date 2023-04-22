import styled from "styled-components"
import { useState } from "react";
import PIX from "react-qrcode-pix";

export default function Layout(){
    const [showForm, setShowForm] = useState(false);
    const [unavailableNumbers, setUnavaliableNumbers] = useState([1, 2, 3, 4, 5]);
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [payment, setPayment] = useState(false);
    const [configPix, setConfigPix] = useState('');

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
                    color: unavailableNumbers.includes(i) ? 'red' : selectedNumbers.includes(i) ? 'orange' : 'yellowgreen', 
                    border: unavailableNumbers.includes(i) ? '1.5px solid red' : `1.5px solid ${selectedNumbers.includes(i) ? 'orange' : 'yellowgreen'}`
                }}>{i}
            </Number>
        );
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
        console.log(selectedNumbers);
    }
    
    async function submitBuy(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const amount = selectedNumbers.length * 10;

        setPayment(amount);
    }

    function closeForm() {
        setPayment(false);
        setConfigPix('');
        setShowForm(false);
    }

    return (
        <LayoutContainer>
            <FormContainer display={showForm ? 'flex' : 'none'} onSubmit={(e)=>submitBuy(e)}>
                {!payment ? 
                <>
                    <h1>Formulário de compra</h1>
                    <h4 className="closeButton" onClick={closeForm}>x</h4>
                    <input type="text" id="name" name="name" placeholder="Digite seu nome" required />
                    <input type="email" id="email" name="email" placeholder="Digite seu e-mail" required />
                    <input type="text" id="phone" name="phone" placeholder="Digite seu telefone" required />
                    <button className="buyButton">COMPRAR</button>
                </>
                    : 
                    
                <>
                    <h4 className="closeButton" onClick={closeForm}>x</h4>
                    <h1>Faça seu pagamento</h1>
                    <PIX
                        pixkey='edup.s@hotmail.com'
                        merchant='Eduardo Soupinski'
                        city='Curitiba'
                        amount={10}
                        onLoad={setConfigPix}
                    />
                    <p className="inputPixKey" onClick={()=>navigator.clipboard.writeText(configPix)} readOnly>Clique para copiar a chave pix!</p>    
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
                    <p>Selecione os números que deseja comprar!</p>
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
    padding: 5%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border-radius: 10px;

    h1 {
        margin-bottom: 30px;
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
        border: 1px solid #000000cc;
        border-radius: 20px;
        padding: 5px;
        font-size: 1.2rem;
        outline: none;
        padding: 0 15px;
        margin-top: 10px;
        cursor: pointer
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
    height: auto;
    padding: 2%;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin-bottom: 10px;
`

const ConfigItem = styled.p`
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
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