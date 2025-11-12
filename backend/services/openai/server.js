import fs from 'fs';

import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const systemMessages = JSON.parse(fs.readFileSync('systemMessages.json', 'utf8'));
const systemMessageContent = systemMessages["final"];

const app = express();
app.use(express.json());

const openai = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

async function getEquipments() {
  try {
    const res = await axios.get(process.env.EQUIPMENT_URL);
    console.log(JSON.stringify(res.data));
    console.log(systemMessageContent);
    return res.data;
  } catch (err) {
    console.error("Error al obtener equipments:", err.message);
    return [];
  }
}

app.post("/chat", async (req, res) => {
  
  // 1. Recibe el historial completo del frontend
  const conversationHistory = req.body.history; // <--- CAMBIO

  if (!conversationHistory || conversationHistory.length === 0) {
    return res.status(400).json({ error: "No se proporcionó historial de chat." });
  }

  try {
    const dbData = await getEquipments();
    
    if (!dbData || dbData.length === 0) {
      return res.status(400).json({ error: "No hay equipos disponibles. No se procesará la solicitud." });
    }

    // 2. Obtén el último mensaje del usuario (que es el prompt actual)
    const lastUserMessage = conversationHistory.pop(); // Saca el último mensaje

    // 3. Construye el array de mensajes para la IA
    const messages = [
      { role: "system", content: systemMessageContent },
      // 4. Añade todo el historial anterior (sin el último mensaje)
      ...conversationHistory, 
      // 5. Añade el último mensaje modificado con los datos de la BD
      { 
        role: "user", 
        content: `Usuario dice: ${lastUserMessage.content}. Equipos disponibles actualmente: ${JSON.stringify(dbData)}` 
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages // Envía el historial completo + system + datos
    });

    console.log(completion.choices[0].message.content);
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error procesando la solicitud" });
  }
});


app.post("/singlechat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const dbData = await getEquipments();
    
    if (!dbData || dbData.length === 0) {
      return res.status(400).json({ error: "No hay equipos disponibles. No se procesará la solicitud." });
    }

    const messages = [
      { role: "system", content: systemMessageContent },
      { role: "user", content: `Usuario dice: ${userMessage}. Equipos disponibles actualmente: ${JSON.stringify(dbData)}` }
    ];

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages
    });

    console.log(completion.choices[0].message.content);
    res.json({ reply: completion.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error procesando la solicitud" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});