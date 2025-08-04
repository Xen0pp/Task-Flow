import api from './api';

const getHackathons = async () => {
  const response = await api.get('/hackathons');
  return response.data;
};

const createHackathon = async (hackathonData) => {
  const response = await api.post('/hackathons', hackathonData);
  return response.data;
};

const updateHackathon = async (hackathonId, hackathonData) => {
  const response = await api.put(`/hackathons/${hackathonId}`, hackathonData);
  return response.data;
};

const deleteHackathon = async (hackathonId) => {
  const response = await api.delete(`/hackathons/${hackathonId}`);
  return response.data;
};

const addEvent = async (hackathonId, eventData) => {
  const response = await api.post(`/hackathons/${hackathonId}/events`, eventData);
  return response.data;
};

const updateEvent = async (hackathonId, eventId, eventData) => {
  const response = await api.put(`/hackathons/${hackathonId}/events/${eventId}`, eventData);
  return response.data;
};

const deleteEvent = async (hackathonId, eventId) => {
  const response = await api.delete(`/hackathons/${hackathonId}/events/${eventId}`);
  return response.data;
};

const hackathonService = {
  getHackathons,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  addEvent,
  updateEvent,
  deleteEvent,
};

export default hackathonService;
