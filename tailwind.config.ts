import type { Config } from 'tailwindcss';

const config: Config = {
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
        primary: 'var(--primary)',
        primaryHover: 'var(--primary-hover)',
        primaryLight: 'var(--primary-light)',
        primaryVeryLight: 'var(--primary-very-light)',
        gray: 'var(--gray)',
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)'],
      },
      screens: {
        'xs': '360px',
      },
    },
  },
  plugins: [],
};
export default config;
