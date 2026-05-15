import axios from "./axios";

export async function searchNews(q, page, limit) {
  const response = await axios.get("/news/public/search", {
    params: {
      q,
      page,
      limit,
    },
  });

  return response.data;
}

export async function getCategoriesNavbar() {
  const response = await axios.get("/categories/public");

  return response.data;
}

export async function loginUser(email, password) {
  const response = await axios.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function getLatestNewsHomePage() {
  const response = await axios.get("/news/public/latest");

  return response.data;
}

export async function getMostReadNewsHomePage() {
  const response = await axios.get("/news/public/most-read");

  return response.data;
}

export async function getNewsByCategoryHome(categoryId, page, limit) {
  const response = await axios.get(`/news/public/category/${categoryId}`, {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export async function getNewsDetailsById(id) {
  const response = await axios.get(`/news/public/${id}`, {
    withCredentials: true,
  });

  return response.data;
}

export async function getNewsByTagId(id, page, limit) {
  const response = await axios.get(`/news/public/tag/${id}`, {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export async function getTopReactedNews() {
  const response = await axios.get("/news/public/top-reacted");

  return response.data;
}

export async function addCommentToNews(commentData) {
  const response = await axios.post("/comments", commentData);

  return response.data;
}

export async function reactToNews(id, type) {
  const response = await axios.post(
    `/reactions/news/${id}`,
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
    `/reactions/comment/${id}`,
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
  const response = await axios.get("/categories", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export async function createCategory(body) {
  const response = await axios.post("/categories", body);

  return response.data;
}

export async function updateCategory(id, body) {
  const response = await axios.patch(`/categories/${id}`, body);

  return response.data;
}

export async function deleteCategory(id) {
  const response = await axios.delete(`/categories/${id}`);

  return response.data;
}

export async function getNewsCms(page, limit) {
  const response = await axios.get("/news", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export async function getCategoriesListCms() {
  const response = await axios.get("/categories/cms");

  return response.data;
}

export async function createNews(body) {
  const response = await axios.post("/news", body);

  return response.data;
}

export async function updateNews(id, body) {
  const response = await axios.patch(`/news/${id}`, body);

  return response.data;
}

export async function deleteNews(id) {
  const response = await axios.delete(`/news/${id}`);

  return response.data;
}

/**---------------------admin api */

export async function getAllUsers(page, limit) {
  const response = await axios.get("/users", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export async function createUser(body) {
  const response = await axios.post("/users", body);

  return response.data;
}

export async function updateUser(id, body) {
  const response = await axios.patch(`/users/${id}`, body);

  return response.data;
}

export async function toggleStatus(id) {
  const response = await axios.patch(`/users/${id}/status`);

  return response.data;
}

export async function getAllNewsByCategory(id, page, limit) {
  const response = await axios.get(`/news/public/category/${id}`, {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}
