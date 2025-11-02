import { store } from '../store/store';
import { removeUser } from '../../shared/store/userSlice';
import { clearCurrentSearch } from '../../features/video-search/model/store/currentSearchSlice';

export const logout = () => {
  localStorage.setItem('TOKEN', '');
  localStorage.setItem('ORIENTATION', '');
  store.dispatch(clearCurrentSearch());
  store.dispatch(removeUser());
};

export default logout;
