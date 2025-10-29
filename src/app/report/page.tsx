'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, AlertTriangle, CheckCircle2, Calculator } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface PastReport {
  id: string;
  period: string;
  co2Emitted: number;
  cctBurned: number;
  status: 'compliant' | 'non-compliant';
  submittedAt: string;
}

export default function ReportPage() {
  const { publicKey, connected } = useWallet();
  const [co2Amount, setCo2Amount] = useState<string>('45');
  const [reportPeriod, setReportPeriod] = useState<string>('2025-01');

  const userCCTBalance = 150.5; // Mock balance from dashboard

  const pastReports: PastReport[] = [
    {
      id: '1',
      period: 'December 2024',
      co2Emitted: 25,
      cctBurned: 25,
      status: 'compliant',
      submittedAt: '2025-01-05',
    },
    {
      id: '2',
      period: 'November 2024',
      co2Emitted: 24.5,
      cctBurned: 24.5,
      status: 'compliant',
      submittedAt: '2024-12-05',
    },
    {
      id: '3',
      period: 'October 2024',
      co2Emitted: 30,
      cctBurned: 30,
      status: 'compliant',
      submittedAt: '2024-11-05',
    },
  ];

  const handleSubmitReport = () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const co2 = parseFloat(co2Amount);
    if (isNaN(co2) || co2 <= 0) {
      toast.error('Please enter a valid CO₂ amount');
      return;
    }

    if (co2 > userCCTBalance) {
      toast.error(
        `Insufficient CCT balance. You need ${co2} CCT but only have ${userCCTBalance} CCT. Please purchase more.`
      );
      return;
    }

    // Mock submission
    toast.success(
      `Emission report submitted! ${co2} CCT tokens will be burned for compliance.`
    );
  };

  const cctNeeded = parseFloat(co2Amount) || 0;
  const isCompliant = cctNeeded <= userCCTBalance;

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Connect Your Wallet</h1>
          <p className="text-neutral-400 mb-8">
            Please connect your wallet to submit emission reports
          </p>
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
              <h1 className="text-3xl font-light mb-2">Emission Reporting</h1>
              <p className="text-neutral-400 text-sm font-light">
                Submit your monthly CO₂ emissions and burn CCT for compliance
              </p>
            </div>
            <div className="flex gap-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submit New Report */}
          <div className="lg:col-span-2">
            <Card className="bg-neutral-900 border-neutral-800 p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-light">Submit Emission Report</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-neutral-400 mb-2">
                    Reporting Period *
                  </label>
                  <input
                    type="month"
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-neutral-400 mb-2">
                    CO₂ Emitted (tonnes) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={co2Amount}
                      onChange={(e) => setCo2Amount(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors"
                      placeholder="45"
                      min="0"
                      step="0.1"
                    />
                    <Calculator className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  </div>
                  <p className="text-xs text-neutral-400 font-light mt-2">
                    1 tonne of CO₂ = 1 CCT token required
                  </p>
                </div>

                {/* Compliance Check */}
                <div
                  className={`p-4 rounded-lg border ${
                    isCompliant
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {isCompliant ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                    <h3 className="font-light">
                      {isCompliant ? 'Sufficient CCT Balance' : 'Insufficient CCT Balance'}
                    </h3>
                  </div>
                  <div className="text-sm font-light text-neutral-300 space-y-1">
                    <p>CCT Required: {cctNeeded} CCT</p>
                    <p>Your Balance: {userCCTBalance} CCT</p>
                    {!isCompliant && (
                      <p className="text-red-400">
                        You need {(cctNeeded - userCCTBalance).toFixed(2)} more CCT tokens
                      </p>
                    )}
                  </div>
                </div>

                {!isCompliant && (
                  <div className="p-4 bg-neutral-800/50 rounded-lg">
                    <p className="text-sm font-light text-neutral-300 mb-3">
                      You don&apos;t have enough CCT tokens. Purchase more to submit this report:
                    </p>
                    <div className="flex gap-3">
                      <Link href="/auctions" className="flex-1">
                        <Button className="w-full bg-blue-500 hover:bg-blue-600">
                          Buy from Auction
                        </Button>
                      </Link>
                      <Link href="/marketplace" className="flex-1">
                        <Button variant="outline" className="w-full border-neutral-700">
                          Buy from Marketplace
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmitReport}
                  disabled={!isCompliant}
                  className={`w-full py-6 text-lg ${
                    isCompliant
                      ? 'bg-white text-black hover:bg-neutral-200'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Submit Report & Burn {cctNeeded} CCT
                </Button>

                <p className="text-xs text-neutral-400 text-center font-light">
                  By submitting, you agree that {cctNeeded} CCT tokens will be permanently burned
                  for this reporting period
                </p>
              </div>
            </Card>
          </div>

          {/* Info & Stats */}
          <div className="space-y-6">
            {/* Current Balance */}
            <Card className="bg-neutral-900 border-neutral-800 p-6">
              <h3 className="text-lg font-light mb-4">Your CCT Balance</h3>
              <div className="text-center py-4">
                <p className="text-4xl font-light mb-2">{userCCTBalance}</p>
                <p className="text-sm text-neutral-400 font-light">CCT Available</p>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2 text-sm font-light">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Purchased:</span>
                  <span>200 CCT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Burned:</span>
                  <span className="text-red-400">49.5 CCT</span>
                </div>
              </div>
            </Card>

            {/* How It Works */}
            <Card className="bg-neutral-900 border-neutral-800 p-6">
              <h3 className="text-lg font-light mb-4">How It Works</h3>
              <ul className="space-y-3 text-sm font-light text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">1.</span>
                  <span>Enter your CO₂ emissions for the month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">2.</span>
                  <span>System checks if you have enough CCT tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">3.</span>
                  <span>CCT tokens are burned (1 CCT = 1 tonne CO₂)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">4.</span>
                  <span>Compliance status updated on-chain</span>
                </li>
              </ul>
            </Card>

            {/* Compliance Status */}
            <Card className="bg-neutral-900 border-neutral-800 p-6">
              <h3 className="text-lg font-light mb-4">Compliance Status</h3>
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-light">Compliant</p>
                  <p className="text-xs text-neutral-400 font-light">All reports submitted</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Past Reports */}
        <Card className="bg-neutral-900 border-neutral-800 p-6 mt-6">
          <h2 className="text-xl font-light mb-4">Report History</h2>
          <div className="space-y-3">
            {pastReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg"
              >
                <div>
                  <h3 className="font-light mb-1">{report.period}</h3>
                  <p className="text-sm text-neutral-400 font-light">
                    Submitted: {report.submittedAt}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-light">{report.co2Emitted} tonnes CO₂</p>
                  <p className="text-sm text-neutral-400 font-light">
                    {report.cctBurned} CCT burned
                  </p>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs ${
                    report.status === 'compliant'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  {report.status === 'compliant' ? 'Compliant' : 'Non-Compliant'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
