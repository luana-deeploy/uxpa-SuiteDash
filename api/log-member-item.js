require('dotenv').config();
const axios = require('axios');

const apiToken = process.env.WEBFLOW_API_TOKEN;
const collectionId = '68d308e2410aa2bf286ed3b1'; // seu collection ID

async function logMemberItems() {
  try {
    const response = await axios.get(
      `https://api.webflow.com/collections/${collectionId}/items`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'accept-version': '1.0.0'
        }
      }
    );

    console.log('Itens da collection Members:');
    response.data.items.forEach(item => {
      console.log(JSON.stringify(item, null, 2));
    });

  } catch (err) {
    console.error('Erro ao buscar items:', err.response?.data || err.message);
  }
}

logMemberItems();
