'use client';

import * as React from 'react';

interface FallingCoin {
  id: number;
  left: number;
  size: number;
}

interface BurstCoin {
  id: number;
  tx: number;
  ty: number;
}

export function useCoinAnimation(uiTotalCashback: number) {
  const [fallingCoins, setFallingCoins] = React.useState<FallingCoin[]>([]);
  const [burstCoins, setBurstCoins] = React.useState<BurstCoin[]>([]);

  // Background falling coins effect
  React.useEffect(() => {
    const spawnCoin = () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      const id = Date.now();
      const left = Math.random() * 90 + 5;
      const size = Math.random() * 12 + 14;
      setFallingCoins((prev) => [...prev, { id, left, size }]);
      setTimeout(() => {
        setFallingCoins((prev) => prev.filter((c) => c.id !== id));
      }, 6000);
    };

    spawnCoin();
    const interval = setInterval(spawnCoin, 12000);
    return () => clearInterval(interval);
  }, []);

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
          id: Date.now() + i,
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
    fallingCoins,
    burstCoins,
  };
}
