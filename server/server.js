// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Роут для получения данных пользователя
app.get('/api/user', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: 1, // Идентификатор авторизованного пользователя (например, 1)
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось загрузить данные' });
  }
});

// Роут для обновления данных пользователя
app.put('/api/user', async (req, res) => {
  const { id, name, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: id, // Обновляем по ID
      },
      data: {
        name: name,
        email: email,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось обновить данные' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
