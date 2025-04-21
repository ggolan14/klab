export const CURRENT_URL = () => {
   // return 'https://k-lab.iem.technion.ac.il';
   // return 'http://localhost:4000';
   return process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
    // return '';
}

