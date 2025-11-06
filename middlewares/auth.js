import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {

    //console.log(request.headers)
  
    const token = req.headers.authorization
    //const authToken = req.headers.authorization.split(' ')[1]

    if(!token){
        return res.status(401).json({messege: 'Acesso Negado'})
    }
    
    //const token = authToken.split(' ')[1]
    // dentro do try: const decode = jwt.verify(token, JWT_SECRET)
    try{
        const decode = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)
        //console.log(decode)
        req.userId = decode.id
     
    } catch(err) {
        return res.status(401).json({messege: 'Token Inválido'})
    }
    next()

}
export default auth