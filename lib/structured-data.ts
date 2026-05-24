export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Royal Fitness Gym",
  "image": "https://royalfitnessgym.com/images/gym_hero_bg.png", // Use generated image URL later
  "@id": "https://royalfitnessgym.com",
  "url": "https://royalfitnessgym.com",
  "telephone": "074796 49999",
  "priceRange": "₹999 - ₹2499",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sarada Nagar, Karmika Nagar, Pendurthi, Chinnamusidivada",
    "addressLocality": "Andhra Pradesh",
    "postalCode": "531173",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 17.8242,
    "longitude": 83.1974
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "05:00",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "06:00",
      "closes": "20:00"
    }
  ],
  "sameAs": [
    "https://facebook.com/royalfitnessgym",
    "https://instagram.com/royalfitnessgym",
    "https://youtube.com/royalfitnessgym"
  ]
};
