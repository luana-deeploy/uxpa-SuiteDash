require('dotenv').config();
const axios = require('axios');

const apiToken = process.env.WEBFLOW_API_TOKEN;
const siteId = process.env.WEBFLOW_SITE_ID;

async function listCollections() {
  try {
    const response = await axios.get(`https://api.webflow.com/sites/${siteId}/collections`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'accept-version': '1.0.0'
      }
    });
    console.log('Collections:', response.data);
  } catch (err) {
    console.error('Erro ao listar collections:', err.response?.data || err.message);
  }
}

listCollections();
