export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const dummyImage = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(prompt);
  res.status(200).json({ imageUrl: dummyImage });
}
