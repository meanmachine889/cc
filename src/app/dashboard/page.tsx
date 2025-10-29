'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, TrendingUp, Coins, Award } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  cctBalance: number;
  totalPurchased: number;
  totalBurned: number;
  bondAmount: number;
  yieldEarned: number;
  complianceStatus: 'compliant' | 'warning' | 'non-compliant';
}

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  const [stats, setStats] = useState<DashboardStats>({
    cctBalance: 150.5,
    totalPurchased: 200,
    totalBurned: 49.5,
    bondAmount: 10000,
    yieldEarned: 125.50,
    complianceStatus: 'compliant',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected) {
      // In production, redirect to home with connect prompt
      // redirect('/');
    }

    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [connected]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Connect Your Wallet</h1>
          <p className="text-neutral-400 mb-8">Please connect your wallet to view your dashboard</p>
          <Link href="/">
            <Button className="bg-white text-black hover:bg-neutral-200">
              Go Back Home
            </Button>
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
              <h1 className="text-3xl font-light mb-2">Industry Dashboard</h1>
              <p className="text-neutral-400 text-sm font-light">
                {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-neutral-800 hover:bg-neutral-900">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <Coins className="w-8 h-8 text-green-500" />
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  stats.complianceStatus === 'compliant'
                    ? 'bg-green-500/10 text-green-500'
                    : stats.complianceStatus === 'warning'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {stats.complianceStatus.charAt(0).toUpperCase() + stats.complianceStatus.slice(1)}
              </span>
            </div>
            <h3 className="text-2xl font-light mb-1">{stats.cctBalance} CCT</h3>
            <p className="text-neutral-400 text-sm font-light">Available Balance</p>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-light mb-1">{stats.totalPurchased} CCT</h3>
            <p className="text-neutral-400 text-sm font-light">Total Purchased</p>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <Leaf className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-light mb-1">{stats.totalBurned} CCT</h3>
            <p className="text-neutral-400 text-sm font-light">Total Burned</p>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-2xl font-light mb-1">${stats.bondAmount.toLocaleString()}</h3>
            <p className="text-neutral-400 text-sm font-light">Bonded USDC</p>
            <p className="text-green-500 text-xs mt-2">+${stats.yieldEarned.toFixed(2)} yield earned</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/auctions">
            <Card className="bg-neutral-900 border-neutral-800 p-6 hover:border-neutral-700 transition-colors cursor-pointer">
              <h3 className="text-lg font-light mb-2">Purchase CCT</h3>
              <p className="text-neutral-400 text-sm font-light">
                Buy carbon credits through Dutch auctions
              </p>
            </Card>
          </Link>

          <Link href="/report">
            <Card className="bg-neutral-900 border-neutral-800 p-6 hover:border-neutral-700 transition-colors cursor-pointer">
              <h3 className="text-lg font-light mb-2">Report Emissions</h3>
              <p className="text-neutral-400 text-sm font-light">
                Submit your monthly emission report
              </p>
            </Card>
          </Link>

          <Link href="/marketplace">
            <Card className="bg-neutral-900 border-neutral-800 p-6 hover:border-neutral-700 transition-colors cursor-pointer">
              <h3 className="text-lg font-light mb-2">Trade CCT</h3>
              <p className="text-neutral-400 text-sm font-light">
                Buy or sell CCT tokens on the marketplace
              </p>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="bg-neutral-900 border-neutral-800 p-6 hover:border-neutral-700 transition-colors cursor-pointer">
              <h3 className="text-lg font-light mb-2">View History</h3>
              <p className="text-neutral-400 text-sm font-light">
                See all your transactions and activity
              </p>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card className="bg-neutral-900 border-neutral-800 p-6">
          <h3 className="text-xl font-light mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { type: 'Purchase', amount: '+50 CCT', price: '$500 USDC', date: '2 days ago' },
              { type: 'Burn', amount: '-25 CCT', price: 'Compliance', date: '5 days ago' },
              { type: 'Yield', amount: '+$12.50', price: 'DAMM Vault', date: '1 week ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0">
                <div>
                  <p className="font-light">{activity.type}</p>
                  <p className="text-sm text-neutral-400 font-light">{activity.price}</p>
                </div>
                <div className="text-right">
                  <p className={`font-light ${activity.type === 'Burn' ? 'text-red-500' : 'text-green-500'}`}>
                    {activity.amount}
                  </p>
                  <p className="text-sm text-neutral-400 font-light">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
