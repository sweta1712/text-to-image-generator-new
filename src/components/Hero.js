import React, { useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (loading) return;
    if (!prompt.trim()) {
      alert('Please enter a prompt to generate an image.');
      return;
    }
    setLoading(true);
    setImageUrl('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Returned image URL:", data.imageUrl);  // ✅ Log it
        setImageUrl(data.imageUrl); // ✅ Use direct URL, not base64
      } else {
        console.error('Error generating image:', data.error);
        alert(`Error generating image: ${data.error.message || data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="badge">Best text to image generator ✨</span>
        <h1>Turn text to <span className="highlight">image</span>, in seconds.</h1>
        <p>
          Unleash your creativity with AI. Turn your imagination into visual art in seconds —
          just type, and watch the magic happen.
        </p>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                generateImage();
              }
            }}
          />
          <button className="generate-button" onClick={generateImage} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Images'} <span className="sparkle">✨</span>
          </button>
        </div>
      </div>
      <div className="hero-images">
        {imageUrl && <img src={imageUrl} alt="Generated" className="generated-image" />}
        {!imageUrl && !loading && (
          <div className="image-placeholder-text">Your generated image will appear here.</div>
        )}
        {loading && <div className="loading-spinner"></div>}
      </div>
    </section>
  );
};

export default Hero;
