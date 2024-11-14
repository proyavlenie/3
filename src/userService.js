// src/userService.js

import axios from 'axios';

// Получаем данные пользователя (например, с API)
export const getUser = async () => {
  const response = await axios.get('http://localhost:5000/api/user'); // URL на ваш сервер
  return response.data;
};

// Обновляем данные пользователя
export const updateUser = async (updatedUser) => {
  const response = await axios.put('http://localhost:5000/api/user', updatedUser);
  return response.data;
};
