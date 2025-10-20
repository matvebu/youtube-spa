import { removeUser } from '../../features/auth/model/store/userSlice';

export const logout = () => {
  localStorage.setItem('TOKEN', '');
  localStorage.setItem('CURRENT_SEARCH', '');
  removeUser();
};

export default logout;
