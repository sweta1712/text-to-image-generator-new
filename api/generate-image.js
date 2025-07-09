export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string' });
  }

  try {
    // Dummy image for testing
    const fakeImageUrl = `https://placekitten.com/600/400?text=${encodeURIComponent(prompt)}`;

    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate loading

    res.status(200).json({ imageUrl: fakeImageUrl });
  } catch (error) {
    console.error('Error in API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
