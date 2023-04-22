export default async function handler(req, res){
    const { body } = req;

    res.status(200).json({ message: 'success', body })
}