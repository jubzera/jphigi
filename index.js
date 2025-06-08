const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/webhook', async (req, res) => {
  const message = req.body.payload?.payload?.text || '';
  const user = req.body.payload?.payload?.sender?.phone || '';

  if (!message || !user) return res.sendStatus(400);

  try {
    const chatgptReply = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = chatgptReply.data.choices[0].message.content;

    await axios.post(`https://api.gupshup.io/sm/api/v1/msg`, null, {
      params: {
        channel: "whatsapp",
        source: process.env.GUPSHUP_SOURCE_NUMBER,
        destination: user,
        message: reply,
        src.name: process.env.GUPSHUP_APP_NAME
      },
      headers: {
        'apikey': process.env.GUPSHUP_API_KEY
      }
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/", (_, res) => res.send("Agente IA ativo!"));

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
