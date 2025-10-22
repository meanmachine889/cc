"use client";

import React, { useState, useEffect } from "react"; // Import useEffect
import { Mail, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Waitlist = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [waitlistCount, setWaitlistCount] = useState(0);

    useEffect(() => {
        const fetchWaitlistCount = async () => {
            try {
                const res = await fetch("/api/count");
                if (res.ok) {
                    const data = await res.json();
                    setWaitlistCount(data.count);
                }
            } catch (error) {
                console.error("Failed to fetch waitlist count:", error);
            }
        };

        fetchWaitlistCount();
    }, []);
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) {
            toast("Missing email", {
                description: "Please enter your email to join the waitlist.",
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/waitlists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                toast("You're on the list! 🎉", {
                    description: "Thanks for joining. Check your inbox for confirmation.",
                });
                setEmail("");
                setWaitlistCount((prevCount) => prevCount + 1);
            } 
            else if (res.status === 409) {
                toast("You're already on the list!", {
                    description: "We already have your email.",
                });
            }
            else {
                toast("Oops!", {
                    description: data.message || "Something went wrong.",
                });
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast("Oops!", {
                description: "Unable to join waitlist. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
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
                        <p className="mt-1 text-sm sm:text-base">
                            Join {waitlistCount} others on the waitlist!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full max-w-md">
                        <div className="bg-zinc-600 p-1 py-1 has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-xl border shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                            <Mail className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />
                            <input
                                placeholder="Join the waitlist"
                                className="h-12 sm:h-14 rounded-lg w-full pl-16 focus:outline-none text-sm sm:text-base"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="mx-1 w-full">
                                <Button
                                    className="rounded-lg min-h-full"
                                    aria-label="submit"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "..." : <SendHorizonal />}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Waitlist;