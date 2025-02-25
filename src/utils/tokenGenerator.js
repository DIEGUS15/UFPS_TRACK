export const generateToken = () => {
  //Genera un token numerico de 6 digitos
  return Math.floor(100000 + Math.random() * 900000).toString();
};
