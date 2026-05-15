import axios from "axios";
const BASE_URL = "http://localhost:3001";

export async function searchNews(q, page, limit) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/news/public/search`, {
    params: {
      q,
      page,
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
export async function getCategoriesNavbar() {
  const response = await axios.get(`${BASE_URL}/categories/public`);

  return response.data;
}
export async function loginUser(email, password) {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });

  return response.data;
}

export async function getLatestNewsHomePage() {
  const response = await axios.get(`${BASE_URL}/news/public/latest`);

  return response.data;
}

export async function getMostReadNewsHomePage() {
  const response = await axios.get(`${BASE_URL}/news/public/most-read`);

  return response.data;
}

export async function getNewsByCategoryHome(categoryId, page, limit) {
  const response = await axios.get(
    `${BASE_URL}/news/public/category/${categoryId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
}

export async function getNewsDetailsById(id) {
  const response = await axios.get(`${BASE_URL}/news/public/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

export async function getNewsByTagId(id, page, limit) {
  const response = await axios.get(`${BASE_URL}/news/public/tag/${id}`, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
}
export async function getTopReactedNews() {
  const response = await axios.get(`${BASE_URL}/news/public/top-reacted`);

  return response.data;
}

export async function addCommentToNews(commentData) {
  const response = await axios.post(`${BASE_URL}/comments`, commentData);

  return response.data;
}

export async function reactToNews(id, type) {
  const response = await axios.post(
    `${BASE_URL}/reactions/news/${id}`,
    {
      reaction: type,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function reactToComment(id, type) {
  const response = await axios.post(
    `${BASE_URL}/reactions/comment/${id}`,
    {
      reaction_type: type,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function getCategoriesCms(page, limit) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/categories`, {
    params: {
      page,
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createCategory(body) {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${BASE_URL}/categories`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateCategory(id, body) {
  const token = localStorage.getItem("token");

  const response = await axios.patch(`${BASE_URL}/categories/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteCategory(id) {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${BASE_URL}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getNewsCms(page, limit) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/news`, {
    params: {
      page,
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getCategoriesListCms() {
  const response = await axios.get(`${BASE_URL}/categories/cms`);

  return response.data;
}
export async function createNews(body) {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${BASE_URL}/news`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
export async function updateNews(id, body) {
  const token = localStorage.getItem("token");

  const response = await axios.patch(`${BASE_URL}/news/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteNews(id) {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${BASE_URL}/news/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

/**---------------------admin api */
export async function getAllUsers(page, limit) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/users`, {
    params: {
      page,
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createUser(body) {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${BASE_URL}/users`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateUser(id, body) {
  const token = localStorage.getItem("token");

  const response = await axios.patch(`${BASE_URL}/users/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function toggleStatus(id) {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${BASE_URL}/users/${id}/status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function getAllNewsByCategory(id, page, limit) {
  const response = await axios.get(`${BASE_URL}/news/public/category/${id}`, {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}
