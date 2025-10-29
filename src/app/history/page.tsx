'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, Flame, Download, Filter } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'purchase' | 'burn' | 'bond' | 'yield';
  amount: number;
  usdcValue?: number;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  txHash: string;
}

export default function HistoryPage() {
  const { publicKey, connected } = useWallet();
  const [filter, setFilter] = useState<string>('all');

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'purchase',
      amount: 50,
      usdcValue: 750,
      timestamp: '2025-01-28 14:32',
      status: 'confirmed',
      txHash: '5k7Qm...xY3p',
    },
    {
      id: '2',
      type: 'burn',
      amount: 25,
      timestamp: '2025-01-25 09:15',
      status: 'confirmed',
      txHash: '3mN9z...pL2k',
    },
    {
      id: '3',
      type: 'bond',
      amount: 10000,
      timestamp: '2025-01-20 16:45',
      status: 'confirmed',
      txHash: '8xR4w...qT5m',
    },
    {
      id: '4',
      type: 'yield',
      amount: 125.5,
      timestamp: '2025-01-15 00:00',
      status: 'confirmed',
      txHash: '2vB8k...nM7j',
    },
    {
      id: '5',
      type: 'purchase',
      amount: 100,
      usdcValue: 1600,
      timestamp: '2025-01-10 11:20',
      status: 'confirmed',
      txHash: '7cP3x...wQ9r',
    },
    {
      id: '6',
      type: 'burn',
      amount: 24.5,
      timestamp: '2024-12-28 10:05',
      status: 'confirmed',
      txHash: '4hS6y...vK1n',
    },
    {
      id: '7',
      type: 'purchase',
      amount: 50,
      usdcValue: 825,
      timestamp: '2024-12-15 13:50',
      status: 'confirmed',
      txHash: '9wL2m...bD4p',
    },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'burn':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'bond':
        return <ArrowUpRight className="w-5 h-5 text-blue-500" />;
      case 'yield':
        return <ArrowDownLeft className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'text-green-500';
      case 'burn':
        return 'text-red-500';
      case 'bond':
        return 'text-blue-500';
      case 'yield':
        return 'text-purple-500';
      default:
        return 'text-white';
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Amount', 'USDC Value', 'Status', 'Transaction Hash'];
    const rows = transactions.map((tx) => [
      tx.timestamp,
      tx.type.toUpperCase(),
      tx.amount,
      tx.usdcValue || '-',
      tx.status,
      tx.txHash,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carbon-transactions.csv';
    a.click();
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Connect Your Wallet</h1>
          <p className="text-neutral-400 mb-8">Please connect your wallet to view transaction history</p>
          <Link href="/">
            <Button className="bg-white text-black hover:bg-neutral-200">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light mb-2">Transaction History</h1>
              <p className="text-neutral-400 text-sm font-light">
                All your carbon credit activity in one place
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="border-neutral-800 hover:bg-neutral-900"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="border-neutral-800 hover:bg-neutral-900">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="bg-neutral-900 border-neutral-800 p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-neutral-400" />
            <div className="flex gap-2">
              {['all', 'purchase', 'burn', 'bond', 'yield'].map((filterType) => (
                <Button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`${
                    filter === filterType
                      ? 'bg-white text-black hover:bg-neutral-200'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Transactions List */}
        <Card className="bg-neutral-900 border-neutral-800 p-6">
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-400 font-light">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <h3 className="font-light capitalize mb-1">{tx.type}</h3>
                      <p className="text-sm text-neutral-400 font-light">{tx.timestamp}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-light ${getTransactionColor(tx.type)}`}>
                      {tx.type === 'purchase' || tx.type === 'yield' ? '+' : '-'}
                      {tx.amount} {tx.type === 'bond' || tx.type === 'yield' ? 'USDC' : 'CCT'}
                    </p>
                    {tx.usdcValue && (
                      <p className="text-sm text-neutral-400 font-light">${tx.usdcValue} USDC</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs ${
                        tx.status === 'confirmed'
                          ? 'bg-green-500/10 text-green-500'
                          : tx.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </div>
                    <a
                      href={`https://explorer.solana.com/tx/${tx.txHash}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-400 hover:text-white font-light font-mono"
                    >
                      {tx.txHash}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <p className="text-sm text-neutral-400 font-light mb-2">Total Purchased</p>
            <p className="text-2xl font-light text-green-500">200 CCT</p>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <p className="text-sm text-neutral-400 font-light mb-2">Total Burned</p>
            <p className="text-2xl font-light text-red-500">49.5 CCT</p>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <p className="text-sm text-neutral-400 font-light mb-2">Total Bonded</p>
            <p className="text-2xl font-light text-blue-500">$10,000</p>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <p className="text-sm text-neutral-400 font-light mb-2">Yield Earned</p>
            <p className="text-2xl font-light text-purple-500">$125.50</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
