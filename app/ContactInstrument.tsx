export function ContactInstrument() {
  return (
    <div className="contact-instrument" aria-hidden="true">
      <div className="contact-instrument__halo" />
      <svg className="contact-instrument__dial" viewBox="0 0 520 520" focusable="false">
        <defs>
          <linearGradient id="contactDialStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b9d8f4" stopOpacity="0.18" />
            <stop offset="0.52" stopColor="#cdb4ff" stopOpacity="0.72" />
            <stop offset="1" stopColor="#d79277" stopOpacity="0.28" />
          </linearGradient>
          <radialGradient id="contactDialCore" cx="50%" cy="44%" r="58%">
            <stop offset="0" stopColor="#d8c7ff" stopOpacity="0.18" />
            <stop offset="0.56" stopColor="#8eb9df" stopOpacity="0.05" />
            <stop offset="1" stopColor="#090a11" stopOpacity="0" />
          </radialGradient>
          <filter id="contactDialGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="260" cy="260" r="236" fill="url(#contactDialCore)" />

        <g className="contact-instrument__rotor">
          <circle className="contact-instrument__outer" cx="260" cy="260" r="226" pathLength="360" />
          <circle className="contact-instrument__ticks" cx="260" cy="260" r="205" pathLength="300" />
          <circle className="contact-instrument__inner" cx="260" cy="260" r="166" pathLength="100" />
          <path className="contact-instrument__orbit" d="M 78 254 C 124 108, 391 74, 449 244 C 492 370, 356 458, 220 430 C 111 408, 40 330, 78 254 Z" />
          <circle className="contact-instrument__frame-dot" cx="412" cy="126" r="4" />
          <circle className="contact-instrument__frame-dot contact-instrument__frame-dot--warm" cx="96" cy="347" r="3.5" />
        </g>

        <g className="contact-instrument__wave">
          <path d="M118 280 L129 280 L136 259 L144 301 L154 244 L164 316 L176 268 L188 287 L200 257 L211 302 L223 274 L235 283 L247 252 L259 310 L271 265 L284 289 L296 250 L308 305 L321 272 L334 284 L347 258 L360 298 L373 277 L389 280 L402 280" />
        </g>

        <g className="contact-instrument__playhead">
          <line x1="260" y1="260" x2="358" y2="124" />
          <circle cx="260" cy="260" r="40" />
          <circle cx="260" cy="260" r="5" />
          <path d="M250 243 L250 277 L278 260 Z" />
        </g>

        <g className="contact-instrument__labels">
          <text x="260" y="42" textAnchor="middle">IN / 00</text>
          <text x="478" y="264" textAnchor="middle">CUT / 05</text>
          <text x="260" y="494" textAnchor="middle">OUT / 24</text>
          <text x="42" y="264" textAnchor="middle">25 FPS</text>
        </g>
      </svg>

      <div className="contact-instrument__readout">
        <span>TC</span>
        <strong>00:01:24:12</strong>
        <small>FRAME 0612&nbsp;&nbsp;/&nbsp;&nbsp;25 FPS</small>
      </div>
    </div>
  );
}