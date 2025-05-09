'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { useSession } from "next-auth/react";
import getUserProfile from '@/libs/getUserProfile';
import createTransactions from '@/libs/createTransaction';

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
          amount: parseInt(amount)*100,
        }),
      });

      const data = await res.json();

      if (res.ok && data.qrCode && data.chargeId) {
        setQrCodeUrl(data.qrCode);
        setChargeId(data.chargeId);
        setMessage('');
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
  
      if (res.ok && data.success && session) {
        // สร้าง transaction เมื่อชำระเงินสำเร็จ
        try {
          await createTransactions(amount, "topup", session.user.token);
        } catch (err) {
          console.error('Failed to create transaction:', err);
        }
  
        setMessage('✅ Top up completed! Your balance has been updated.');
        setQrCodeUrl('');
        setChargeId('');
        window.location.reload();
      } else {
        setMessage('❌ Payment not completed yet' );
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
      <label style={styles.label}>Please enter Amount (Baht):</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        min="1"
        style={styles.input}
      />
      <p style={styles.minAmountText}>* Minimum amount to top-up 50 Baht</p>
    </div>

    <button type="submit" style={styles.button} className='hover:shadow-xl'>
      Top Up
    </button>
    {message && (
    <p style={{  color: 'red' }}>{message}</p>
    )}
    </form>


  {/* QR Code Section */}
  {qrCodeUrl && (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-8 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Complete Your Payment
      </h1>
      <p className="text-gray-600 mb-4">
        Please scan the QR code below to complete your payment:
      </p>

      <img
        src={qrCodeUrl}
        alt="PromptPay QR"
        className="w-80 h-90 mx-auto mb-5 rounded-lg shadow-2xl"
      />
        <p>
          <div className='text-green-500 mb-1 text-2xl'>
              {amount} ฿
          </div>
          <div className='text-gray-500 mb-2 text-lg'>
              8vengers Company Limited
          </div>
        </p>
      <p className="text-gray-500 mb-4 text-sm">
        Charge ID: <span className="font-semibold">{chargeId}</span>
      </p>

      <button
        onClick={handleCheckPayment}
        className="w-full bg-gradient-to-r from-green-600 to-green-600 text-white font-bold py-3 rounded-lg hover:shadow-xl transition duration-300"
      >
        Click this button after payment
      </button>
      <p style={styles.message}>{message}</p>
    </div>
    
    
  )}
</div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: '600px',
    marginTop: '80px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
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
