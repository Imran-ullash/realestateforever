// Approximate ZIP codes for vehicle "City, ST" locations. The vehicle source
// data has no ZIPs, so each city is mapped to a representative ZIP centroid.
export const vehicleLocationZips: Record<string, string> = {
  "Anaheim, CA": "92805",
  "Charlottesville, VA": "22902",
  "Dallas, TX": "75201",
  "Destin, FL": "32541",
  "Fort Bragg, CA": "95437",
  "Jamesport, MO": "64648",
  "Johnson City, TN": "37601",
  "Keller, TX": "76248",
  "Lee County, GA": "31763",
  "Loomis, CA": "95650",
  "McAllen, TX": "78501",
  "Ohio, OH": "43215",
  "Orange, CA": "92866",
  "Phoenix, AZ": "85004",
  "Poplar Bluff, MO": "63901",
  "San Antonio, TX": "78205",
  "San Jacinto, CA": "92583",
  "Sherrill, NY": "13461",
  "Texas, TX": "78701",
};
