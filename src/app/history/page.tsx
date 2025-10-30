"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Flame, Download, Filter } from "lucide-react"
import Link from "next/link"

interface Transaction {
    id: string
    type: "purchase" | "burn" | "bond" | "yield"
    amount: number
    usdcValue?: number
    timestamp: string
    status: "confirmed" | "pending" | "failed"
    txHash: string
}

export default function HistoryPage() {
    const { publicKey, connected } = useWallet()
    const [filter, setFilter] = useState<string>("all")

    const transactions: Transaction[] = [
        {
            id: "1",
            type: "purchase",
            amount: 50,
            usdcValue: 750,
            timestamp: "2025-01-28 14:32",
            status: "confirmed",
            txHash: "5k7Qm...xY3p",
        },
        {
            id: "2",
            type: "burn",
            amount: 25,
            timestamp: "2025-01-25 09:15",
            status: "confirmed",
            txHash: "3mN9z...pL2k",
        },
        {
            id: "3",
            type: "bond",
            amount: 10000,
            timestamp: "2025-01-20 16:45",
            status: "confirmed",
            txHash: "8xR4w...qT5m",
        },
        {
            id: "4",
            type: "yield",
            amount: 125.5,
            timestamp: "2025-01-15 00:00",
            status: "confirmed",
            txHash: "2vB8k...nM7j",
        },
        {
            id: "5",
            type: "purchase",
            amount: 100,
            usdcValue: 1600,
            timestamp: "2025-01-10 11:20",
            status: "confirmed",
            txHash: "7cP3x...wQ9r",
        },
        {
            id: "6",
            type: "burn",
            amount: 24.5,
            timestamp: "2024-12-28 10:05",
            status: "confirmed",
            txHash: "4hS6y...vK1n",
        },
        {
            id: "7",
            type: "purchase",
            amount: 50,
            usdcValue: 825,
            timestamp: "2024-12-15 13:50",
            status: "confirmed",
            txHash: "9wL2m...bD4p",
        },
    ]

    const filteredTransactions = transactions.filter((tx) => {
        if (filter === "all") return true
        return tx.type === filter
    })

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case "purchase":
                return <ArrowDownLeft className="w-5 h-5 text-green-500" />
            case "burn":
                return <Flame className="w-5 h-5 text-red-500" />
            case "bond":
                return <ArrowUpRight className="w-5 h-5 text-blue-500" />
            case "yield":
                return <ArrowDownLeft className="w-5 h-5 text-purple-500" />
            default:
                return null
        }
    }

    const getTransactionColor = (type: string) => {
        switch (type) {
            case "purchase":
                return "text-green-500"
            case "burn":
                return "text-red-500"
            case "bond":
                return "text-blue-500"
            case "yield":
                return "text-purple-500"
            default:
                return "text-white"
        }
    }

    const exportToCSV = () => {
        const headers = ["Date", "Type", "Amount", "USDC Value", "Status", "Transaction Hash"]
        const rows = transactions.map((tx) => [
            tx.timestamp,
            tx.type.toUpperCase(),
            tx.amount,
            tx.usdcValue || "-",
            tx.status,
            tx.txHash,
        ])

        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "carbon-transactions.csv"
        a.click()
    }

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
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-zinc-900">
                <div className="container mx-auto px-4 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-light mb-2">Transaction History</h1>
                            <p className="text-xs sm:text-sm text-neutral-400 font-light">
                                All your carbon credit activity in one place
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                            <Button
                                onClick={exportToCSV}
                                variant="outline"
                                className="border-zinc-900 hover:bg-[#0a0a0a] text-xs sm:text-sm bg-transparent"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </Button>
                            <Link href="/dashboard" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="border-zinc-900 hover:bg-[#0a0a0a] w-full text-xs sm:text-sm bg-transparent"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mb-2">Total Purchased</p>
                        <p className="text-xl sm:text-2xl font-light text-green-500">200 CCT</p>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mb-2">Total Burned</p>
                        <p className="text-xl sm:text-2xl font-light text-red-500">49.5 CCT</p>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mb-2">Total Bonded</p>
                        <p className="text-xl sm:text-2xl font-light text-blue-500">$10,000</p>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mb-2">Yield Earned</p>
                        <p className="text-xl sm:text-2xl font-light text-purple-500">$125.50</p>
                    </Card>
                </div>
                {/* Filters */}
                <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6 mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <Filter className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                        <div className="flex flex-wrap gap-2 w-full">
                            {["all", "purchase", "burn", "bond", "yield"].map((filterType) => (
                                <Button
                                    key={filterType}
                                    onClick={() => setFilter(filterType)}
                                    className={`text-xs sm:text-sm ${
                                        filter === filterType
                                            ? "bg-white text-black hover:bg-neutral-200"
                                            : "bg-zinc-900 text-neutral-300 hover:bg-zinc-800"
                                    }`}
                                >
                                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Card>



                {/* Transactions List */}
                <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-neutral-400 font-light text-sm sm:text-base">No transactions found</p>
                            </div>
                        ) : (
                            filteredTransactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-[#0a0a0a]/50 rounded-lg hover:bg-zinc-900/30 transition-colors gap-3 sm:gap-4"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            {getTransactionIcon(tx.type)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-light capitalize mb-1 text-sm sm:text-base">{tx.type}</h3>
                                            <p className="text-xs sm:text-sm text-neutral-400 font-light">{tx.timestamp}</p>
                                        </div>
                                    </div>

                                    <div className="text-right w-full sm:w-auto">
                                        <p className={`text-base sm:text-lg font-light ${getTransactionColor(tx.type)}`}>
                                            {tx.type === "purchase" || tx.type === "yield" ? "+" : "-"}
                                            {tx.amount} {tx.type === "bond" || tx.type === "yield" ? "USDC" : "CCT"}
                                        </p>
                                        {tx.usdcValue && (
                                            <p className="text-xs sm:text-sm text-neutral-400 font-light">${tx.usdcValue} USDC</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                        <div
                                            className={`px-2 sm:px-3 py-1 rounded-full text-xs ${
                                                tx.status === "confirmed"
                                                    ? "bg-green-500/10 text-green-500"
                                                    : tx.status === "pending"
                                                        ? "bg-yellow-500/10 text-yellow-500"
                                                        : "bg-red-500/10 text-red-500"
                                            }`}
                                        >
                                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                        </div>
                                        <a
                                            href={`https://explorer.solana.com/tx/${tx.txHash}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs sm:text-sm text-neutral-400 hover:text-white font-light font-mono break-all"
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

            </div>
        </div>
    )
}
