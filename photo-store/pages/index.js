import { useState } from 'react';
import photos from '../data/photos.json';

export default function Home() {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  async function buy(photo) {
    setError(null);
    setLoadingId(photo.id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: photo.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Something went wrong starting checkout. Try again.');
        setLoadingId(null);
      }
    } catch (e) {
      setError('Something went wrong starting checkout. Try again.');
      setLoadingId(null);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Prints</h1>
        <p className="tagline">Original photographs. Full-resolution file delivered instantly after purchase.</p>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        {photos.map((photo) => (
          <div className="card" key={photo.id}>
            <div className="frame">
              <img src={photo.preview} alt={photo.title} />
            </div>
            <div className="meta">
              <span className="title">{photo.title}</span>
              <span className="price">${photo.priceUsd.toFixed(2)}</span>
            </div>
            <button
              className="buyBtn"
              onClick={() => buy(photo)}
              disabled={loadingId === photo.id}
            >
              {loadingId === photo.id ? 'Redirecting…' : 'Buy full-resolution file'}
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 64px 24px 96px;
        }
        .header {
          margin-bottom: 48px;
        }
        h1 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 44px;
          margin: 0 0 12px;
          letter-spacing: -0.01em;
        }
        .tagline {
          color: #A9A398;
          font-size: 15px;
          max-width: 46ch;
          line-height: 1.5;
          margin: 0;
        }
        .error {
          background: #3a2320;
          border: 1px solid #6b3a34;
          color: #f2c9c2;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 32px;
          font-size: 14px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 40px;
        }
        .card {
          display: flex;
          flex-direction: column;
        }
        .frame {
          border: 1px solid #35322c;
          padding: 10px;
          background: #1D1B17;
          margin-bottom: 14px;
        }
        .frame img {
          display: block;
          width: 100%;
          height: 260px;
          object-fit: cover;
        }
        .meta {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
        }
        .title {
          font-family: 'Fraunces', serif;
          font-size: 18px;
        }
        .price {
          color: #C98F4A;
          font-size: 15px;
          font-weight: 500;
        }
        .buyBtn {
          background: transparent;
          border: 1px solid #C98F4A;
          color: #C98F4A;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .buyBtn:hover:not(:disabled) {
          background: #C98F4A;
          color: #171613;
        }
        .buyBtn:disabled {
          opacity: 0.6;
          cursor: default;
        }
      `}</style>
    </div>
  );
}
