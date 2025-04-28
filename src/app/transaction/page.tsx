"use client";
import { useEffect, useState } from "react";
import { FaWallet, FaUndoAlt, FaCalendarCheck } from "react-icons/fa";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    setTransactions([
      {
        type: "topup",
        status: "complete",
        amount: 100,
        createdAt: "2025-04-22T09:00:00.000Z",
      },
      {
        type: "reserve",
        status: "complete",
        amount: 100,
        createdAt: "2025-04-22T09:00:00.000Z",
      },
      {
        type: "refund",
        status: "complete",
        amount: +100,
        createdAt: "2025-04-22T09:00:00.000Z",
      }
    ]);
  }, []);

  const renderIcon = (type: string) => {
    if (type === "topup") return <FaWallet />;
    if (type === "reserve") return <FaCalendarCheck />;
    if (type === "refund") return <FaUndoAlt />;
    return null;
  };

  const renderTitle = (type: string) => {
    if (type === "topup") return "Top-up by QR Code";
    if (type === "reserve") return "Reserve";
    if (type === "refund") return "Refund";
    return "";
  };

  const renderAmount = (type: string) => {
    if (type === "topup" || type === "refund") return "+";
    if (type === "reserve") return "-";
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-2xl">
        <h1 className="text-xl font-bold mb-6 text-center">
            Transaction History
        </h1>
        <div className="space-y-4">
          {transactions.map((t, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg ${
                t.type === "topup"
                  ? "border-2 border-green-400"
                  : t.type === "reserve"
                  ? "border-2 border-orange-300"
                  : "border-2 border-blue-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl text-black">{renderIcon(t.type)}</div>
                <div>
                  <div className="font-semibold text-black">{renderTitle(t.type)}</div>
                  <div className="text-sm text-gray-500">
                    {t.status} |{" "}
                    {new Date(t.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <div className={`text-lg font-bold text-black`}>
                {renderAmount(t.type)} {t.amount} ฿
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
