import dealdeck01 from "@/assets/listings/dealdeck-01.jpg.asset.json";
import dealdeck02 from "@/assets/listings/dealdeck-02.jpg.asset.json";
import dealdeck03 from "@/assets/listings/dealdeck-03.jpg.asset.json";
import dealdeck04 from "@/assets/listings/dealdeck-04.jpg.asset.json";
import dealdeck05 from "@/assets/listings/dealdeck-05.jpg.asset.json";
import dealdeck06 from "@/assets/listings/dealdeck-06.jpg.asset.json";
import dealdeck07 from "@/assets/listings/dealdeck-07.jpg.asset.json";
import dealdeck08 from "@/assets/listings/dealdeck-08.jpg.asset.json";
import dealdeck09 from "@/assets/listings/dealdeck-09.jpg.asset.json";
import dealdeck10 from "@/assets/listings/dealdeck-10.jpg.asset.json";
import dealdeck11 from "@/assets/listings/dealdeck-11.jpg.asset.json";
import dealdeck12 from "@/assets/listings/dealdeck-12.jpg.asset.json";
import dealdeck13 from "@/assets/listings/dealdeck-13.jpg.asset.json";
import dealdeck14 from "@/assets/listings/dealdeck-14.jpg.asset.json";
import dealdeck15 from "@/assets/listings/dealdeck-15.jpg.asset.json";
import dealdeck16 from "@/assets/listings/dealdeck-16.jpg.asset.json";
import dealdeck17 from "@/assets/listings/dealdeck-17.jpg.asset.json";
import dealdeck18 from "@/assets/listings/dealdeck-18.jpg.asset.json";
import dealdeck19 from "@/assets/listings/dealdeck-19.jpg.asset.json";
import dealdeck20 from "@/assets/listings/dealdeck-20.jpg.asset.json";
import dealdeck21 from "@/assets/listings/dealdeck-21.jpg.asset.json";
import dealdeck22 from "@/assets/listings/dealdeck-22.jpg.asset.json";
import dealdeck23 from "@/assets/listings/dealdeck-23.jpg.asset.json";
import dealdeck24 from "@/assets/listings/dealdeck-24.jpg.asset.json";
import dealdeck25 from "@/assets/listings/dealdeck-25.jpg.asset.json";
import dealdeck26 from "@/assets/listings/dealdeck-26.jpg.asset.json";
import dealdeck27 from "@/assets/listings/dealdeck-27.jpg.asset.json";
import dealdeck28 from "@/assets/listings/dealdeck-28.jpg.asset.json";
import dealdeck29 from "@/assets/listings/dealdeck-29.jpg.asset.json";
import dealdeck30 from "@/assets/listings/dealdeck-30.jpg.asset.json";
import dealdeck31 from "@/assets/listings/dealdeck-31.jpg.asset.json";
import dealdeck32 from "@/assets/listings/dealdeck-32.jpg.asset.json";
import dealdeck33 from "@/assets/listings/dealdeck-33.jpg.asset.json";
import dealdeck34 from "@/assets/listings/dealdeck-34.jpg.asset.json";
import dealdeck35 from "@/assets/listings/dealdeck-35.jpg.asset.json";
import dealdeck36 from "@/assets/listings/dealdeck-36.jpeg.asset.json";
import dealdeck37 from "@/assets/listings/dealdeck-37.png.asset.json";
import dealdeck38 from "@/assets/listings/dealdeck-38.png.asset.json";

export type Listing = {
  id: number;
  image: string;
  city: string;
  state: string;
  zip: string;
  beds: string;
  baths: string;
  area: string;
  entry: string;
  down: string;
  arv: string;
  type: string;
  lister: string;
  isNew: boolean;
};

