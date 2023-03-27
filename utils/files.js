'useStrict'

import fs from 'fs/promises';

export async function isFileExist(name) {
    //console.log(name);
    
    //const constants = require('fs');
    try {
      await fs.stat(name);
      return true;
    } catch (error) {
      // write error твой
      //writeError(error.stack, 'logs-utils - is file exist');
      return false;
    }
  }