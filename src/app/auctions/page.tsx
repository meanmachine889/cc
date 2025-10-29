'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, TrendingDown, Coins, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Auction {
  id: string;
  batchNumber: number;
  totalTokens: number;
  tokensRemaining: number;
  startPrice: number;
  currentPrice: number;
  reservePrice: number;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed' | 'cancelled';
  participants: number;
}

export default function AuctionsPage() {
  const { publicKey, connected } = useWallet();
  const [auctions, setAuctions] = useState<Auction[]>([
    {
      id: '1',
      batchNumber: 42,
      totalTokens: 1000,
      tokensRemaining: 650,
      startPrice: 50,
      currentPrice: 32.5,
      reservePrice: 10,
      startTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
      status: 'active',
      participants: 23,
    },
    {
      id: '2',
      batchNumber: 41,
      totalTokens: 800,
      tokensRemaining: 0,
      startPrice: 50,
      currentPrice: 28,
      reservePrice: 10,
      startTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      participants: 18,
    },
  ]);

  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(auctions[0]);
  const [bidAmount, setBidAmount] = useState<string>('10');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (selectedAuction && selectedAuction.status === 'active') {
      const interval = setInterval(() => {
        const now = Date.now();
        const end = selectedAuction.endTime.getTime();
        const diff = end - now;

        if (diff <= 0) {
          setTimeRemaining('Auction Ended');
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedAuction]);

  const handlePlaceBid = () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (selectedAuction && amount > selectedAuction.tokensRemaining) {
      toast.error(`Only ${selectedAuction.tokensRemaining} CCT remaining`);
      return;
    }

    // Mock bid placement
    toast.success(`Bid placed successfully! Purchasing ${amount} CCT at $${selectedAuction?.currentPrice}/CCT`);
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Connect Your Wallet</h1>
          <p className="text-neutral-400 mb-8">Please connect your wallet to participate in auctions</p>
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
              <h1 className="text-3xl font-light mb-2">Dutch Auctions</h1>
              <p className="text-neutral-400 text-sm font-light">
                Fair price discovery for Carbon Credit Tokens (CCT)
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="border-neutral-800 hover:bg-neutral-900">
                  Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-neutral-800 hover:bg-neutral-900">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Auction List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-light mb-4">Active & Past Auctions</h2>
            {auctions.map((auction) => (
              <Card
                key={auction.id}
                className={`bg-neutral-900 border-neutral-800 p-4 cursor-pointer transition-all ${
                  selectedAuction?.id === auction.id ? 'border-white' : 'hover:border-neutral-700'
                }`}
                onClick={() => setSelectedAuction(auction)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-light text-neutral-400">Batch #{auction.batchNumber}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      auction.status === 'active'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-neutral-700 text-neutral-400'
                    }`}
                  >
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </span>
                </div>
                <p className="text-lg font-light mb-1">${auction.currentPrice} / CCT</p>
                <p className="text-sm text-neutral-400 font-light">
                  {auction.tokensRemaining} / {auction.totalTokens} CCT remaining
                </p>
              </Card>
            ))}
          </div>

          {/* Selected Auction Details */}
          {selectedAuction && (
            <div className="lg:col-span-2">
              <Card className="bg-neutral-900 border-neutral-800 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light">Batch #{selectedAuction.batchNumber}</h2>
                  {selectedAuction.status === 'active' && (
                    <div className="flex items-center gap-2 text-green-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-light">Live Auction</span>
                    </div>
                  )}
                </div>

                {/* Auction Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-light mb-1">${selectedAuction.currentPrice}</p>
                    <p className="text-xs text-neutral-400 font-light">Current Price</p>
                  </div>

                  <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                    <Coins className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-light mb-1">{selectedAuction.tokensRemaining}</p>
                    <p className="text-xs text-neutral-400 font-light">CCT Remaining</p>
                  </div>

                  <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-lg font-light mb-1">{timeRemaining || 'Ended'}</p>
                    <p className="text-xs text-neutral-400 font-light">Time Remaining</p>
                  </div>

                  <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                    <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-light mb-1">{selectedAuction.participants}</p>
                    <p className="text-xs text-neutral-400 font-light">Participants</p>
                  </div>
                </div>

                {/* Price Chart Info */}
                <div className="mb-6 p-4 bg-neutral-800/30 rounded-lg">
                  <h3 className="text-sm font-light text-neutral-400 mb-3">Auction Details</h3>
                  <div className="space-y-2 text-sm font-light">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Starting Price:</span>
                      <span>${selectedAuction.startPrice} / CCT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Reserve Price:</span>
                      <span>${selectedAuction.reservePrice} / CCT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total Supply:</span>
                      <span>{selectedAuction.totalTokens} CCT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Price Decrease:</span>
                      <span>Linear over 24 hours</span>
                    </div>
                  </div>
                </div>

                {/* Bid Form */}
                {selectedAuction.status === 'active' && (
                  <div className="p-6 bg-neutral-800/30 rounded-lg">
                    <h3 className="text-lg font-light mb-4">Place Bid</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-light text-neutral-400 mb-2">
                          Amount of CCT to Purchase
                        </label>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors"
                          placeholder="10"
                          min="0"
                          step="0.1"
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm font-light">
                        <span className="text-neutral-400">Current Price per CCT:</span>
                        <span className="text-white">${selectedAuction.currentPrice}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm font-light">
                        <span className="text-neutral-400">Total Cost:</span>
                        <span className="text-white text-lg">
                          ${((parseFloat(bidAmount) || 0) * selectedAuction.currentPrice).toFixed(2)} USDC
                        </span>
                      </div>

                      <Button
                        onClick={handlePlaceBid}
                        className="w-full bg-white text-black hover:bg-neutral-200 py-6 text-lg"
                      >
                        Place Bid
                      </Button>

                      <p className="text-xs text-neutral-400 text-center font-light">
                        You&apos;ll pay the clearing price at auction end, not the current price
                      </p>
                    </div>
                  </div>
                )}

                {selectedAuction.status === 'completed' && (
                  <div className="p-6 bg-neutral-800/30 rounded-lg text-center">
                    <p className="text-neutral-400 font-light">This auction has ended</p>
                    <p className="text-sm text-neutral-500 font-light mt-2">
                      Final clearing price: ${selectedAuction.currentPrice} / CCT
                    </p>
                  </div>
                )}
              </Card>

              {/* How Dutch Auctions Work */}
              <Card className="bg-neutral-900 border-neutral-800 p-6">
                <h3 className="text-lg font-light mb-4">How Dutch Auctions Work</h3>
                <ul className="space-y-3 text-sm font-light text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Price starts high and decreases linearly over 24 hours until reserve price</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Place bids at any time during the auction period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>All successful bidders pay the final clearing price, not their bid price</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Fair and transparent price discovery for carbon credits</span>
                  </li>
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
