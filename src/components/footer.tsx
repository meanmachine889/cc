import Link from 'next/link'
import Image from 'next/image'

const links = [
    {
        title: 'Features',
        href: '#',
    },
    {
        title: 'Solution',
        href: '#',
    },
    {
        title: 'Customers',
        href: '#',
    },
    {
        title: 'Pricing',
        href: '#',
    },
    {
        title: 'Help',
        href: '#',
    },
    {
        title: 'About',
        href: '#',
    },
]

export default function FooterSection() {
    return (
        <footer className="py-16">
            <div className="mx-auto flex flex-col justify-center items-center max-w-5xl px-6">
                <Link href="/" aria-label="go home" className="flex mb-5 items-center justify-center w-full">
                    <div className="flex justify-center mb-3 w-full">
                        <Image
                            src="https://res.cloudinary.com/dnfv0h10u/image/upload/v1760612034/Component_1_2_qomzst.svg"
                            alt="Carbon on Chain Logo"
                            width={100}
                            height={100}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                        />
                    </div>
                </Link>

                <p className="text-3xl text-center">Carbon on Chain</p>
                <p className="mt-2 text-center flex text-sm sm:text-base">
                    Stay updated and follow us
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm">
                    <Link
                        href="https://x.com/CarbonOnChain"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X/Twitter"
                        className="text-muted-foreground hover:text-primary block bg-[#0a0a0a] border-2 rounded-lg p-2"
                    >
                        <svg
                            className="size-6"
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
                            ></path>
                        </svg>
                    </Link>
                </div>
            </div>
        </footer>
    )
}