export const findUserByEmail = (usersList, email) => {
  if (!usersList) return null;
  return usersList.find((user) => user.email === email);
};
