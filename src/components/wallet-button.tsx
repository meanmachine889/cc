'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from './ui/button';

export function WalletButton() {
  const { publicKey, disconnect } = useWallet();

  if (publicKey) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm font-light text-neutral-300">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
        <Button
          onClick={disconnect}
          variant="outline"
          className="border-neutral-800 hover:bg-neutral-900"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return <WalletMultiButton className="!bg-white !text-black hover:!bg-neutral-200 !font-light !rounded-md !px-6 !py-2 !transition-colors" />;
}
