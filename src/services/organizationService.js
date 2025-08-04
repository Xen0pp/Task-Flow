import api from './api';

const createOrganization = async (orgData) => {
  const response = await api.post('/organizations', orgData);
  return response.data;
};

const joinOrganization = async (inviteCode) => {
  const response = await api.post('/organizations/join', { inviteCode });
  return response.data;
};

const getOrganization = async () => {
  const response = await api.get('/organizations');
  return response.data;
};

const getMembers = async () => {
  const response = await api.get('/organizations/members');
  return response.data;
};

const organizationService = {
  createOrganization,
  joinOrganization,
  getOrganization,
  getMembers,
};

export default organizationService;
