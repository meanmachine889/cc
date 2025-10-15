export function Hero() {
    return (
        <div className="min-h-screen min-w-full overflow-hidden flex justify-start items-end p-9 bg-black">
            <div className="w-[80%] h-[80vh] relative rounded-lg overflow-hidden mx-auto my-8">
                <img
                    src="https://res.cloudinary.com/dnfv0h10u/image/upload/v1760505437/mymind-XUlsF9LYeVk-unsplash_yqvnet.jpg"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background/35 to-background/10" />

                <div className="absolute bottom-0 left-0 p-6">
                    <div className="max-w-xl rounded-lg border border-border bg-background/70 p-5 backdrop-blur-sm md:p-6">
                        <h1 className="text-pretty text-3xl font-extralight leading-tight md:text-5xl">
                            Thoughtful design, minimal by nature
                        </h1>
                        <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground md:text-base">
                            Calm aesthetics meet practical craft. Join the waitlist to be first in line.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
