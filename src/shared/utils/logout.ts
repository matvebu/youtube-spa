export const logout = () => {
  localStorage.setItem('TOKEN', '');
  localStorage.setItem('CURRENT_SEARCH', '');
  localStorage.setItem('user', '');
};

export default logout;
