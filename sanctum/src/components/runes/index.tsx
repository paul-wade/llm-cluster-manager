interface RuneProps {
  className?: string;
}

export const OverseerRune = ({ className = "" }: RuneProps) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
    <path
      d="M50 5 L50 95 M5 50 L95 50 M20 20 L80 80 M80 20 L20 80"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const SeerRune = ({ className = "" }: RuneProps) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 5 L95 50 L50 95 L5 50 Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" />
    <path
      d="M50 20 L50 80 M20 50 L80 50"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export const ScribeRune = ({ className = "" }: RuneProps) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 20 L80 20 L80 80 L20 80 Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M35 35 L65 35 L65 65 L35 65 Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M50 20 L50 35 M50 65 L50 80"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export const WatcherRune = ({ className = "" }: RuneProps) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
    <path
      d="M25 50 C25 25, 75 25, 75 50 C75 75, 25 75, 25 50"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const KeeperRune = ({ className = "" }: RuneProps) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 5 L95 50 L50 95 L5 50 Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M50 20 L80 50 L50 80 L20 50 Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const TesterRune = ({ className = "" }: RuneProps) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
    <path
      d="M30 30 L70 70 M30 70 L70 30"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const MotherRune = ({ className = "" }: RuneProps) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer protective circle */}
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
    
    {/* Inner heart shape */}
    <path
      d="M50 70 
         C 50 70, 80 45, 50 20
         C 20 45, 50 70, 50 70"
      stroke="currentColor"
      strokeWidth="2"
    />
    
    {/* Watchful eyes */}
    <circle cx="35" cy="45" r="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="65" cy="45" r="5" stroke="currentColor" strokeWidth="2" />
    
    {/* Connection lines representing oversight */}
    <path
      d="M20 50 L35 45 M65 45 L80 50"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
