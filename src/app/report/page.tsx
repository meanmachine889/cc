"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, AlertTriangle, CheckCircle2, Calculator } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface PastReport {
    id: string
    period: string
    co2Emitted: number
    cctBurned: number
    status: "compliant" | "non-compliant"
    submittedAt: string
}

export default function ReportPage() {
    const { publicKey, connected } = useWallet()
    const [co2Amount, setCo2Amount] = useState<string>("45")
    const [reportPeriod, setReportPeriod] = useState<string>("2025-01")

    const userCCTBalance = 150.5 // Mock balance from dashboard

    const pastReports: PastReport[] = [
        {
            id: "1",
            period: "December 2024",
            co2Emitted: 25,
            cctBurned: 25,
            status: "compliant",
            submittedAt: "2025-01-05",
        },
        {
            id: "2",
            period: "November 2024",
            co2Emitted: 24.5,
            cctBurned: 24.5,
            status: "compliant",
            submittedAt: "2024-12-05",
        },
        {
            id: "3",
            period: "October 2024",
            co2Emitted: 30,
            cctBurned: 30,
            status: "compliant",
            submittedAt: "2024-11-05",
        },
    ]

    const handleSubmitReport = () => {
        if (!connected) {
            toast.error("Please connect your wallet first")
            return
        }

        const co2 = Number.parseFloat(co2Amount)
        if (isNaN(co2) || co2 <= 0) {
            toast.error("Please enter a valid CO₂ amount")
            return
        }

        if (co2 > userCCTBalance) {
            toast.error(
                `Insufficient CCT balance. You need ${co2} CCT but only have ${userCCTBalance} CCT. Please purchase more.`,
            )
            return
        }

        // Mock submission
        toast.success(`Emission report submitted! ${co2} CCT tokens will be burned for compliance.`)
    }

    const cctNeeded = Number.parseFloat(co2Amount) || 0
    const isCompliant = cctNeeded <= userCCTBalance

    if (!connected) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-4">Connect Your Wallet</h1>
                    <p className="text-xs sm:text-sm md:text-base text-neutral-400 mb-8">
                        Please connect your wallet to submit emission reports
                    </p>
                    <Link href="/">
                        <Button className="bg-white text-black hover:bg-neutral-200">Go Back Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-zinc-900">
                <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2">Emission Reporting</h1>
                            <p className="text-xs sm:text-sm md:text-base text-neutral-400 font-light">
                                Submit your monthly CO₂ emissions and burn CCT for compliance
                            </p>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <Link href="/dashboard" className="flex-1 sm:flex-none">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto border-zinc-900 hover:bg-neutral-900 bg-transparent"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Submit New Report */}
                    <div className="lg:col-span-2">
                        <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6 mb-4 sm:mb-6">
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <div className="rounded-md flex items-center justify-center border border-zinc-900 bg-gradient-to-b from-[#101010] to-black p-2 sm:p-3">
                                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />
                                </div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-light">Submit Emission Report</h2>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">
                                        Reporting Period *
                                    </label>
                                    <input
                                        type="month"
                                        value={reportPeriod}
                                        onChange={(e) => setReportPeriod(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a] border border-zinc-900 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors text-xs sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">
                                        CO₂ Emitted (tonnes) *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={co2Amount}
                                            onChange={(e) => setCo2Amount(e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a] border border-zinc-900 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors text-xs sm:text-sm"
                                            placeholder="45"
                                            min="0"
                                            step="0.1"
                                        />
                                        <Calculator className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-500" />
                                    </div>
                                    <p className="text-xs text-neutral-400 font-light mt-2">1 tonne of CO₂ = 1 CCT token required</p>
                                </div>

                                {/* Compliance Check */}
                                <div
                                    className={`p-3 sm:p-4 rounded-lg border ${
                                        isCompliant ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        {isCompliant ? (
                                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                                        )}
                                        <h3 className="font-light text-xs sm:text-sm md:text-base">
                                            {isCompliant ? "Sufficient CCT Balance" : "Insufficient CCT Balance"}
                                        </h3>
                                    </div>
                                    <div className="text-xs sm:text-sm font-light text-neutral-300 space-y-1">
                                        <p>CCT Required: {cctNeeded} CCT</p>
                                        <p>Your Balance: {userCCTBalance} CCT</p>
                                        {!isCompliant && (
                                            <p className="text-red-400">You need {(cctNeeded - userCCTBalance).toFixed(2)} more CCT tokens</p>
                                        )}
                                    </div>
                                </div>

                                {!isCompliant && (
                                    <div className="p-3 sm:p-4 bg-[#0a0a0a] border border-zinc-900 rounded-lg">
                                        <p className="text-xs sm:text-sm font-light text-neutral-300 mb-3">
                                            You don&apos;t have enough CCT tokens. Purchase more to submit this report:
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                            <Link href="/auctions" className="flex-1">
                                                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm">
                                                    Buy from Auction
                                                </Button>
                                            </Link>
                                            <Link href="/marketplace" className="flex-1">
                                                <Button variant="outline" className="w-full border-zinc-900 text-xs sm:text-sm bg-transparent">
                                                    Buy from Marketplace
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleSubmitReport}
                                    disabled={!isCompliant}
                                    className={`w-full py-4 sm:py-6 text-xs sm:text-sm md:text-base ${
                                        isCompliant
                                            ? "bg-white text-black hover:bg-neutral-200"
                                            : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                    }`}
                                >
                                    Submit Report & Burn {cctNeeded} CCT
                                </Button>

                                <p className="text-xs text-neutral-400 text-center font-light">
                                    By submitting, you agree that {cctNeeded} CCT tokens will be permanently burned for this reporting
                                    period
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Info & Stats */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Current Balance */}
                        <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-light mb-4">Your CCT Balance</h3>
                            <div className="text-center py-3 sm:py-4">
                                <p className="text-3xl sm:text-4xl md:text-5xl font-light mb-2">{userCCTBalance}</p>
                                <p className="text-xs sm:text-sm text-neutral-400 font-light">CCT Available</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-zinc-900 space-y-2 text-xs sm:text-sm font-light">
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
                        <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-light mb-4">How It Works</h3>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm font-light text-neutral-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5 flex-shrink-0">1.</span>
                                    <span>Enter your CO₂ emissions for the month</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5 flex-shrink-0">2.</span>
                                    <span>System checks if you have enough CCT tokens</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5 flex-shrink-0">3.</span>
                                    <span>CCT tokens are burned (1 CCT = 1 tonne CO₂)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5 flex-shrink-0">4.</span>
                                    <span>Compliance status updated on-chain</span>
                                </li>
                            </ul>
                        </Card>

                        {/* Compliance Status */}
                        <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-light mb-4">Compliance Status</h3>
                            <div className="flex items-center gap-3 p-2 sm:p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="font-light text-xs sm:text-sm">Compliant</p>
                                    <p className="text-xs text-neutral-400 font-light">All reports submitted</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Past Reports */}
                <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6 mt-4 sm:mt-6">
                    <h2 className="text-lg sm:text-xl font-light mb-4">Report History</h2>
                    <div className="space-y-2 sm:space-y-3">
                        {pastReports.map((report) => (
                            <div
                                key={report.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-[#0a0a0a] border border-zinc-900 rounded-lg"
                            >
                                <div className="flex-1">
                                    <h3 className="font-light text-xs sm:text-sm md:text-base mb-1">{report.period}</h3>
                                    <p className="text-xs text-neutral-400 font-light">Submitted: {report.submittedAt}</p>
                                </div>

                                <div className="text-xs sm:text-sm md:text-base">
                                    <p className="font-light">{report.co2Emitted} tonnes CO₂</p>
                                    <p className="text-xs text-neutral-400 font-light">{report.cctBurned} CCT burned</p>
                                </div>

                                <div
                                    className={`px-2 sm:px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                                        report.status === "compliant" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                    }`}
                                >
                                    {report.status === "compliant" ? "Compliant" : "Non-Compliant"}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
