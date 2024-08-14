/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEOLOC: process.env.GEOLOC,
    WEATHER: process.env.WEATHER,
  },
  async rewrites() {
    return [
      {
        source: "/api",
        destination: "http://localhost:3000/api/",
      },
      {
        source: "/weather",
        destination: "http://api.openweathermap.org/",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/weather",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "http://api.openweathermap.org/",
          }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
