"use strict"

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const si = require('systeminformation');
const axios = require('axios');

const uniqueIdFilePath = path.join(__dirname, 'client_id.csv');

async function uniqueId() {
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
  const uptime = si.time();
  const clientId = await uniqueId();

  return {
    platform: osInfo.platform,
    release: osInfo.release,
    id: clientId,
    uptime: uptime.uptime
  };  
}

async function getLocation() {
  try {
    const response = await axios.get('http://ip-api.com/json');
    const { lat, lon } = response.data;
    return `${lat}:${lon}`;
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'N/A:N/A';
  }
}

async function saveClientInfoToCSV() {
  const clientInfo = await getClientInfo();
  const location = await getLocation();
  
  const csvFilePath = path.join(__dirname, 'sql', 'client_info.csv');
  const csvHeader = 'id,platform,release,uptime,location\n';
  const csvRow = `${clientInfo.id},${clientInfo.platform},${clientInfo.release},${clientInfo.uptime},${location}\n`;

    let fileContent = '';

    if (fs.existsSync(csvFilePath)) {
      fileContent = fs.readFileSync(csvFilePath, 'utf8').trim();
      
      let rows = fileContent.split('\n');

      const clientIndex = rows.findIndex(row => row.startsWith(clientInfo.id));

      if (clientIndex !== -1) {
        rows[clientIndex] = csvRow;
        fileContent = rows.join('\n');

      } else {
        fileContent += '\n' + csvRow;
        
      }
    } else {
      fileContent = csvHeader + csvRow;
    }

    fs.writeFileSync(csvFilePath, fileContent, 'utf8');
}

async function displayLocation() {
  const location = await getLocation();
  document.getElementById('locationInfo').innerText = `Location: ${location}`;
}

/* EXPORTS */
module.exports = { 
  displayLocation,
  getClientInfo,
  saveClientInfoToCSV
};
