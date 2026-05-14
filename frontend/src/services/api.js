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
/*
export async function fetchNews() {
  try {
    const response = await fetch(`${BASE_URL}/news`);
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const data = await response.json();
    return data.news;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export async function registerUser(username, email, password) {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      throw new Error("Failed to register user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
  */
