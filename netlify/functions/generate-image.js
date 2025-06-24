const axios = require('axios');
const { Buffer } = require('buffer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const { prompt } = JSON.parse(event.body);

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Prompt is required' }),
    };
  }

  try {
    const clipdropApiKey = process.env.CLIPDROP_API_KEY;
    if (!clipdropApiKey) {
      throw new Error('CLIPDROP_API_KEY is not set in environment variables.');
    }

    const response = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      {
        prompt: prompt,
      },
      {
        headers: {
          'x-api-key': clipdropApiKey,
          'Content-Type': 'application/json',
          'Accept': 'image/png', // Requesting PNG image
        },
        responseType: 'arraybuffer', // Important for handling image data
      }
    );

    // Convert image buffer to base64
    const imageBase64 = Buffer.from(response.data).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: imageBase64 }),
    };
  } catch (error) {
    console.error('Error generating image with ClipDrop:', error.message);
    if (error.response) {
      console.error('ClipDrop API error response:', error.response.data.toString());
      return {
        statusCode: error.response.status,
        body: JSON.stringify({ error: error.response.data.toString() }),
      };
    } else if (error.request) {
      console.error('ClipDrop API no response:', error.request);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No response from ClipDrop API' }),
      };
    } else {
      console.error('Error setting up request:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};