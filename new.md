npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

// config
content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  //index.css
  @tailwind base;
@tailwind components;
@tailwind utilities;
