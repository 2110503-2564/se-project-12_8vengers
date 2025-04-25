'use client';

import React, { useState, useEffect } from 'react';

const TopUpForm = () => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

// ดึง balance ปัจจุบัน
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        setBalance(data.data?.balance || 0);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      }
    };

    fetchBalance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(amount) < 50) {
      setMessage('Minimum top-up amount is 50 Baht.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/v1/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: token,
          amount: parseInt(amount) * 100, // แปลงบาทเป็นสตางค์
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Top up successful: ${data.charge.amount / 100} บาท`);
      } else {
        setMessage('Top up failed: ' + data.error);
      }
    } catch (error) {
      console.error('Top up error:', error);
      setMessage('Top up failed: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Top Up Amount</h2>
      <div style={styles.inputGroup}>
        <label style={styles.label}> Current Balance:</label>
        <input
          type="text"
          value={`${balance} บาท`}
          readOnly
          style={styles.input} // ใช้สไตล์เดียวกับ input อื่น ๆ
        />
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Please enter amount (baht):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            style={styles.input}
          />
          <p style={styles.minAmountText}>Minimum amount to top-up 50 Baht</p>
        </div>
        <button
          type="submit"
          style={styles.button}
        >
          Top Up
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f0f8ff', // ฟ้าอ่อน
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#0077b6',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  balanceText: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#0077b6',
    marginBottom: '20px',
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
    color: '#6c757d', // สีเทาสำหรับข้อความ
    marginTop: '6px',
  },
  button: {
    backgroundColor: '#0077b6', // ฟ้าเข้ม
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#005f7f', // สีเข้มเมื่อ hover
  },
  message: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#333',
    fontSize: '16px',
  },
};

export default TopUpForm;
