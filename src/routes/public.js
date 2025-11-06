import express from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import upload from '../../middlewares/multer.js'
import { gerarAudioDescricao, gerarDescricao } from '../../services/index.js'
import fs from 'fs'

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

router.post('/cadastro', async(req, res) => {

    try{
        const user = req.body
        
        const salt = await bcrypt.genSalt(10)
        const password_hash = await bcrypt.hash(user.password, salt)

        const userDB = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: password_hash,

            }
        })
        res.status(201).json({message: "Usuário Cadastrado"})

    }catch (err){
        res.status(500).json({message: 'Erro no servidor, tente novamente'})
    }
 
})

//Login
router.post('/login', async(req, res) => {
    try{
        const userInfo = req.body
        
        //busca usuário no banco
        const user = await prisma.user.findUnique({
            where: {email: userInfo.email},
        })

        if(!user){
            return res.status(404).json({message: 'Usuário não encontrado'})
        }

        const isValid = await bcrypt.compare(userInfo.password, user.password) 
        if(!isValid){
            return res.status(400).json({message: 'Usuário ou senha inválido'})
        }

        //Gerando token jwt
        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '30d'})

        res.status(200).json(token, {message:'Login efetuado com sucesso'})

    }catch(err){
        res.status(500).json({message: 'Erro no servidor, tente novamente'})
    }

})

//upload da imagem rota publica 
router.post("/upload", upload.single('img'), async(req, res, next) => {
    try{const PORT = process.env.PORT || 3000;
        const imagem = req.file;

        if(!imagem){
           return next(new Error("Não há imagem"))

        }
    const descricaoImagem = await gerarDescricao(imagem.buffer);
    const audioBuffer = await gerarAudioDescricao(descricaoImagem);
   
    fs.writeFileSync('audio_saida.mp3', audioBuffer);

    res.set('Content-Type', 'audio/mpeg');
    res.status(200).send(audioBuffer);

    } catch(error){
        console.error(error);
        next(error);
    }
})


export default router














//https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/evolve-your-schema-typescript-postgresql