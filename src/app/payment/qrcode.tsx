import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { QRCodeCanvas } from 'qrcode.react';

const QRPage = () => {
  const router = useRouter();
  const { amount } = router.query; // Retrieve the amount from the URL
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    if (amount) {
      // If amount is available, generate the payment URL
      const paymentUrl = `https://paymentgateway.com/charge?amount=${amount}`;
      setQrData(paymentUrl);
    }
  }, [amount]);

  if (!amount) return <p>Loading...</p>; // Wait for amount to be available

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>QR Code for Payment</h2>
      {qrData && (
        <QRCodeCanvas 
          value={qrData} // Set the QR code value dynamically
          size={256} // Size of the QR code
          bgColor="#FFFFFF" // Background color
          fgColor="#000000" // Foreground (QR code) color
        />
      )}
      <p>Scan the QR code to pay {amount} Baht.</p>
    </div>
  );
};

export default QRPage;
