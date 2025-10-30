"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function MarketplacePage() {
    const { publicKey, connected } = useWallet()
    const [orderType, setOrderType] = useState<"buy" | "sell">("buy")
    const [amount, setAmount] = useState<string>("10")
    const [pricePerToken, setPricePerToken] = useState<string>("15")

    const marketData = {
        currentPrice: 15.25,
        change24h: +2.5,
        volume24h: 12450,
        high24h: 16.8,
        low24h: 14.2,
    }

    const recentTrades = [
        { type: "buy", amount: 25, price: 15.3, time: "2 min ago" },
        { type: "sell", amount: 50, price: 15.2, time: "5 min ago" },
        { type: "buy", amount: 100, price: 15.25, time: "8 min ago" },
        { type: "buy", amount: 75, price: 15.15, time: "12 min ago" },
        { type: "sell", amount: 30, price: 15.1, time: "15 min ago" },
    ]

    const orderBook = {
        bids: [
            { price: 15.2, amount: 150, total: 2280 },
            { price: 15.15, amount: 200, total: 3030 },
            { price: 15.1, amount: 180, total: 2718 },
            { price: 15.05, amount: 220, total: 3311 },
            { price: 15.0, amount: 300, total: 4500 },
        ],
        asks: [
            { price: 15.3, amount: 120, total: 1836 },
            { price: 15.35, amount: 150, total: 2302.5 },
            { price: 15.4, amount: 180, total: 2772 },
            { price: 15.45, amount: 200, total: 3090 },
            { price: 15.5, amount: 250, total: 3875 },
        ],
    }

    const handleTrade = () => {
        if (!connected) {
            toast.error("Please connect your wallet first")
            return
        }

        const tokenAmount = Number.parseFloat(amount)
        const price = Number.parseFloat(pricePerToken)

        if (isNaN(tokenAmount) || tokenAmount <= 0 || isNaN(price) || price <= 0) {
            toast.error("Please enter valid amounts")
            return
        }

        const total = tokenAmount * price
        toast.success(
            `${orderType === "buy" ? "Purchase" : "Sell"} order placed! ${tokenAmount} CCT at $${price}/CCT (Total: $${total.toFixed(2)} USDC)`,
        )
    }

    if (!connected) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl sm:text-2xl font-light text-white mb-4">Connect Your Wallet</h1>
                    <p className="text-sm sm:text-base text-neutral-400 mb-8">Please connect your wallet to trade CCT tokens</p>
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
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-light mb-2">CCT Marketplace</h1>
                            <p className="text-xs sm:text-sm text-neutral-400 font-light">
                                Trade Carbon Credit Tokens on the secondary market
                            </p>
                        </div>
                        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                            <Link href="/dashboard" className="flex-1 sm:flex-none">
                                <Button variant="outline" className="border-zinc-900 hover:bg-neutral-900 w-full bg-transparent">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/" className="flex-1 sm:flex-none">
                                <Button variant="outline" className="border-zinc-900 hover:bg-neutral-900 w-full bg-transparent">
                                    Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 sm:py-8">
                {/* Market Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <Card className="bg-[#0a0a0a] border-zinc-900 p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mb-1">Current Price</p>
                        <p className="text-xl sm:text-2xl font-light">${marketData.currentPrice}</p>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-zinc-900 p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mb-1">24h Change</p>
                        <p
                            className={`text-xl sm:text-2xl font-light ${marketData.change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                            {marketData.change24h >= 0 ? "+" : ""}
                            {marketData.change24h}%
                        </p>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-zinc-900 p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mb-1">24h Volume</p>
                        <p className="text-xl sm:text-2xl font-light">{marketData.volume24h.toLocaleString()} CCT</p>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-zinc-900 p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mb-1">24h High</p>
                        <p className="text-xl sm:text-2xl font-light">${marketData.high24h}</p>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-zinc-900 p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mb-1">24h Low</p>
                        <p className="text-xl sm:text-2xl font-light">${marketData.low24h}</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Order Book */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-light mb-4">Order Book</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Bids (Buy Orders) */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                        <h4 className="text-xs sm:text-sm font-light text-green-500">Bids (Buy)</h4>
                                    </div>
                                    <div className="space-y-1 text-xs sm:text-sm font-light">
                                        <div className="grid grid-cols-3 gap-2 text-neutral-400 mb-2">
                                            <div>Price</div>
                                            <div>Amount</div>
                                            <div>Total</div>
                                        </div>
                                        {orderBook.bids.map((bid, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-3 gap-2 text-green-500/80 hover:bg-green-500/5 p-1 rounded"
                                            >
                                                <div>${bid.price}</div>
                                                <div>{bid.amount}</div>
                                                <div className="text-neutral-400">${bid.total}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Asks (Sell Orders) */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                        <h4 className="text-xs sm:text-sm font-light text-red-500">Asks (Sell)</h4>
                                    </div>
                                    <div className="space-y-1 text-xs sm:text-sm font-light">
                                        <div className="grid grid-cols-3 gap-2 text-neutral-400 mb-2">
                                            <div>Price</div>
                                            <div>Amount</div>
                                            <div>Total</div>
                                        </div>
                                        {orderBook.asks.map((ask, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-3 gap-2 text-red-500/80 hover:bg-red-500/5 p-1 rounded"
                                            >
                                                <div>${ask.price}</div>
                                                <div>{ask.amount}</div>
                                                <div className="text-neutral-400">${ask.total}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Recent Trades */}
                        <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity className="w-4 sm:w-5 h-4 sm:h-5" />
                                <h3 className="text-base sm:text-lg font-light">Recent Trades</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-400 font-light mb-2">
                                    <div>Type</div>
                                    <div>Amount</div>
                                    <div>Price</div>
                                    <div>Time</div>
                                </div>
                                {recentTrades.map((trade, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm font-light py-2 border-b border-zinc-900 last:border-0"
                                    >
                                        <div className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>
                                            {trade.type.toUpperCase()}
                                        </div>
                                        <div>{trade.amount} CCT</div>
                                        <div>${trade.price}</div>
                                        <div className="text-neutral-400">{trade.time}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Trading Form */}
                    <div>
                        <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6 sticky top-4 sm:top-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Button
                                    onClick={() => setOrderType("buy")}
                                    className={`flex-1 text-sm sm:text-base ${
                                        orderType === "buy"
                                            ? "bg-green-500 hover:bg-green-600 text-white"
                                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                                    }`}
                                >
                                    Buy
                                </Button>
                                <Button
                                    onClick={() => setOrderType("sell")}
                                    className={`flex-1 text-sm sm:text-base ${
                                        orderType === "sell"
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                                    }`}
                                >
                                    Sell
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">
                                        Price per CCT (USDC)
                                    </label>
                                    <input
                                        type="number"
                                        value={pricePerToken}
                                        onChange={(e) => setPricePerToken(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 bg-neutral-800 border border-zinc-900 rounded-md text-white text-sm sm:text-base font-light focus:outline-none focus:border-white transition-colors"
                                        placeholder="15.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">Amount of CCT</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 bg-neutral-800 border border-zinc-900 rounded-md text-white text-sm sm:text-base font-light focus:outline-none focus:border-white transition-colors"
                                        placeholder="10"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>

                                <div className="p-3 sm:p-4 bg-neutral-800/50 rounded-lg space-y-2 text-xs sm:text-sm font-light">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Total:</span>
                                        <span className="text-white">
                      ${((Number.parseFloat(amount) || 0) * (Number.parseFloat(pricePerToken) || 0)).toFixed(2)} USDC
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Fee (0.1%):</span>
                                        <span className="text-white">
                      ${((Number.parseFloat(amount) || 0) * (Number.parseFloat(pricePerToken) || 0) * 0.001).toFixed(2)}{" "}
                                            USDC
                    </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleTrade}
                                    className={`w-full py-4 sm:py-6 text-sm sm:text-lg ${
                                        orderType === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                                    }`}
                                >
                                    {orderType === "buy" ? "Place Buy Order" : "Place Sell Order"}
                                </Button>

                                <p className="text-xs text-neutral-400 text-center font-light">
                                    Orders are executed immediately at market price
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
