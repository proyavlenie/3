// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';  // Добавьте useParams здесь
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Главный компонент
const App = () => {
  return (
    <Router>
      <div className="container">
        <nav>
          <Link to="/account" className="btn btn-link">
            Личный кабинет
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:postId" element={<PostDetail />} />  {/* Динамический роут */}
          <Route path="/account" element={<Account />} />  {/* Новый маршрут для личного кабинета */}
        </Routes>
      </div>
    </Router>
  );
};

// Компонент списка постов
const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(postsResponse.data);
    };
    const fetchUsers = async () => {
      const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(usersResponse.data);
    };
    fetchPosts();
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Новостная лента</h3>
      {posts
        .sort((a, b) => b.id - a.id) // Сортировка по убыванию ID (новые посты сверху)
        .map((post) => {
          const author = users.find((user) => user.id === post.userId);
          return (
            <div key={post.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{author?.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{post.title}</h6>
                <p className="card-text">{post.body}</p>
                <Link to={`/post/${post.id}`} className="btn btn-link">
                  Читать далее
                </Link>
              </div>
            </div>
          );
        })}
    </div>
  );
};

// Компонент подробного поста
const PostDetail = () => {
  const { postId } = useParams(); // Теперь useParams импортирован и используется для получения postId из URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const postResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      setPost(postResponse.data);
    };
    const fetchComments = async () => {
      const commentsResponse = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      setComments(commentsResponse.data);
    };
    fetchPost();
    fetchComments();
  }, [postId]);

  if (!post) return <div>Загрузка...</div>;

  return (
    <div>
      <h3>{post.title}</h3>
      <h5>{post.body}</h5>
      <h6>Автор: Давалис Максим Андреевич</h6>

      <h4>Комментарии:</h4>
      {comments.length ? (
        comments.map((comment) => (
          <div key={comment.id} className="mb-3">
            <h5>{comment.name}</h5>
            <p>{comment.body}</p>
          </div>
        ))
      ) : (
        <p>Комментариев нет.</p>
      )}
    </div>
  );
};

// Компонент для личного кабинета
const Account = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: '',
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Хук для навигации после обновления данных

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users/1'); // Замените ID на актуальный
      setUserData(response.data);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://jsonplaceholder.typicode.com/users/1', userData); // Отправляем данные на сервер
      alert('Данные успешно обновлены!');
      navigate('/'); // Переход на главную страницу после сохранения
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      alert('Произошла ошибка при обновлении данных.');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h3>Личный кабинет</h3>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Имя
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default App;
