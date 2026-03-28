/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#915EFF',
        secondary: '#00d9ff',
        dark:      '#050816',
        card:      '#0d0d2b',
        'card-alt':'#111132',
        muted:     '#aaa6c3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(145,94,255,0.18) 0%, transparent 60%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'glow-purple':
          'radial-gradient(circle, rgba(145,94,255,0.35) 0%, transparent 70%)',
        'glow-cyan':
          'radial-gradient(circle, rgba(0,217,255,0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-sm':  '0 0 15px rgba(145,94,255,0.3)',
        'glow-md':  '0 0 30px rgba(145,94,255,0.4)',
        'glow-lg':  '0 0 60px rgba(145,94,255,0.3)',
        'glow-cyan':'0 0 30px rgba(0,217,255,0.35)',
        card:       '0 8px 32px rgba(0,0,0,0.5)',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'pulse-slow':   'pulse 4s ease-in-out infinite',
        'spin-slow':    'spin 20s linear infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'scan':         'scan 3s linear infinite',
        'orbit':        'orbit 8s linear infinite',
        'orbit-rev':    'orbit 12s linear infinite reverse',
        'data-stream':  'dataStream 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':     { opacity: '1',   transform: 'scale(1.05)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(70px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(70px) rotate(-360deg)' },
        },
        dataStream: {
          '0%':   { transform: 'translateY(0)',    opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translateY(-200px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
