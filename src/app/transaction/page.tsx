"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaWallet, FaUndoAlt, FaCalendarCheck } from "react-icons/fa";

const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;


interface Transaction {
  _id: string;
  type: "topup" | "reserve" | "refund";
  amount: number;
  createdAt: string;
  user: string;
}

export default function TransactionHistory() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (status === "loading") return; // ยังโหลด session อยู่ รอไปก่อน

      if (!session || !session.user || !session.user.token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/v1/transactions`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setTransactions(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch transactions.");
        }
      } catch (error: any) {
        console.error("Failed to fetch transactions:", error);
        setError(error.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [session, status]);

  const renderIcon = (type: Transaction["type"]) => {
    const icons = {
      topup: <FaWallet className="text-green-500" />,
      reserve: <FaCalendarCheck className="text-orange-500" />,
      refund: <FaUndoAlt className="text-blue-500" />,
    };
    return icons[type];
  };

  const renderTitle = (type: Transaction["type"]) => {
    const titles = {
      topup: "Top-up by QR Code",
      reserve: "Reservation Payment",
      refund: "Refund",
    };
    return titles[type];
  };

  const renderAmount = (type: Transaction["type"], amount: number) => {
    const prefix = type === "reserve" ? "-" : "+";
    return `${prefix}${amount.toLocaleString()} ฿`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-200 py-12 px-4">
  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="p-6 bg-white border-b">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Transaction History
      </h1>
    </div>

    <div className="p-6 space-y-4"> 
      {loading ? (
        <div className="text-center text-gray-500">Loading transactions...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-500">No transactions found</div>
      ) : (
        [...transactions].reverse().map((transaction) => (
          <div
            key={transaction._id}
            className={`flex items-center justify-between p-4 rounded-lg transition-colors
              ${
                transaction.type === "topup"
                  ? "border-2 border-green-500"
                  : transaction.type === "reserve"
                  ? "border-2 border-orange-400"
                  : "border-2 border-blue-400"
              }
              hover:bg-gray-50
            `}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {renderIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {renderTitle(transaction.type)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

                <p
                className={`font-semibold ${
                    transaction.type === "reserve"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
                >
                {renderAmount(transaction.type, transaction.amount)}
                </p>
            </div>
            ))
        )}
        </div>
    </div>
    </div>


  );
}