export const listings: Listing[] = [
  { id: 1, image: dealdeck01.url, city: "Acworth", state: "GA", zip: "30101", beds: "3", baths: "2.5", area: "1,780", entry: "$12,000", down: "3.1% Down", arv: "", type: "Subject To", lister: "Boulder Capital Investments", isNew: true },
  { id: 2, image: dealdeck02.url, city: "Lake City", state: "FL", zip: "32025", beds: "4", baths: "2", area: "2,205", entry: "$35,000", down: "7.8% Down", arv: "", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 3, image: dealdeck03.url, city: "Savannah", state: "GA", zip: "31401", beds: "5", baths: "3", area: "3,236", entry: "$30,000", down: "8.0% Down", arv: "", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 4, image: dealdeck04.url, city: "Franklin", state: "GA", zip: "30217", beds: "3", baths: "1.5", area: "1,104", entry: "$25,000", down: "9.7% Down", arv: "", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 5, image: dealdeck05.url, city: "Conyers", state: "GA", zip: "30012", beds: "4", baths: "2", area: "2,320", entry: "$5,000", down: "1.5% Down", arv: "$335,000", type: "Subject To", lister: "Wokoma Capital", isNew: false },
  { id: 6, image: dealdeck06.url, city: "Griffin", state: "GA", zip: "30223", beds: "4", baths: "2.5", area: "2,336", entry: "$5,000", down: "1.6% Down", arv: "", type: "Subject To", lister: "Wokoma Capital", isNew: false },
  { id: 7, image: dealdeck07.url, city: "Cartersville", state: "GA", zip: "30120", beds: "3", baths: "2", area: "1,614", entry: "$25,000", down: "10.4% Down", arv: "$240,000", type: "Subject To", lister: "Wokoma Capital", isNew: false },
  { id: 8, image: dealdeck08.url, city: "Cartersville", state: "GA", zip: "30120", beds: "4", baths: "3", area: "1,195", entry: "$22,000", down: "6.4% Down", arv: "", type: "Subject To", lister: "Wokoma Capital", isNew: false },
  { id: 9, image: dealdeck09.url, city: "Atlanta", state: "GA", zip: "30337", beds: "3", baths: "2", area: "1,110", entry: "$5,000", down: "2.8% Down", arv: "", type: "Subject To", lister: "Wokoma Capital", isNew: false },
  { id: 10, image: dealdeck10.url, city: "Temple", state: "TX", zip: "76501", beds: "4", baths: "2.5", area: "3,242", entry: "$20,000", down: "10.5% Down", arv: "", type: "Subject To", lister: "Wokoma Capital", isNew: false },
  { id: 11, image: dealdeck11.url, city: "Trion", state: "GA", zip: "30753", beds: "4", baths: "2", area: "1,865", entry: "$10,000", down: "5.0% Down", arv: "", type: "Subject To", lister: "Wokoma Capital", isNew: false },
  { id: 12, image: dealdeck12.url, city: "Locust Grove", state: "GA", zip: "30248", beds: "3", baths: "2", area: "1,490", entry: "$15,000", down: "5.2% Down", arv: "", type: "Subject To", lister: "Wokoma Capital", isNew: false },
  { id: 13, image: dealdeck13.url, city: "Atlanta", state: "GA", zip: "30337", beds: "4", baths: "3.5", area: "4,234", entry: "$40,000", down: "", arv: "", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 14, image: dealdeck14.url, city: "Converse", state: "TX", zip: "78109", beds: "4", baths: "3", area: "2,666", entry: "$25,000", down: "", arv: "", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 15, image: dealdeck15.url, city: "Saint Cloud", state: "FL", zip: "34769", beds: "4", baths: "2", area: "2,025", entry: "$12,500", down: "2.8% Down", arv: "", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 16, image: dealdeck16.url, city: "Knightdale", state: "NC", zip: "27545", beds: "4", baths: "2.5", area: "2,854", entry: "$25,000", down: "4.2% Down", arv: "", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 17, image: dealdeck17.url, city: "Spring", state: "TX", zip: "77373", beds: "5", baths: "5", area: "3,950", entry: "$40,000", down: "6.7% Down", arv: "$600,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 18, image: dealdeck18.url, city: "Denton", state: "TX", zip: "76201", beds: "3", baths: "2", area: "1,451", entry: "$20,000", down: "5.1% Down", arv: "$389,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 19, image: dealdeck19.url, city: "Cartersville", state: "GA", zip: "30120", beds: "4", baths: "3", area: "1,195", entry: "$22,000", down: "6.4% Down", arv: "", type: "Subject To", lister: "Boulder Capital Investments", isNew: false },
  { id: 20, image: dealdeck20.url, city: "Dallas", state: "GA", zip: "30132", beds: "4", baths: "2", area: "2,776", entry: "$15,000", down: "3.8% Down", arv: "$400,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 21, image: dealdeck21.url, city: "Kissimmee", state: "FL", zip: "34741", beds: "3", baths: "2.5", area: "1,365", entry: "$15,000", down: "4.2% Down", arv: "$360,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 22, image: dealdeck22.url, city: "Atlanta", state: "GA", zip: "30337", beds: "3", baths: "2", area: "1,110", entry: "$5,000", down: "2.8% Down", arv: "", type: "Subject To", lister: "Boulder Capital Investments", isNew: false },
  { id: 23, image: dealdeck23.url, city: "Cartersville", state: "GA", zip: "30120", beds: "3", baths: "2.5", area: "1,614", entry: "$25,000", down: "10.4% Down", arv: "$240,000", type: "Subject To", lister: "Boulder Capital Investments", isNew: false },
  { id: 24, image: dealdeck24.url, city: "Griffin", state: "GA", zip: "30223", beds: "4", baths: "2.5", area: "2,336", entry: "$5,000", down: "1.6% Down", arv: "", type: "Subject To", lister: "Boulder Capital Investments", isNew: false },
  { id: 25, image: dealdeck25.url, city: "Eatonton", state: "GA", zip: "31024", beds: "4", baths: "3", area: "2,560", entry: "$9,000", down: "2.3% Down", arv: "$400,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 26, image: dealdeck26.url, city: "Dallas", state: "GA", zip: "30132", beds: "3", baths: "2", area: "1,681", entry: "$9,000", down: "2.5% Down", arv: "$360,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 27, image: dealdeck27.url, city: "Conyers", state: "GA", zip: "30012", beds: "4", baths: "2", area: "2,320", entry: "$5,000", down: "1.5% Down", arv: "$335,000", type: "Subject To", lister: "Boulder Capital Investments", isNew: false },
  { id: 28, image: dealdeck28.url, city: "Lumberton", state: "NC", zip: "28358", beds: "5", baths: "3", area: "3,032", entry: "$9,000", down: "2.6% Down", arv: "$350,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 29, image: dealdeck29.url, city: "Atlanta", state: "GA", zip: "30337", beds: "3", baths: "1", area: "840", entry: "$12,500", down: "5.3% Down", arv: "$235,000", type: "Subject To", lister: "Boulder Capital Investments", isNew: false },
  { id: 30, image: dealdeck30.url, city: "Fayetteville", state: "NC", zip: "28301", beds: "3", baths: "2", area: "2,130", entry: "$8,000", down: "3.1% Down", arv: "$260,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 31, image: dealdeck31.url, city: "Miramar", state: "FL", zip: "33023", beds: "2", baths: "2", area: "980", entry: "$12,500", down: "3.5% Down", arv: "$361,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 32, image: dealdeck32.url, city: "Richland Hills", state: "TX", zip: "76118", beds: "3", baths: "1.5", area: "1,251", entry: "$12,500", down: "4.2% Down", arv: "$300,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 33, image: dealdeck33.url, city: "Newnan", state: "GA", zip: "30263", beds: "3", baths: "3.5", area: "2,809", entry: "$4,000", down: "1.0% Down", arv: "$385,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 34, image: dealdeck34.url, city: "Talking Rock", state: "GA", zip: "30175", beds: "3", baths: "2", area: "1,152", entry: "$8,000", down: "4.6% Down", arv: "$173,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 35, image: dealdeck35.url, city: "Warner Robins", state: "GA", zip: "31088", beds: "4", baths: "2", area: "2,310", entry: "$5,000", down: "1.4% Down", arv: "$350,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 36, image: dealdeck36.url, city: "Covington", state: "GA", zip: "30014", beds: "3", baths: "3.5", area: "2,705", entry: "$10,000", down: "1.8% Down", arv: "$550,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 37, image: dealdeck37.url, city: "San Antonio", state: "TX", zip: "78250", beds: "4", baths: "3.5", area: "2,547", entry: "$9,000", down: "2.5% Down", arv: "$360,000", type: "Subject To", lister: "UHN Capital", isNew: false },
  { id: 38, image: dealdeck38.url, city: "Austell", state: "GA", zip: "30106", beds: "3", baths: "3", area: "1,934", entry: "$30,000", down: "8.0% Down", arv: "$374,000", type: "Subject To", lister: "UHN Capital", isNew: false },
];
