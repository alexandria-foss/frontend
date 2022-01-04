import axios from 'axios';
import { Text } from '../types';
import host from './host';
import getToken from '../utils/getToken';

const baseUrl = `${host}/api/texts`;

const getAllUserTextsByLanguage = async function(languageId: string) {
  const token = getToken();

  const response = await axios.get(`${baseUrl}/language/${languageId}`, {
    headers: { Authorization: `bearer ${token}` },
  });

  const texts: Array<Text> = response.data;
  return texts;
};

const postNewText = async function(newText: Text) {
  const token = getToken();

  const response = await axios.post(`${baseUrl}`, newText, {
    headers: { Authorization: `bearer ${token}` },
  });

  const text: Text = response.data;
  return text;
};

const getTextById = async function(id: string) {
  const token = getToken();

  const response = await axios.get(`${baseUrl}/${id}`, {
    headers: { Authorization: `bearer ${token}` },
  });

  return response.data;
};

const removeTextFromServer = async function(id: number) {
  const token = getToken();

  const response = await axios.delete(`${baseUrl}/${id}`, {
    headers: { Authorization: `bearer ${token}` },
  });

  // backend is not returning deleted text while code is 204
  return response.data;
};

export default {
  getAllUserTextsByLanguage,
  getTextById,
  postNewText,
  removeTextFromServer,
};
