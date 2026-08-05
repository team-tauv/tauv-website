/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind CSS v4 tek PostCSS eklentisi kullanır; autoprefixer dahilidir.
    "@tailwindcss/postcss": {},
  },
};

export default config;
