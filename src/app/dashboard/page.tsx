'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, TrendingUp, Coins, Award, ArrowUpRight } from 'lucide-react';
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
    yieldEarned: 125.5,
    complianceStatus: 'compliant',
  });

  useEffect(() => {
    if (!connected) {
      // redirect('/');
    }
  }, [connected]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Connect Your Wallet</h1>
          <p className="text-neutral-400 mb-8">Please connect your wallet to view your dashboard</p>
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
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
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

      <div className="container mx-auto px-4 py-8 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* CCT Balance */}
          <Card className="bg-[#0a0a0a] border-zinc-900 p-6 justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-md flex items-center justify-center border border-zinc-900 bg-gradient-to-b from-[#101010] to-black p-2 sm:p-3">
                <Coins className="w-5 h-5 text-green-500" />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs ${stats.complianceStatus === 'compliant'
                  ? 'bg-green-500/10 text-green-500'
                  : stats.complianceStatus === 'warning'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-red-500/10 text-red-500'
                  }`}
              >
                {stats.complianceStatus.charAt(0).toUpperCase() +
                  stats.complianceStatus.slice(1)}
              </span>
            </div>
            <div className="flex flex-col justify-end gap-5">
              <p className="text-neutral-400 text-sm font-light">Available Balance</p>
              <h3 className="text-2xl font-light">{stats.cctBalance} CCT</h3>
            </div>
          </Card>

          {/* Total Purchased */}
          <Card className="bg-[#0a0a0a] border-zinc-900 p-6 justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-md flex items-center justify-center border border-zinc-900 bg-gradient-to-b from-[#101010] to-black p-2 sm:p-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="flex flex-col justify-end gap-5">
              <p className="text-neutral-400 text-sm font-light">Total Purchased</p>
              <h3 className="text-2xl font-light">{stats.totalPurchased} CCT</h3>
            </div>
          </Card>

          {/* Total Burned */}
          <Card className="bg-[#0a0a0a] border-zinc-900 p-6 justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-md flex items-center justify-center border border-zinc-900 bg-gradient-to-b from-[#101010] to-black p-2 sm:p-3">
                <Leaf className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="flex flex-col justify-end gap-5">
              <p className="text-neutral-400 text-sm font-light">Total Burned</p>
              <h3 className="text-2xl font-light">{stats.totalBurned} CCT</h3>
            </div>
          </Card>

          {/* Bonded USDC */}
          <Card className="bg-[#0a0a0a] border-zinc-900 p-6 justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-md flex items-center justify-center border border-zinc-900 bg-gradient-to-b from-[#101010] to-black p-2 sm:p-3">
                <Award className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <p className="text-neutral-400 text-sm font-light">Bonded USDC</p>
              <h3 className="text-2xl font-light">${stats.bondAmount.toLocaleString()}</h3>
              <p className="text-green-500 text-xs">+${stats.yieldEarned.toFixed(2)} yield earned</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { title: 'Purchase CCT', desc: 'Buy carbon credits through Dutch auctions', link: '/auctions' },
            { title: 'Report Emissions', desc: 'Submit your monthly emission report', link: '/report' },
            { title: 'Trade CCT', desc: 'Buy or sell CCT tokens on the marketplace', link: '/marketplace' },
            { title: 'View History', desc: 'See all your transactions and activity', link: '/history' },
          ].map((item, i) => (
            <div key={i}>
              <Card className="bg-[#0a0a0a] border-zinc-900 p-6 justify-between">
                {/* <div className="flex items-center justify-between mb-4">
                  <div className="rounded-md flex items-center justify-center border border-zinc-900 bg-gradient-to-b from-[#101010] to-black p-2 sm:p-3">
                    <Coins className="w-5 h-5 text-green-500" />
                  </div>
                </div> */}
                <div className="flex flex-col justify-end gap-5">
                  <p className="text-neutral-400 text-sm font-light">{item.desc}</p>
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-lg font-light">{item.title}</h3>
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-300 hover:bg-gray-100 rounded-full transition-colors">
                      <Link href={item.link} key={i}>
                        <ArrowUpRight className="w-5 h-5 text-black" />
                      </Link>
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="bg-[#0a0a0a] border-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            {/* <div className="rounded-md flex items-center justify-center border border-zinc-900 bg-gradient-to-b from-[#101010] to-black p-2 sm:p-3">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div> */}
            <h3 className="text-xl font-light">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {[
              { type: 'Purchase', amount: '+50 CCT', price: '$500 USDC', date: '2 days ago' },
              { type: 'Burn', amount: '-25 CCT', price: 'Compliance', date: '5 days ago' },
              { type: 'Yield', amount: '+$12.50', price: 'DAMM Vault', date: '1 week ago' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0"
              >
                <div>
                  <p className="font-light">{activity.type}</p>
                  <p className="text-sm text-neutral-400 font-light">{activity.price}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-light ${activity.type === 'Burn' ? 'text-red-500' : 'text-green-500'
                      }`}
                  >
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
