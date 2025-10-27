import { store } from '../../app/providers/store/store';
import { removeUser } from '../../features/auth/model/store/userSlice';
import { clearCurrentSearch } from '../../features/video-search/model/store/currentSearchSlice';

export const logout = () => {
  localStorage.setItem('TOKEN', '');
  store.dispatch(clearCurrentSearch());
  store.dispatch(removeUser());
};

export default logout;
