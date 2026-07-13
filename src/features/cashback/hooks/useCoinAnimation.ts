'use client';

import * as React from 'react';

interface BurstCoin {
  id: string;
  tx: number;
  ty: number;
}

export function useCoinAnimation(uiTotalCashback: number) {
  const [burstCoins, setBurstCoins] = React.useState<BurstCoin[]>([]);

  // Spawn coin burst when total cashback increases
  const prevTotalRef = React.useRef(uiTotalCashback);
  React.useEffect(() => {
    if (uiTotalCashback > prevTotalRef.current) {
      const newCoins = Array.from({ length: 6 }).map((_, i) => {
        const angle = i * 60 + Math.random() * 20 - 10;
        const rad = (angle * Math.PI) / 180;
        const speed = Math.random() * 25 + 25;
        const tx = Math.cos(rad) * speed;
        const ty = Math.sin(rad) * -speed - 20;
        return {
          id: `${Date.now()}-${i}-${Math.random()}`,
          tx,
          ty,
        };
      });
      setBurstCoins(newCoins);
      const timer = setTimeout(() => {
        setBurstCoins([]);
      }, 800);
      return () => clearTimeout(timer);
    }
    prevTotalRef.current = uiTotalCashback;
  }, [uiTotalCashback]);

  return {
    fallingCoins: [],
    burstCoins,
  };
}
