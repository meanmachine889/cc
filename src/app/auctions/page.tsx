"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, TrendingDown, Coins, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Auction {
    id: string
    batchNumber: number
    totalTokens: number
    tokensRemaining: number
    startPrice: number
    currentPrice: number
    reservePrice: number
    startTime: Date
    endTime: Date
    status: "active" | "completed" | "cancelled"
    participants: number
}

export default function AuctionsPage() {
    const { publicKey, connected } = useWallet()
    const [auctions, setAuctions] = useState<Auction[]>([
        {
            id: "1",
            batchNumber: 42,
            totalTokens: 1000,
            tokensRemaining: 650,
            startPrice: 50,
            currentPrice: 32.5,
            reservePrice: 10,
            startTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
            endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
            status: "active",
            participants: 23,
        },
        {
            id: "2",
            batchNumber: 41,
            totalTokens: 800,
            tokensRemaining: 0,
            startPrice: 50,
            currentPrice: 28,
            reservePrice: 10,
            startTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
            endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: "completed",
            participants: 18,
        },
    ])

    const [selectedAuction, setSelectedAuction] = useState<Auction | null>(auctions[0])
    const [bidAmount, setBidAmount] = useState<string>("10")
    const [timeRemaining, setTimeRemaining] = useState<string>("")

    useEffect(() => {
        if (selectedAuction && selectedAuction.status === "active") {
            const interval = setInterval(() => {
                const now = Date.now()
                const end = selectedAuction.endTime.getTime()
                const diff = end - now

                if (diff <= 0) {
                    setTimeRemaining("Auction Ended")
                    clearInterval(interval)
                } else {
                    const hours = Math.floor(diff / (1000 * 60 * 60))
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
                }
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [selectedAuction])

    const handlePlaceBid = () => {
        if (!connected) {
            toast.error("Please connect your wallet first")
            return
        }

        const amount = Number.parseFloat(bidAmount)
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        if (selectedAuction && amount > selectedAuction.tokensRemaining) {
            toast.error(`Only ${selectedAuction.tokensRemaining} CCT remaining`)
            return
        }

        // Mock bid placement
        toast.success(`Bid placed successfully! Purchasing ${amount} CCT at $${selectedAuction?.currentPrice}/CCT`)
    }

    if (!connected) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-4">Connect Your Wallet</h1>
                    <p className="text-sm sm:text-base text-neutral-400 mb-8 font-light">
                        Please connect your wallet to participate in auctions
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
                <div className="container mx-auto px-4 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2">Dutch Auctions</h1>
                            <p className="text-xs sm:text-sm text-neutral-400 font-light">
                                Fair price discovery for Carbon Credit Tokens (CCT)
                            </p>
                        </div>
                        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                            <Link href="/dashboard" className="flex-1 sm:flex-none">
                                <Button
                                    variant="outline"
                                    className="border-zinc-900 hover:bg-neutral-900 w-full sm:w-auto text-xs sm:text-sm bg-transparent"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/" className="flex-1 sm:flex-none">
                                <Button
                                    variant="outline"
                                    className="border-zinc-900 hover:bg-neutral-900 w-full sm:w-auto text-xs sm:text-sm bg-transparent"
                                >
                                    Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Auction List */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-lg sm:text-xl font-light mb-4">Active & Past Auctions</h2>
                        {auctions.map((auction) => (
                            <Card
                                key={auction.id}
                                className={`bg-[#0a0a0a] border-zinc-900 p-3 sm:p-4 cursor-pointer transition-all ${
                                    selectedAuction?.id === auction.id ? "border-zinc-700" : "hover:border-zinc-800"
                                }`}
                                onClick={() => setSelectedAuction(auction)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs sm:text-sm font-light text-neutral-400">Batch #{auction.batchNumber}</span>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                            auction.status === "active" ? "bg-green-500/10 text-green-500" : "bg-neutral-700 text-neutral-400"
                                        }`}
                                    >
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </span>
                                </div>
                                <p className="text-base sm:text-lg font-light mb-1">${auction.currentPrice} / CCT</p>
                                <p className="text-xs sm:text-sm text-neutral-400 font-light">
                                    {auction.tokensRemaining} / {auction.totalTokens} CCT remaining
                                </p>
                            </Card>
                        ))}
                    </div>

                    {/* Selected Auction Details */}
                    {selectedAuction && (
                        <div className="lg:col-span-2">
                            <Card className="bg-[#0a0a0a] border-zinc-900 p-4 sm:p-6 mb-6 gap-0">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-9 gap-4">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-light">Batch #{selectedAuction.batchNumber}</h2>
                                    {selectedAuction.status === "active" && (
                                        <div className="flex items-center gap-2 text-green-500">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-xs sm:text-sm font-light">Live Auction</span>
                                        </div>
                                    )}
                                </div>

                                {/* Auction Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                                    <div className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl flex flex-col items-start gap-7 justify-between">
                                        <div className="rounded-md flex items-center justify-center border border-zinc-800 bg-gradient-to-b from-[#101010] to-black p-2 mb-2">
                                            <TrendingDown className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl">${selectedAuction.currentPrice}</h3>
                                            <p className="text-xs text-neutral-400 mt-1">Current Price</p>
                                        </div>
                                    </div>

                                    {/* CCT Remaining */}
                                    <div className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl flex flex-col items-start gap-7 justify-between">
                                        <div className="rounded-md flex items-center justify-center border border-zinc-800 bg-gradient-to-b from-[#101010] to-black p-2 mb-2">
                                            <Coins className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl">{selectedAuction.tokensRemaining}</h3>
                                            <p className="text-xs text-neutral-400 mt-1">CCT Remaining</p>
                                        </div>
                                    </div>

                                    {/* Time Remaining */}
                                    <div className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl flex flex-col items-start gap-7 justify-between">
                                        <div className="rounded-md flex items-center justify-center border border-zinc-800 bg-gradient-to-b from-[#101010] to-black p-2 mb-2">
                                            <Clock className="w-5 h-5 text-yellow-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl">{timeRemaining || "Ended"}</h3>
                                            <p className="text-xs text-neutral-400 mt-1">Time Remaining</p>
                                        </div>
                                    </div>

                                    {/* Participants */}
                                    <div className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl flex flex-col items-start gap-7 justify-between">
                                        <div className="rounded-md flex items-center justify-center border border-zinc-800 bg-gradient-to-b from-[#101010] to-black p-2 mb-2">
                                            <Users className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl">{selectedAuction.participants}</h3>
                                            <p className="text-xs text-neutral-400 mt-1">Participants</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Chart Info */}
                                <div className="mb-6 p-4 bg-neutral-800/30 rounded-lg">
                                    <h3 className="text-xs sm:text-sm font-light text-neutral-400 mb-3">Auction Details</h3>
                                    <div className="space-y-2 text-xs sm:text-sm font-light">
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
                                {selectedAuction.status === "active" && (
                                    <div className="p-4 sm:p-6 bg-neutral-800/30 rounded-lg">
                                        <h3 className="text-base sm:text-lg font-light mb-4">Place Bid</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">
                                                    Amount of CCT to Purchase
                                                </label>
                                                <input
                                                    type="number"
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-2 bg-neutral-900 border border-zinc-900 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors text-sm sm:text-base"
                                                    placeholder="10"
                                                    min="0"
                                                    step="0.1"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between text-xs sm:text-sm font-light">
                                                <span className="text-neutral-400">Current Price per CCT:</span>
                                                <span className="text-white">${selectedAuction.currentPrice}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-xs sm:text-sm font-light">
                                                <span className="text-neutral-400">Total Cost:</span>
                                                <span className="text-white text-sm sm:text-lg">
                          ${((Number.parseFloat(bidAmount) || 0) * selectedAuction.currentPrice).toFixed(2)} USDC
                        </span>
                                            </div>

                                            <Button
                                                onClick={handlePlaceBid}
                                                className="w-full bg-white text-black hover:bg-neutral-200 py-4 sm:py-6 text-sm sm:text-lg font-light"
                                            >
                                                Place Bid
                                            </Button>

                                            <p className="text-xs text-neutral-400 text-center font-light">
                                                You&apos;ll pay the clearing price at auction end, not the current price
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {selectedAuction.status === "completed" && (
                                    <div className="p-4 sm:p-6 bg-neutral-800/30 rounded-lg text-center">
                                        <p className="text-sm sm:text-base text-neutral-400 font-light">This auction has ended</p>
                                        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2">
                                            Final clearing price: ${selectedAuction.currentPrice} / CCT
                                        </p>
                                    </div>
                                )}
                            </Card>

                            {/* How Dutch Auctions Work */}
                            <Card className="bg-neutral-900 border-zinc-900 p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-light mb-4">How Dutch Auctions Work</h3>
                                <ul className="space-y-3 text-xs sm:text-sm font-light text-neutral-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                                        <span>Price starts high and decreases linearly over 24 hours until reserve price</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                                        <span>Place bids at any time during the auction period</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                                        <span>All successful bidders pay the final clearing price, not their bid price</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                                        <span>Fair and transparent price discovery for carbon credits</span>
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
