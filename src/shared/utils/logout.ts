export const logout = () => {
  localStorage.setItem('TOKEN', '');
  localStorage.setItem('CURRENT_SEARCH', '');
};

export default logout;
