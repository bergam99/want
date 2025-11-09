export const amenityFormatter = (amenity: string) => {
  const formatted = amenity.includes("_") ? amenity.split("_")[1] : amenity;
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const generateMapLink = (
  type: "google" | "apple",
  lat: number,
  lon: number
) => {
  return type === "google"
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
    : `https://maps.apple.com/?daddr=${lat},${lon}`;
};

export const getToiletDescription = (
  female?: string,
  male?: string,
  unisex?: string
) => {
  if (unisex === "yes") return "Unisex toilet";
  if (female === "yes" && male === "yes")
    return "Separate toilets for male and female";
  if (female === "yes") return "For female";
  if (male === "yes") return "For male";
  return null;
};

export const getAccessDescription = (access?: string) => {
  switch (access) {
    case "yes":
      return "No key needed";
    case "customers":
      return "Requires a purchase. A key or code may be needed";
    case "centralkey":
      return "Central key needed";
    default:
      return null;
  }
};

export const getFranceTime = (isoString: string) => {
  const franceTime = new Date(isoString).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    // hour12: false,
  });
  return franceTime;
};

export const getAverageRating = (reviews: unknown) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return "0.0";

  const avg =
    reviews.reduce((acc, cur) => acc + (cur.rating || 0), 0) / reviews.length;

  return avg.toFixed(1);
};

type Review = {
  rating: number;
  [key: string]: any;
};

export const getRatingCounts = (reviews: Review[]): Record<number, number> => {
  const counts = reviews.reduce((acc, review) => {
    const rating = review.rating;
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const completeCounts: Record<number, number> = {};
  for (let i = 1; i <= 5; i++) {
    completeCounts[i] = counts[i] || 0;
  }
  return completeCounts;
};

export const emailFormatter = (input?: string): string => {
  if (!input) return "Unknown User";
  const formatted = input.slice(0, 3) + "···";
  return formatted;
};
