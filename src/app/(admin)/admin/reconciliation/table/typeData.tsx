interface Transaction {
  customer_number: string;
  customer_name: string;
  amount: number;
  txn_date: string;
  txn_time: string;
  location_code: string;
  info1: string;
  info2: string;
  status: string;
}

export default Transaction;
