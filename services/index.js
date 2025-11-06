//import vision from '@google-cloud/vision';
import tts from '@google-cloud/text-to-speech';
import { VertexAI } from "@google-cloud/vertexai"; 


//const visionClient = new vision.ImageAnnotatorClient();
const ttsClient = new tts.TextToSpeechClient();

const location = "us-central1"; 
const PROJECT_ID = process.env.PROJECT_ID

const vertex_ai = new VertexAI({ location, project: PROJECT_ID}); 

const model = "gemini-2.5-flash"; 
const generativeModel = vertex_ai.getGenerativeModel({ model });

//https://cloud.google.com/nodejs/docs/reference/vertexai/latest
// Função auxiliar para formatar o Buffer em um formato aceito pelo Gemini
function ConverterParaEntradaGenerativa(imagemBuffer, mimeType) {
    return {
        inlineData: {
            data: imagemBuffer.toString("base64"),
            mimeType,
        },
    };
}

async function gerarDescricao(imageBuffer) {

   // const teste = imageBuffer
   // console.log("TESTANDO Buffer: ", teste) 
    const imageFormatada = ConverterParaEntradaGenerativa(imageBuffer, 'image/jpeg'); 
   // console.log("formato GEMINI:", imagePart)
    const prompt =  `Você é um assistente de acessibilidade para pessoas cegas. 
                    Crie uma descrição natural e objetiva desta imagem, seguindo o estilo #PraCegoVer. 
                    Descreva o que é, mencione o ambiente de fundo, e os elementos importantes.`
    /*`Você é um assistente de acessibilidade para pessoas cegas.
        Descreva de forma natural, simples e em um único parágrafo, o que você vê nesta imagem. 
        Mencione o ambiente, os objetos principais e, se houver, o texto mais relevante. 
        Não use parênteses ou aspas na resposta.`;*/

    const request = {
        contents: [
            { 
                role: "user", 
                parts: [
                    imageFormatada,
                    { text: prompt } 
                ] 
            }
        ],
    };

    let descricaoTexto = "";

    try {
     
        console.log("Chamando Vertex AI para descrição da imagem...");
        
        const response = await generativeModel.generateContent(request);

        descricaoTexto = response.response.candidates[0].content.parts[0].text;
        
        console.log(`Descrição: ${descricaoTexto}`);
        //console.log(response.response.candidates[0].content.parts[0])
        
        return descricaoTexto
        
    } catch (error) {
        console.error("Erro na Gemini API:", error);
        throw new Error(`Erro na API Gemini: ${error.message}`);
    }
    
    
}

async function gerarAudioDescricao(descricaoTexto){
        
    try {
        const textoDeEntrada = { text: descricaoTexto };
        
        const [ttsResponse] = await ttsClient.synthesizeSpeech({
            input: textoDeEntrada,
            voice: { languageCode: 'pt-BR', ssmlGender: 'FEMALE' },
            audioConfig: { audioEncoding: 'MP3' }
        });

        return ttsResponse.audioContent;


    } catch (error) {
        console.error("Erro na TTS API:", error);
        throw new Error(`Erro na API de Text-to-Speech: ${error.message}`);
    }
}

export { gerarDescricao, gerarAudioDescricao };





/*chamada
const descricaoImagem = await gerarDescricao(imagem.buffer);
const audioBuffer = await gerarAudioDescricao(descricaoImagem);
fs.writeFileSync('audio_saida.mp3', audioBuffer);*/



























