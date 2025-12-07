import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        bege: '#F6F3EC',
        marrom: '#9D6F4D',
        marrom_claro: '#E9D9C9',
        azul_escuro: '#0F172A',
      },
      spacing: {
        'px-16': '16px',
        'px-18': '18px',
        'px-24': '24px',
        'px-32': '32px',
        'px-64': '64px',
        'px-80': '80px',
        'px-100': '100px',
      },
    },
  },
  plugins: [],
} satisfies Config
