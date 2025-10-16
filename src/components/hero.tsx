import { Mail, SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Hero() {
    return (
        <div className="w-full h-full rounded-lg overflow-hidden mx-auto my-8 relative">
            <img
                src="https://res.cloudinary.com/dnfv0h10u/image/upload/v1760505444/pawel-czerwinski-kyo00lYIkLQ-unsplash_m0iynd.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-background/70" />

            <div className="absolute bottom-0 left-0 md:p-6 md:py-0 py-4 w-full">
                <div className="rounded-lg p-4 sm:p-5 md:p-6">
                    <h1 className="text-2xl sm:text-4xl md:text-7xl leading-tight">Carbon on Chain</h1>
                    <p className="mt-1 text-xl sm:text-2xl md:text-4xl leading-relaxed text-gray-200">
                        Decentralized Carbon Credits Management
                    </p>
                    <p className="text-base sm:text-lg md:text-2xl md:w-[80%] w-full font-light leading-relaxed text-gray-300 mt-2 md:mt-4">
                        Automate your compliance and trade carbon credits on a dynamic, transparent market powered by Solana.
                    </p>
                    <div className="flex gap-3 flex-col items-start mt-4 md:mt-6">
                        <div>
                            <div className="*:data-[slot=avatar]:ring-background flex h-full items-center -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                    <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                                    <AvatarFallback>LR</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                    <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                                    <AvatarFallback>ER</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                    <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                                    <AvatarFallback>ER</AvatarFallback>
                                </Avatar>
                            </div>
                            <p className="mt-1 text-sm sm:text-base">18 people have already joined the waitlist</p>
                        </div>
                        <form action="" className="w-full max-w-md">
                            <div className="bg-zinc-600 p-1 py-1 has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-xl border shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                                <Mail className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />
                                <input
                                    placeholder="Join the waitlist"
                                    className="h-12 sm:h-14 rounded-lg w-full pl-16 focus:outline-none text-sm sm:text-base"
                                    type="email"
                                />

                                <div className="mx-1 w-full">
                                    <Button className="rounded-lg min-h-full" aria-label="submit">
                                        <SendHorizonal className="" />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
