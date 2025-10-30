"use client"

import type React from "react"

import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Building2, DollarSign, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface OnboardingStep {
    id: number
    title: string
    description: string
    icon: React.ReactNode
}

export default function OnboardPage() {
    const { publicKey, connected } = useWallet()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        companyName: "",
        registrationNumber: "",
        industry: "",
        bondAmount: "10000",
    })

    const steps: OnboardingStep[] = [
        {
            id: 1,
            title: "Company Information",
            description: "Provide your company details",
            icon: <Building2 className="w-6 h-6" />,
        },
        {
            id: 2,
            title: "Document Upload",
            description: "Upload registration documents",
            icon: <FileText className="w-6 h-6" />,
        },
        {
            id: 3,
            title: "Bond Deposit",
            description: "Stake USDC as compliance bond",
            icon: <DollarSign className="w-6 h-6" />,
        },
        {
            id: 4,
            title: "Complete",
            description: "Verification and NFT badge",
            icon: <CheckCircle2 className="w-6 h-6" />,
        },
    ]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = () => {
        if (!connected) {
            toast.error("Please connect your wallet first")
            return
        }

        toast.success("Onboarding complete! Your application is being verified.")
        setTimeout(() => {
            window.location.href = "/dashboard"
        }, 2000)
    }

    if (!connected) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-4">Connect Your Wallet</h1>
                    <p className="text-sm sm:text-base text-neutral-400 mb-8">Please connect your wallet to start onboarding</p>
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
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2">Industry Onboarding</h1>
                            <p className="text-xs sm:text-sm text-neutral-400 font-light">Join the carbon compliance ecosystem</p>
                        </div>
                        <Link href="/">
                            <Button variant="outline" className="border-zinc-900 hover:bg-[#0a0a0a] bg-transparent">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between max-w-4xl mx-auto gap-4 sm:gap-0">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1 w-full sm:w-auto">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                                            currentStep >= step.id ? "bg-white text-black" : "bg-zinc-900 text-neutral-400"
                                        }`}
                                    >
                                        {step.icon}
                                    </div>
                                    <p
                                        className={`text-xs sm:text-sm md:block hidden font-light text-center ${
                                            currentStep >= step.id ? "text-white" : "text-neutral-400"
                                        }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors hidden sm:block ${
                                            currentStep > step.id ? "bg-white" : "bg-zinc-900"
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <Card className="bg-[#0a0a0a] border-zinc-900 p-6 sm:p-8 max-w-2xl mx-auto">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-2">Company Information</h2>
                                <p className="text-xs sm:text-sm text-neutral-400 font-light mb-6">Tell us about your organization</p>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">Company Name *</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a] border border-zinc-900 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors text-sm sm:text-base"
                                    placeholder="Acme Industries Ltd."
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">
                                    Registration Number *
                                </label>
                                <input
                                    type="text"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a] border border-zinc-900 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors text-sm sm:text-base"
                                    placeholder="REG-123456789"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">Industry Sector *</label>
                                <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a] border border-zinc-900 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors text-sm sm:text-base"
                                >
                                    <option value="">Select industry</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="energy">Energy & Utilities</option>
                                    <option value="transportation">Transportation & Logistics</option>
                                    <option value="agriculture">Agriculture</option>
                                    <option value="construction">Construction</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">Wallet Address</label>
                                <input
                                    type="text"
                                    value={publicKey?.toBase58() || ""}
                                    disabled
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a]/50 border border-zinc-900 rounded-md text-neutral-400 font-light text-xs sm:text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-2">Document Upload</h2>
                                <p className="text-xs sm:text-sm text-neutral-400 font-light mb-6">
                                    Upload your company registration and emission reports
                                </p>
                            </div>

                            <div className="border-2 border-dashed border-zinc-900 rounded-lg p-6 sm:p-8 text-center hover:border-zinc-800 transition-colors cursor-pointer">
                                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-400 mx-auto mb-4" />
                                <p className="text-white font-light mb-2 text-sm sm:text-base">Click to upload or drag and drop</p>
                                <p className="text-xs sm:text-sm text-neutral-400 font-light">PDF, JPG, PNG (max 10MB)</p>
                            </div>

                            <div className="bg-[#0a0a0a]/50 p-4 sm:p-6 rounded-lg">
                                <h3 className="font-light mb-3 text-sm sm:text-base">Required Documents:</h3>
                                <ul className="space-y-2 text-xs sm:text-sm font-light text-neutral-300">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-white rounded-full" />
                                        Company Registration Certificate
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-white rounded-full" />
                                        Latest Emission Report (if available)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-white rounded-full" />
                                        GST/VAT Certificate
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-2">Compliance Bond</h2>
                                <p className="text-xs sm:text-sm text-neutral-400 font-light mb-6">
                                    Stake USDC as a compliance guarantee. Earn yield from DAMM vault.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-light text-neutral-400 mb-2">
                                    Bond Amount (USDC) *
                                </label>
                                <input
                                    type="number"
                                    name="bondAmount"
                                    value={formData.bondAmount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a] border border-zinc-900 rounded-md text-white font-light focus:outline-none focus:border-white transition-colors text-sm sm:text-base"
                                    placeholder="10000"
                                    min="1000"
                                    step="1000"
                                />
                                <p className="text-xs text-neutral-400 font-light mt-2">Minimum bond: $1,000 USDC</p>
                            </div>

                            <div className="bg-[#0a0a0a]/50 p-4 sm:p-6 rounded-lg space-y-3">
                                <h3 className="font-light mb-3 text-sm sm:text-base">Bond Benefits:</h3>
                                <div className="space-y-3 text-xs sm:text-sm font-light">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white mb-1">Earn Passive Yield</p>
                                            <p className="text-neutral-400">Your bond is deposited in a DAMM vault generating ~8-12% APY</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white mb-1">Compliance Incentive</p>
                                            <p className="text-neutral-400">50% of yield goes to compliant industries</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white mb-1">Withdrawable Anytime</p>
                                            <p className="text-neutral-400">Withdraw your bond once you exit the program</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-green-500/10 border border-green-500/20 rounded-lg gap-4">
                                <div>
                                    <p className="text-xs sm:text-sm text-neutral-400 font-light">Estimated Yearly Yield</p>
                                    <p className="text-lg sm:text-xl font-light text-green-500">
                                        ${((Number.parseFloat(formData.bondAmount) || 0) * 0.1).toFixed(2)} USDC
                                    </p>
                                </div>
                                <p className="text-xs sm:text-sm text-neutral-400 font-light">~10% APY</p>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                            </div>

                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-2">Application Complete!</h2>
                                <p className="text-xs sm:text-sm text-neutral-400 font-light mb-6">
                                    Your application is being processed
                                </p>
                            </div>

                            <div className="bg-[#0a0a0a]/50 p-4 sm:p-6 rounded-lg text-left space-y-4">
                                <h3 className="font-light mb-3 text-sm sm:text-base">What happens next:</h3>
                                <div className="space-y-3 text-xs sm:text-sm font-light">
                                    <div className="flex items-start gap-3">
                                        <span className="text-white font-bold">1.</span>
                                        <div>
                                            <p className="text-white">Document Verification</p>
                                            <p className="text-neutral-400">AI verifies your submitted documents (1-2 hours)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-white font-bold">2.</span>
                                        <div>
                                            <p className="text-white">On-Chain Attestation</p>
                                            <p className="text-neutral-400">Verified Industry NFT badge minted to your wallet</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-white font-bold">3.</span>
                                        <div>
                                            <p className="text-white">Bond Activation</p>
                                            <p className="text-neutral-400">USDC bond deposited into DAMM vault, starts earning yield</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-white font-bold">4.</span>
                                        <div>
                                            <p className="text-white">Dashboard Access</p>
                                            <p className="text-neutral-400">Access to full platform features</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                className="w-full bg-white text-black hover:bg-neutral-200 py-4 sm:py-6 text-sm sm:text-lg"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    {currentStep < 4 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 sm:mt-8 pt-6 border-t border-zinc-900">
                            <Button
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                variant="outline"
                                className="border-zinc-900 hover:bg-[#0a0a0a] disabled:opacity-30 w-full sm:w-auto bg-transparent"
                            >
                                Back
                            </Button>
                            <Button onClick={handleNext} className="bg-white text-black hover:bg-neutral-200 w-full sm:w-auto">
                                Continue
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
