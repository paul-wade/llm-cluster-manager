export const MotherIllustration = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background starburst */}
    <path
      d="M200 0 L220 180 L400 200 L220 220 L200 400 L180 220 L0 200 L180 180 Z"
      fill="currentColor"
      className="text-purple-500/10"
    />
    <circle
      cx="200"
      cy="200"
      r="160"
      className="text-purple-500/5"
      fill="currentColor"
    />

    {/* Hair with curlers */}
    {[...Array(6)].map((_, i) => (
      <g key={i} className="text-cyan-400">
        <circle
          cx={150 + i * 20}
          cy="100"
          r="15"
          fill="currentColor"
          className="opacity-80"
        />
        <circle
          cx={150 + i * 20}
          cy="100"
          r="12"
          fill="currentColor"
          className="opacity-90"
        />
      </g>
    ))}

    {/* Face */}
    <path
      d="M160 120 C160 120, 200 180, 240 120"
      stroke="currentColor"
      strokeWidth="3"
      className="text-purple-300"
      fill="none"
    />
    
    {/* Determined expression */}
    <path
      d="M180 140 L190 150 M210 150 L220 140"
      stroke="currentColor"
      strokeWidth="3"
      className="text-purple-300"
    />

    {/* Dress/Apron */}
    <path
      d="M140 180 
         L160 160 
         L240 160 
         L260 180
         L270 300
         L130 300
         Z"
      className="text-green-400/50"
      fill="currentColor"
    />

    {/* Apron details */}
    <path
      d="M160 180 
         L240 180
         L230 280
         L170 280
         Z"
      className="text-green-200/30"
      fill="currentColor"
    />

    {/* Arms akimbo */}
    <path
      d="M120 200 Q140 220 130 240"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      className="text-purple-300"
    />
    <path
      d="M280 200 Q260 220 270 240"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      className="text-purple-300"
    />

    {/* Rolling pin */}
    <rect
      x="290"
      y="180"
      width="60"
      height="15"
      rx="7.5"
      className="text-amber-600/70"
      fill="currentColor"
    />
  </svg>
);
