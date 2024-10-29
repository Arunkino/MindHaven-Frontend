/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'custom-bg': '#3B82F6',
        'custom-text': '#1E3A8A',
        'custom-accent': '#8B5CF6',
        'custom-mentor': '#11ba82',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'calm-pattern': "url('path-to-your-subtle-pattern.png')",
        'gradient-404': 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          '0%': { backgroundColor: 'rgba(0, 0, 0, 0)' },
          '100%': { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
        },
        fadeOut: {
          '0%': { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
          '100%': { backgroundColor: 'rgba(0, 0, 0, 0)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.5)', opacity: '0' },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            animationTimingFunction: 'ease-in-out',
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(2deg)',
            animationTimingFunction: 'ease-in-out',
          },
        },
        floatReverse: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            animationTimingFunction: 'ease-in-out',
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(-2deg)',
            animationTimingFunction: 'ease-in-out',
          },
        },
        heartbeat: {
          '0%, 100%': { 
            transform: 'scale(1)',
            animationTimingFunction: 'ease-in-out',
          },
          '50%': { 
            transform: 'scale(1.1)',
            animationTimingFunction: 'ease-in-out',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        fadeOut: 'fadeOut 0.3s ease-in forwards',
        zoomIn: 'zoomIn 0.3s ease-out forwards',
        zoomOut: 'zoomOut 0.3s ease-in forwards',
        'float-slow': 'float 6s infinite',
        'float-slower': 'floatReverse 8s infinite',
        'heartbeat': 'heartbeat 2s infinite',
        'wiggle': 'wiggle 2s infinite',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px 2px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}