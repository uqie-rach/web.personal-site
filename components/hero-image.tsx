export function HeroImage() {
  return (
    <div className="relative w-full h-96 md:h-full min-h-96">
      <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background gradient shapes */}
        <circle cx="200" cy="200" r="150" fill="url(#heroGradient)" opacity="0.1" />
        <path d="M 100 200 Q 150 100 200 50 Q 250 100 300 200" stroke="currentColor" strokeWidth="2" opacity="0.2" />

        {/* Center elements */}
        <g id="code-elements">
          <rect
            x="120"
            y="160"
            width="160"
            height="80"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
          <line x1="130" y1="180" x2="270" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <line x1="130" y1="200" x2="270" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        </g>

        <defs>
          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
