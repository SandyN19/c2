"use strict"

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const si = require('systeminformation');
const axios = require('axios');

function logToFile(message, clientId = 'Unknown') {
  const logFilePath = path.join(__dirname, 'logs.txt');
  const timestamp = new Date().toISOString();

  fs.appendFile(logFilePath, `${timestamp} [Client ID: ${clientId}] - ${message}\n`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}


async function uniqueId() {
  const uniqueIdFilePath = path.join(process.cwd(), 'src/client_id.csv');
  if (fs.existsSync(uniqueIdFilePath)) {
    const savedId = fs.readFileSync(uniqueIdFilePath, 'utf8');
    return savedId.trim();
  } else {
    const newId = uuidv4();
    fs.writeFileSync(uniqueIdFilePath, newId, 'utf8');
    return newId
  }
}

async function getClientInfo() {
  
  const osInfo = await si.osInfo();
  const loc = await getLocation();
  const id = await uniqueId();
  
  return {
    platform: osInfo.platform,
    release: osInfo.release,
    clientid: id,
    location: loc
  };  
}

async function getLocation() {
  try {
    const response = await axios.get('http://ip-api.com/json', { timeout: 5000 });
    const { lat, lon } = response.data;
    return `${lat}:${lon}`;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else {
      console.error('Error fetching location:', error);
    }
    return 'N/A:N/A';
  }
}



/* EXPORTS */
module.exports = { 
  getClientInfo,
  logToFile
};
