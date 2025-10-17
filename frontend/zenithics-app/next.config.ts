/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add the quality values you use here
    qualities: [80, 90], 
  },

  devIndicators: {
    // Add the origin from the warning message
    allowedDevOrigins: ['http://192.168.0.106:3001'], 
  },

};

module.exports = nextConfig;
module.exports = {
   allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
 }

 
