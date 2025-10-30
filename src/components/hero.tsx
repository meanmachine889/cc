import Waitlist from "./waitlist"
import Image from "next/image"
import Iridescence from './Iridescence';

export function Hero() {
    return (
        <div className="w-full h-full rounded-lg overflow-hidden mx-auto my-8 relative">
            <div className="absolute inset-0">
            {/*<Image*/}
            {/*    src="https://res.cloudinary.com/dnfv0h10u/image/upload/v1760505444/pawel-czerwinski-kyo00lYIkLQ-unsplash_m0iynd.jpg"*/}
            {/*    alt="Background"*/}
            {/*    fill*/}
            {/*    priority*/}
            {/*    quality={85}*/}
            {/*    sizes="100vw"*/}
            {/*    className="object-cover object-center"*/}
            {/*/>*/}
                <Iridescence
                    color={[1, 1, 1]}
                    mouseReact={true}
                    amplitude={0.1}
                    speed={1.0}
                />
            </div>
            <div className="absolute inset-0 bg-background/60" />
            <Waitlist />
        </div>
    )
}
