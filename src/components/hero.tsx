import Waitlist from "./waitlist"

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
            <Waitlist />
        </div>
    )
}
