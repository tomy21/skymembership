"use client";
import { useState } from "react";
import axios from "axios";

interface Transaction {
  customer_number: string;
  customer_name: string;
  amount: number;
  txn_date: string;
  txn_time: string;
  location_code: string;
  info1: string;
  info2: string;
}

export default function UploadReport() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const text = await file.text(); // baca file txt langsung

      const lines = text.split("\n");

      const parsedData: Transaction[] = [];

      for (const line of lines) {
        // cocokkan baris transaksi seperti di file txt
        const match = line.match(
          /^\s*\d+\s+(\d+)\s+([A-Za-z0-9.\s]+?)\s+IDR\s+([\d,]+\.\d{2})\s+(\d{2}\/\d{2}\/\d{2})\s+(\d{2}:\d{2}:\d{2})\s+(\S+)\s+(\S+)\s+(\S+|-)/,
        );

        if (match) {
          const [
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _,
            customer_number,
            customer_name,
            amountStr,
            dateStr,
            timeStr,
            location,
            info1,
            info2,
          ] = match;

          const [day, month, year] = dateStr.split("/");
          const txn_date = `20${year}-${month}-${day}`;

          parsedData.push({
            customer_number,
            customer_name: customer_name.trim(),
            amount: parseFloat(amountStr.replace(/,/g, "")),
            txn_date,
            txn_time: timeStr,
            location_code: location,
            info1,
            info2,
          });
        }
      }

      setTransactions(parsedData);
    } catch (err) {
      console.error(err);
      alert("Gagal memproses file");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/transactions", { transactions });
      alert("Data berhasil disimpan ke DB!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data.");
    }
  };

  return (
    <div>
      <h1>Upload Laporan Transaksi</h1>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      {loading && <p>Memproses file...</p>}

      {transactions.length > 0 && (
        <>
          <table border={1} cellPadding={4}>
            <thead>
              <tr>
                <th>No Pelanggan</th>
                <th>Nama</th>
                <th>Amount</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Lokasi</th>
                <th>Info1</th>
                <th>Info2</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr key={idx}>
                  <td>{t.customer_number}</td>
                  <td>{t.customer_name}</td>
                  <td>{t.amount}</td>
                  <td>{t.txn_date}</td>
                  <td>{t.txn_time}</td>
                  <td>{t.location_code}</td>
                  <td>{t.info1}</td>
                  <td>{t.info2}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSave}>Simpan ke Database</button>
        </>
      )}
    </div>
  );
}
