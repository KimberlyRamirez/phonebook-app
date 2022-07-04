import axios from 'axios';
const baseUrl = '/api/persons';

const getAll = () => {
  let req = axios.get(baseUrl);
  return req.then((res) => res.data);
}

const create = contact => {
  let req = axios.post(baseUrl, contact);
  return req.then(res => res.data);
}

const deleteContact = id => {
  let req = axios.delete(`${baseUrl}/${id}`);
  return req.then(res => res.status);
}

const update = (id, number) => {
  let req = axios.put(`${baseUrl}/${id}`);
  return req.then(res => res.data);
}

export default {getAll, create, deleteContact, update};