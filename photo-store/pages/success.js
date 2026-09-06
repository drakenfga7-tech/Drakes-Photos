import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [status, setStatus] = useState('checking'); // checking | ready | error

  useEffect(() => {
    if (!session_id) return;
    setStatus('checking');
    fetch(`/api/verify-download?session_id=${session_id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => setStatus('ready'))
      .catch(() => setStatus('error'));
  }, [session_id]);

  return (
    <div className="page">
      {status === 'checking' && <p>Confirming your payment…</p>}

      {status === 'ready' && (
        <>
          <h1>Payment confirmed</h1>
          <p>Your file is ready.</p>
          <a className="downloadBtn" href={`/api/verify-download?session_id=${session_id}&download=1`}>
            Download full-resolution file
          </a>
        </>
      )}

      {status === 'error' && (
        <>
          <h1>Something's not right</h1>
          <p>We couldn't confirm this payment. If you were charged, contact the seller directly.</p>
        </>
      )}

      <style jsx>{`
        .page {
          max-width: 600px;
          margin: 0 auto;
          padding: 96px 24px;
          text-align: center;
          font-family: 'Inter', sans-serif;
          color: #F2EFE9;
        }
        h1 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 32px;
        }
        .downloadBtn {
          display: inline-block;
          margin-top: 24px;
          background: #C98F4A;
          color: #171613;
          padding: 14px 28px;
          text-decoration: none;
          font-weight: 600;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
