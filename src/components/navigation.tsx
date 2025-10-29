'use client';

import Link from 'next/link';
import { WalletButton } from './wallet-button';
import Image from 'next/image';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800/50 backdrop-blur-xl bg-black/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://res.cloudinary.com/dnfv0h10u/image/upload/v1737746882/Component_1_2_qomzst.svg"
              alt="Carbon on Chain Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-light text-white hidden sm:inline">Carbon on Chain</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden lg:inline-block px-4 py-2 text-sm font-light text-neutral-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/auctions"
              className="hidden lg:inline-block px-4 py-2 text-sm font-light text-neutral-300 hover:text-white transition-colors"
            >
              Auctions
            </Link>
            <Link
              href="/marketplace"
              className="hidden lg:inline-block px-4 py-2 text-sm font-light text-neutral-300 hover:text-white transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/report"
              className="hidden lg:inline-block px-4 py-2 text-sm font-light text-neutral-300 hover:text-white transition-colors"
            >
              Report
            </Link>
            <Link
              href="/history"
              className="hidden lg:inline-block px-4 py-2 text-sm font-light text-neutral-300 hover:text-white transition-colors"
            >
              History
            </Link>
            <Link
              href="/onboard"
              className="hidden md:inline-block px-4 py-2 bg-white text-black rounded-md text-sm font-light hover:bg-neutral-200 transition-colors"
            >
              Join as Industry
            </Link>
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
