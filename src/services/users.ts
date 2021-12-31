import axios from 'axios';
import { CurrentUserLanguages, SanitizedUser, User } from '../types';

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://alexandria-reader-staging.herokuapp.com';

const baseUrl = `${host}/api/users`;

const addUser = async function(newUser: User) {
  const response = await axios.post(`${baseUrl}/`, newUser)
    .then((res) => res)
    .catch((error) => {
      const { message } = error.response.data.error;
      return message;
    });
  return response;
};

const setUserLanguages = async function(currentUserLanguages: CurrentUserLanguages) {
  const user = JSON.parse(localStorage.user);
  const { token } = user;

  const request = await axios.put(`${baseUrl}/set-languages`, currentUserLanguages, {
    headers: { Authorization: `bearer ${token}` },
  });

  const updatedUser: SanitizedUser = request.data;
  return updatedUser;
};

export default {
  setUserLanguages,
  addUser,
};

