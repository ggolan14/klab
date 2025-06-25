export const CURRENT_URL = () => {
   console.log("---> connecting to server which is running on "+(process.env.REACT_APP_SERVER_URL || 'http://localhost:4000'))
   return process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
  
}

