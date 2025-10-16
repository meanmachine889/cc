"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function FAQsThree() {
  return (
    <div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 bg-zinc-200 px-4 sm:px-8 md:px-15 md:py-20 py-12 overflow-x-hidden w-full rounded-xl">
      <div className="max-w-xl">
        <h1 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
          Frequently Asked
          <br className="hidden sm:block" />
          Questions
        </h1>
        <p className="mt-3 sm:mt-4 md:mt-5 text-base sm:text-lg md:text-2xl text-zinc-700 leading-relaxed">
          Everything you need to know about decentralized carbon compliance
        </p>
      </div>

      <div className="min-w-0">
        <Accordion type="single" collapsible defaultValue="item-2" className="space-y-2 sm:space-y-3 w-full">
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value} className="border-none w-full">
              <div className="rounded-xl border border-zinc-400 w-full">
                <AccordionTrigger className="group [&>svg]:hidden px-3 sm:px-4 py-3 sm:py-4 text-left hover:no-underline w-full">
                  <div className="flex w-full items-center gap-2 sm:gap-3">
                    <span className="text-black font-light text-base sm:text-lg break-words">{item.question}</span>
                    <span className="ml-auto inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-lg rounded-md text-black group-data-[state=open]:hidden">
                      +
                    </span>
                    <span className="ml-auto hidden h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-lg rounded-md text-black group-data-[state=open]:inline-flex">
                      −
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="overflow-hidden">
                  <div className="rounded-lg p-3 sm:p-4 pr-5 sm:pr-7">
                    <p className="text-base sm:text-lg text-black leading-relaxed">{item.answer}</p>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

const items = [
    {
        value: "item-1",
        question: "What are Carbon Credit Tokens (CCT)?",
        answer: "CCTs are SPL tokens on Solana where 1 CCT represents the right to emit 1 tonne of CO₂. They're tokenized carbon credits that can be traded, burned for compliance, or held as environmental assets.",
    },
    {
        value: "item-2",
        question: "What services do you offer?",
        answer:
            "We provide a range of services, including digital banking solutions, payment processing, risk management, and compliance tools.",
    },
    {
        value: "item-3",
        question: "How do dutch auctions work for carbon credits?",
        answer:
            "Monthly Dutch auctions start at a high price and decrease over time. The cheapest buyers win when they place bids. This ensures fair price discovery and efficient allocation of carbon credits to industries.",
    },
    {
        value: "item-4",
        question: "What happens if I exceed my emissions allowance?",
        answer:
            "If you emit more CO₂ than your CCT holdings allow, our smart contract automatically purchases additional credits using your USDC bond. If your bond is insufficient, your account gets frozen until compliance is restored.",
    },
    {
        value: "item-5",
        question: "Do I need IoT sensors for emissions tracking?",
        answer: "No! CarbonOnChain is web-only. Industries self-report emissions through our dApp, and compliance is enforced through smart contracts and on-chain attestations rather than physical sensors.",
    },
    {
        value: "item-6",
        question: "How does the bond system work?",
        answer: "Tndustries must stake USDC as a security deposit (e.g., ₹1,00,000 worth). This bond is used for auto-purchasing credits when needed, paying fines for violations, and ensuring compliance with environmental regulations.",
    },
    {
        value: "item-7",
        question: "Can I trade my carbon credits with other companies?",
        answer: "Yes! CarbonOnChain includes a built-in DEX for secondary trading. You can swap USDC ↔ CCT or trade credits directly with other industries on our marketplace integrated with Solana.",
    },
    {
        value: "item-8",
        question: "What are on-chain attestations?",
        answer: "Digital signatures and compliance proofs that live permanently on the blockchain. These provide immutable records of your environmental compliance and can be verified by regulators or third parties at any time.",
    },
    {
        value: "item-9",
        question: "How do I get started with CarbonOnChain?",
        answer: "Sign up on our dApp, complete KYC verification, stake your USDC bond, and participate in monthly Dutch auctions to acquire carbon credits. Start reporting emissions and trading on our decentralized marketplace.",
    },
]
