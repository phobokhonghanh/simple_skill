import React from 'react';

interface CoinProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export const Coin: React.FC<CoinProps> = ({
  size = 24,
  className = '',
  animate = true,
}) => {
  return (
    <div
      className={`inline-block select-none pointer-events-none coin-2d ${animate ? 'coin-2d-spin' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-[0_1.5px_2px_rgba(217,119,6,0.35)]"
      >
        {/* Coin background gradient / layers */}
        <circle cx="50" cy="50" r="46" fill="#d97706" />
        <circle cx="50" cy="50" r="43" fill="#f59e0b" />

        {/* Dashed detail border */}
        <circle
          cx="50"
          cy="50"
          r="36"
          stroke="#b45309"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
        />

        {/* Inner coin plate */}
        <circle cx="50" cy="50" r="30" fill="#fbbf24" />
        <circle cx="50" cy="50" r="27" fill="#fef08a" />

        {/* Symbol */}
        <text
          x="50"
          y="61"
          textAnchor="middle"
          fontSize="36"
          fontWeight="bold"
          fill="#a16207"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          ₫
        </text>
      </svg>
    </div>
  );
};

export default Coin;
