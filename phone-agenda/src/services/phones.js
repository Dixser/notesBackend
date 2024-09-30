import axios from "axios"
const baseUrl = "/api/persons"


const getAll = () => {
  return axios.get(baseUrl)
}

const create = (newObject) => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}
const deletePhone = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}
const get = (id) => {
  return axios.get(`${baseUrl}/${id}`)
}

export default {
  get,
  getAll,
  create,
  update,
  deletePhone,
}
