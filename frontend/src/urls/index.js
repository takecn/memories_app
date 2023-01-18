const DEFAULT_API_LOCALHOST = "http://localhost:3000/api/v1";

export const login = `${DEFAULT_API_LOCALHOST}/login`;
export const guestLogin = `${DEFAULT_API_LOCALHOST}/guest_login`;
export const logout = `${DEFAULT_API_LOCALHOST}/logout`;

export const users = `${DEFAULT_API_LOCALHOST}/admin/users`;
export const user = (userId) =>
  `${DEFAULT_API_LOCALHOST}/admin/users/${userId}`;

export const posts = `${DEFAULT_API_LOCALHOST}/home`;
export const post = (postId) => `${DEFAULT_API_LOCALHOST}/posts/${postId}`;
