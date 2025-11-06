import express from 'express'
import { PrismaClient } from '@prisma/client'
import upload from '../../middlewares/multer.js'
import { gerarAudioDescricao, gerarDescricao } from '../../services/index.js'
import fs from 'fs'

const prisma = new PrismaClient()
const router = express.Router()

router.get('/listar-usuarios', async (req, res) => {
    try{
        const users = await prisma.user.findMany({ omit: {password:true} })

        res.status(201).json({message: "Usuários listados com sucesso", users})

    }catch (err){
        res.status(500).json({message: 'Erro no servidor'})

    }
})




export default router