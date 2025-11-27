export const fetchUser = () => {
  const storedUser = localStorage.getItem("user");

  const userInfo = storedUser ? JSON.parse(storedUser) : null;

  return userInfo;
};
