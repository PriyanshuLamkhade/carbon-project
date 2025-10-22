'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
//@ts-ignore
import '@solana/wallet-adapter-react-ui/styles.css';

export function Wallet({ children }: { children: React.ReactNode }) {
  // ✅ All hooks must be called unconditionally and in the same order
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Still safe to define wallets here even if unused before mount
  const wallets = useMemo(() => [], []);

  // ✅ Delay render until client-side to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            {children}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
