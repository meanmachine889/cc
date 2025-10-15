import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ShieldCheck, Network, BrainCircuit, Gavel, Leaf, LineChart } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent min-w-full">
            <div className="@container mx-auto max-w-6xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl lg:text-5xl">
                        Why Choose Us
                    </h2>
                    <p className="mt-5 text-xl text-muted-foreground">
                        The world&apos;s first decentralized carbon compliance protocol <br/>powered by Solana
                    </p>
                </div>

                <Card className="@min-4xl:max-w-full dark:bg-transparent py-0 gap-0 @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16">
                    <div className="group shadow-zinc-950/5 py-7 border-b">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <BrainCircuit className="size-6" aria-hidden />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">AI-Assisted Onboarding</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Smart, guided KYC and registration powered by AI for seamless onboarding.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5 py-7 border-b">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <ShieldCheck className="size-6" aria-hidden />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">Role-Based Access</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Granular permissions with dedicated roles for minting, KYC, and auction control.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5 py-7 border-b">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Gavel className="size-6" aria-hidden />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">Dutch Auction Trading</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Dynamic pricing with real-time bids and instant settlements on Solana.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5 py-7 border-b">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <LineChart className="size-6" aria-hidden />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">Real-Time Compliance</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Automatic emissions reporting and compliance status updates on-chain.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5 py-7 border-b">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Leaf className="size-6" aria-hidden />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">Secure Tokenization</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Metadata-rich carbon credits with verified CO₂ tonnage and expiry control.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5 py-7 border-b">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Network className="size-6" aria-hidden />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">On-Chain Transparency</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Every major operation emits verifiable events for total system visibility.</p>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />
        <div className="bg-zinc-900 border absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t text-zinc-400">
            {children}
        </div>
    </div>
)
