import express from 'express';
import { PrismaClient } from '@prisma/client'
import upload from '../../middlewares/multer.js';
import { gerarAudioDescricao, gerarDescricao } from '../../services/index.js'
import fs from 'fs'


const router = express.Router()

//upload da imagem rota publica 
router.post("/upload", upload.single('img'), async(req, res, next) => {
    try{
        const imagem = req.file;

        if(!imagem){
           return next(new Error("Não há imagem"))

        }
    const descricaoImagem = await gerarDescricao(imagem.buffer);
    const audioBuffer = await gerarAudioDescricao(descricaoImagem);
   
    res.set('Content-Type', 'audio/mpeg');
    res.status(200).send(audioBuffer);

    } catch(error){
        console.error(error);
        next(error);
    }
});

export default router

