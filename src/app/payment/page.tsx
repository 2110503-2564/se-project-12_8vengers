'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { useSession } from "next-auth/react";
import getUserProfile from '@/libs/getUserProfile';

const TopUpForm = () => {
  const { data: session } = useSession();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [chargeId, setChargeId] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (session?.user?.token) {
          const res = await getUserProfile(session.user.token);
          setBalance(res.data?.balance || 0);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };
  
    fetchProfile();
  }, [session]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(amount) < 50) {
      setMessage('❗ Minimum top-up amount is 50 Baht.');
      return;
    }

    if (!session?.user?.token) {
      setMessage('❗ Missing token from session. Please sign in again.');
      return;
    }

    try {
      const res = await fetch("/api/charge", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          amount: parseInt(amount) * 100,
        }),
      });

      const data = await res.json();

      if (res.ok && data.qrCode && data.chargeId) {
        setQrCodeUrl(data.qrCode);
        setChargeId(data.chargeId);
        setMessage('✅ Please scan the QR code to complete your payment.');
      } else {
        setMessage('❌ Top up failed: ' + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error('Top-up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
      setMessage('❌ Top up failed: ' + errorMessage);
    }
  };

  const handleCheckPayment = async () => {
    if (!chargeId) {
      setMessage('❗ No charge ID found.');
      return;
    }

    try {
      const res = await fetch(`/api/check-payment?chargeId=${chargeId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage('✅ Top up completed! Your balance has been updated.');
        setQrCodeUrl('');
        setChargeId('');
        window.location.reload();
      } else {
        setMessage('❗ Payment not completed yet: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Check payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
      setMessage('❗ Failed to check payment: ' + errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Top Up Your Balance</h2>

      {/* Current Balance */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Current Balance:</label>
        <input
          type="text"
          value={`${balance.toLocaleString()} Baht`}
          readOnly
          style={styles.input}
        />
      </div>

      {/* Top Up Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Enter Top-Up Amount (Baht):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            style={styles.input}
          />
          <p style={styles.minAmountText}>* Minimum 50 Baht</p>
        </div>

        <button type="submit" style={styles.button}>
          Top Up
        </button>
      </form>

      {/* QR Code and Check Payment */}
      {qrCodeUrl && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Please scan the QR code below to complete your payment:</p>
          <img src={qrCodeUrl} alt="PromptPay QR" style={{ width: 300, height: 300 }} />
          <p>Charge ID: {chargeId}</p>

          <button
            onClick={handleCheckPayment}
            style={{ ...styles.button, backgroundColor: "#00b894", marginTop: "20px" }}
          >
            Check Payment Status
          </button>
        </div>
      )}

      {/* Message */}
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f0f8ff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#0077b6',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginTop: '6px',
    outline: 'none',
    transition: 'border 0.3s',
  },
  minAmountText: {
    fontSize: '14px',
    color: '#6c757d',
    marginTop: '6px',
  },
  button: {
    backgroundColor: '#0077b6',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  message: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#333',
    fontSize: '16px',
  },
};

export default TopUpForm;
