import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ShieldCheck, BrainCircuit, LineChart, BarChart4 } from "lucide-react"
import type { ReactNode } from "react"

export default function Features() {
  return (
    <section className="bg-zinc-50 dark:bg-black min-w-full ">
      <div className="@container mx-auto items-start flex flex-col px-4 md:px-14">
        <div className="text-left">
          <h2 className="text-balance text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Why Choose Us</h2>
          <p className="mt-3 sm:mt-4 md:mt-5 text-base sm:text-lg md:text-2xl text-muted-foreground">
            The world&apos;s first decentralized carbon compliance<br /> protocol powered by Solana
          </p>
        </div>

        <Card className="@min-4xl:max-w-full dark:bg-transparent py-0 gap-0 rounded-none @min-4xl:grid-cols-4 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 md:mt-16 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:max-w-full">
          <div className="group bg-white dark:bg-zinc-950/50 py-4 sm:py-6 md:py-8">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDecorator>
                <BrainCircuit className="size-4 sm:size-5 md:size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-4 sm:mt-5 md:mt-6 text-base sm:text-lg font-medium">Instant AI Onboarding</h3>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Join in minutes. Our AI automates document verification and setup, eliminating complex paperwork.
              </p>
            </CardContent>
          </div>

          {/* Feature 2: Dynamic & Transparent Pricing */}
          <div className="group bg-white dark:bg-zinc-950/50 py-4 sm:py-6 md:py-8">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDecorator>
                <LineChart className="size-4 sm:size-5 md:size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-4 sm:mt-5 md:mt-6 text-base sm:text-lg font-medium">Dynamic & Transparent Pricing</h3>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Our on-chain bonding curve ensures CCT prices reflect true market demand, with no auctions or delays.
              </p>
            </CardContent>
          </div>

          {/* Feature 3: Productive Compliance Bonds */}
          <div className="group bg-white dark:bg-zinc-950/50 py-4 sm:py-6 md:py-8">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDecorator>
                <BarChart4 className="size-4 sm:size-5 md:size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-4 sm:mt-5 md:mt-6 text-base sm:text-lg font-medium">Productive Compliance Bonds</h3>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Don&apos;t let your capital sit idle. Your USDC bond is put to work in a DAMM vault to earn you yield.
              </p>
            </CardContent>
          </div>

          {/* Feature 4: Verifiable On-Chain Compliance */}
          <div className="group bg-white dark:bg-zinc-950/50 py-4 sm:py-6 md:py-8">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDecorator>
                <ShieldCheck className="size-4 sm:size-5 md:size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-4 sm:mt-5 md:mt-6 text-base sm:text-lg font-medium">Verifiable On-Chain Compliance</h3>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Showcase your commitment with immutable proof and a &quot;Verified Industry&quot; NFT on the Solana
                blockchain.
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-24 sm:size-28 md:size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />
    <div className="bg-[#101010] border absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t text-zinc-400">
      {children}
    </div>
  </div>
)
