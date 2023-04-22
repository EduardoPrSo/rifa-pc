import Layout from "@/components/Layout"
import { fetchAPI } from "@/services/fetchAPI"

export default function Home({ unavailableNumbers }) {
    return (
        <Layout blockedNumbers={ unavailableNumbers }/>
    )
}

export const getServerSideProps = async () => {

    const unavailableNumbers = await fetchAPI("/api/getNumbers")
    const numbers = unavailableNumbers.numbers

    return {
        props: {
            unavailableNumbers: numbers
        }
    }
}
