/**
 * College data — generated from "College list.xlsx" (Sheet1).
 * Order matches the sheet's ranking. Edit `whyFit` blurbs freely — they were
 * drafted from the sheet's majors/notes columns, not copied from it.
 */

export type Level = "Reach" | "Target" | "Safety";
export type Applying = "Applying" | "Maybe" | "No";
export type AppType = "REA" | "EA" | "RD";
export type Stars = 1 | 2 | 3 | 4 | 5;

export interface College {
  id: string;
  /** Position in the ranked list (null for cut-list schools) */
  rank: number | null;
  name: string;
  location: string;
  lat: number;
  lng: number;
  applying: Applying;
  level: Level;
  appType: AppType;
  stars: Stars;
  major1: string;
  major2: string;
  whyFit: string;
  notes?: string;
  /** Acceptance rate as a fraction (0.04 = 4%) */
  acceptRate: number;
  students: number;
  /** Sticker cost per year, USD */
  tuition: number;
  sfRatio: string;
  avgSat: number | null;
  website: string;
  portal: string;
  portalName: string;
}

export const STAR_META: Record<Stars, { label: string }> = {
  5: { label: "Do or die" },
  4: { label: "Really want" },
  3: { label: "Would be hyped" },
  2: { label: "Solid landing" },
  1: { label: "Safety net" },
};

export const LEVELS: Level[] = ["Reach", "Target", "Safety"];

export const COLLEGES: College[] = [
  {
    id: "stanford",
    rank: 1,
    name: "Stanford",
    location: "Stanford, CA",
    lat: 37.4275,
    lng: -122.1697,
    applying: "Applying",
    level: "Reach",
    appType: "REA",
    stars: 5,
    major1: "Aerospace",
    major2: "Applied Math",
    whyFit:
      "The early swing. Elite aero engineering with an applied-math core, a 6:1 faculty ratio, and the Valley's entire space-hardware scene within biking distance. Worth burning the REA card on.",
    acceptRate: 0.04,
    students: 7904,
    tuition: 96513,
    sfRatio: "6:1",
    avgSat: 1550,
    website: "https://www.stanford.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "mit",
    rank: 2,
    name: "MIT",
    location: "Cambridge, MA",
    lat: 42.3601,
    lng: -71.0942,
    applying: "Applying",
    level: "Reach",
    appType: "RD",
    stars: 5,
    major1: "Aerospace",
    major2: "Applied Math",
    whyFit:
      "AeroAstro is the gold standard, and a 3:1 ratio means building things alongside the people who wrote the textbooks. The maker culture fits exactly how I learn.",
    acceptRate: 0.05,
    students: 4580,
    tuition: 89430,
    sfRatio: "3:1",
    avgSat: 1550,
    website: "https://www.mit.edu",
    portal: "https://apply.mitadmissions.org",
    portalName: "MIT Apply",
  },
  {
    id: "princeton",
    rank: 3,
    name: "Princeton",
    location: "Princeton, NJ",
    lat: 40.3431,
    lng: -74.6551,
    applying: "Applying",
    level: "Reach",
    appType: "RD",
    stars: 5,
    major1: "Robotics",
    major2: "Applied Math",
    whyFit:
      "MAE with a serious robotics track, plus PACM for the applied-math itch. Tiny classes, absurd research budget per undergrad.",
    acceptRate: 0.05,
    students: 5813,
    tuition: 91680,
    sfRatio: "5:1",
    avgSat: 1530,
    website: "https://www.princeton.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "ucla",
    rank: 4,
    name: "UCLA",
    location: "Los Angeles, CA",
    lat: 34.0689,
    lng: -118.4452,
    applying: "Applying",
    level: "Reach",
    appType: "RD",
    stars: 5,
    major1: "Mech/Aero",
    major2: "Applied Math",
    whyFit:
      "Top public school parked in the middle of the LA aerospace corridor — SpaceX, JPL, and every NASA contractor hires straight off campus. Mech/Aero plus applied math keeps both doors open.",
    acceptRate: 0.09,
    students: 33479,
    tuition: 36682,
    sfRatio: "20:1",
    avgSat: 1460,
    website: "https://www.ucla.edu",
    portal: "https://apply.universityofcalifornia.edu",
    portalName: "UC App",
  },
  {
    id: "duke",
    rank: 5,
    name: "Duke",
    location: "Durham, NC",
    lat: 36.0014,
    lng: -78.9382,
    applying: "Applying",
    level: "Reach",
    appType: "RD",
    stars: 4,
    major1: "Mechanical",
    major2: "ECE",
    whyFit:
      "Mechanical + ECE is the robotics combo, and Pratt lets you mix across departments freely. Strong pipeline to grad school if that ends up being the move.",
    acceptRate: 0.06,
    students: 6523,
    tuition: 96434,
    sfRatio: "5:1",
    avgSat: 1550,
    website: "https://www.duke.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "berkeley",
    rank: 6,
    name: "Berkeley",
    location: "Berkeley, CA",
    lat: 37.8719,
    lng: -122.2585,
    applying: "Applying",
    level: "Reach",
    appType: "RD",
    stars: 4,
    major1: "Mech/Aero",
    major2: "Business",
    whyFit:
      "It's all about MET — engineering and Haas business fused into one dual degree. Public-school price for a program that usually costs two degrees.",
    notes: "MET program",
    acceptRate: 0.11,
    students: 33469,
    tuition: 52147,
    sfRatio: "18:1",
    avgSat: 1420,
    website: "https://www.berkeley.edu",
    portal: "https://apply.universityofcalifornia.edu",
    portalName: "UC App",
  },
  {
    id: "cornell",
    rank: 7,
    name: "Cornell",
    location: "Ithaca, NY",
    lat: 42.4534,
    lng: -76.4735,
    applying: "Applying",
    level: "Reach",
    appType: "RD",
    stars: 4,
    major1: "Mechanical",
    major2: "Economics",
    whyFit:
      "Sibley mech with an econ side — the biggest engineering school in the Ivy League, so there's a lab for everything. Ithaca is cold; the machine shops are warm.",
    acceptRate: 0.08,
    students: 16128,
    tuition: 96268,
    sfRatio: "9:1",
    avgSat: 1520,
    website: "https://www.cornell.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "upenn",
    rank: 8,
    name: "UPenn",
    location: "Philadelphia, PA",
    lat: 39.9522,
    lng: -75.1932,
    applying: "Applying",
    level: "Reach",
    appType: "RD",
    stars: 4,
    major1: "Mechanical",
    major2: "Economics",
    whyFit:
      "The M&T program: Wharton + engineering in four years. Longest of long shots, but it's exactly the engineering-plus-business shape I'm after.",
    notes: "M&T program",
    acceptRate: 0.05,
    students: 10013,
    tuition: 95612,
    sfRatio: "8:1",
    avgSat: 1550,
    website: "https://www.upenn.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "michigan",
    rank: 9,
    name: "Michigan",
    location: "Ann Arbor, MI",
    lat: 42.278,
    lng: -83.7382,
    applying: "Applying",
    level: "Target",
    appType: "EA",
    stars: 4,
    major1: "Aerospace",
    major2: "Economics",
    whyFit:
      "Top-five aero program with a real shot at the Ross dual degree. EA deadline makes this the first big domino to fall.",
    notes: "Dual Ross",
    acceptRate: 0.18,
    students: 34454,
    tuition: 86405,
    sfRatio: "15:1",
    avgSat: 1470,
    website: "https://umich.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "usc",
    rank: 10,
    name: "USC",
    location: "Los Angeles, CA",
    lat: 34.0224,
    lng: -118.2851,
    applying: "Applying",
    level: "Target",
    appType: "EA",
    stars: 3,
    major1: "Mechanical",
    major2: "Economics",
    whyFit:
      "Viterbi mech + econ with real merit-scholarship money on the table for EA applicants. LA aerospace network plus the Trojan alumni mafia.",
    notes: "Scholarship",
    acceptRate: 0.1,
    students: 20630,
    tuition: 99139,
    sfRatio: "8:1",
    avgSat: 1490,
    website: "https://www.usc.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "uiuc",
    rank: 11,
    name: "UIUC",
    location: "Urbana-Champaign, IL",
    lat: 40.102,
    lng: -88.2272,
    applying: "Applying",
    level: "Target",
    appType: "EA",
    stars: 3,
    major1: "Aerospace",
    major2: "Data Sci",
    whyFit:
      "Serious aero department plus one of the best data-science scenes in the Big Ten. High acceptance for the quality — great odds-to-outcome ratio.",
    acceptRate: 0.42,
    students: 37140,
    tuition: 54680,
    sfRatio: "20:1",
    avgSat: 1430,
    website: "https://illinois.edu",
    portal: "https://myillini.illinois.edu",
    portalName: "myIllini",
  },
  {
    id: "ucsd",
    rank: 12,
    name: "UCSD",
    location: "San Diego, CA",
    lat: 32.8801,
    lng: -117.234,
    applying: "Applying",
    level: "Target",
    appType: "RD",
    stars: 3,
    major1: "Aerospace",
    major2: "Economics",
    whyFit:
      "Aero + econ at the fastest-growing engineering school in the UC system. Also: it's in La Jolla.",
    acceptRate: 0.27,
    students: 34755,
    tuition: 44811,
    sfRatio: "19:1",
    avgSat: 1360,
    website: "https://ucsd.edu",
    portal: "https://apply.universityofcalifornia.edu",
    portalName: "UC App",
  },
  {
    id: "gatech",
    rank: 13,
    name: "Georgia Tech",
    location: "Atlanta, GA",
    lat: 33.7756,
    lng: -84.3963,
    applying: "Applying",
    level: "Target",
    appType: "EA",
    stars: 3,
    major1: "Aerospace",
    major2: "Data Sci",
    whyFit:
      "Consistently top-three in aerospace with a co-op program that basically guarantees flight hardware on the résumé.",
    acceptRate: 0.14,
    students: 20592,
    tuition: 53238,
    sfRatio: "21:1",
    avgSat: 1450,
    website: "https://www.gatech.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "calpoly",
    rank: 14,
    name: "Cal Poly SLO",
    location: "San Luis Obispo, CA",
    lat: 35.305,
    lng: -120.6625,
    applying: "Applying",
    level: "Safety",
    appType: "RD",
    stars: 2,
    major1: "Aerospace",
    major2: "Mech",
    whyFit:
      "Learn By Doing is real — undergrads touch hardware from day one, and industry recruits SLO aero hard. The hands-on safety.",
    acceptRate: 0.31,
    students: 21947,
    tuition: 37596,
    sfRatio: "18:1",
    avgSat: 1320,
    website: "https://www.calpoly.edu",
    portal: "https://www.calstate.edu/apply",
    portalName: "Cal State Apply",
  },
  {
    id: "uci",
    rank: 15,
    name: "UCI",
    location: "Irvine, CA",
    lat: 33.6405,
    lng: -117.8443,
    applying: "Applying",
    level: "Safety",
    appType: "RD",
    stars: 2,
    major1: "Aerospace",
    major2: "Data Sci",
    whyFit:
      "A dependable UC landing spot for aero + data science, twenty minutes from half of SoCal's defense primes.",
    acceptRate: 0.29,
    students: 30204,
    tuition: 39780,
    sfRatio: "19:1",
    avgSat: 1310,
    website: "https://uci.edu",
    portal: "https://apply.universityofcalifornia.edu",
    portalName: "UC App",
  },
  {
    id: "uw",
    rank: 16,
    name: "U Washington",
    location: "Seattle, WA",
    lat: 47.6553,
    lng: -122.3035,
    applying: "Applying",
    level: "Safety",
    appType: "EA",
    stars: 1,
    major1: "Aerospace",
    major2: "Data Sci",
    whyFit:
      "Aero + data science in Boeing and Blue Origin's backyard. The Pacific Northwest option.",
    acceptRate: 0.39,
    students: 40754,
    tuition: 66972,
    sfRatio: "20:1",
    avgSat: 1420,
    website: "https://www.washington.edu",
    portal: "https://admit.washington.edu/apply/",
    portalName: "UW Apply",
  },
  {
    id: "purdue",
    rank: 17,
    name: "Purdue",
    location: "West Lafayette, IN",
    lat: 40.4237,
    lng: -86.9212,
    applying: "Applying",
    level: "Safety",
    appType: "RD",
    stars: 1,
    major1: "Aerospace",
    major2: "Flight",
    whyFit:
      "The Cradle of Astronauts. Aero plus an actual flight program, and a 50% acceptance rate that makes it the sturdiest safety on the board.",
    acceptRate: 0.5,
    students: 44170,
    tuition: 45944,
    sfRatio: "15:1",
    avgSat: 1350,
    website: "https://www.purdue.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "boulder",
    rank: 18,
    name: "CU Boulder",
    location: "Boulder, CO",
    lat: 40.0076,
    lng: -105.2659,
    applying: "Applying",
    level: "Safety",
    appType: "EA",
    stars: 1,
    major1: "Aerospace",
    major2: "Data Sci",
    whyFit:
      "Top-tier aerospace research (Ball, Lockheed, LASP) hiding behind an 81% acceptance rate. Best safety-to-ceiling ratio anywhere.",
    acceptRate: 0.81,
    students: 32100,
    tuition: 66368,
    sfRatio: "19:1",
    avgSat: 1270,
    website: "https://www.colorado.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  // ——— The cut list (marked "No" in the sheet) ———
  {
    id: "cambridge",
    rank: null,
    name: "Cambridge",
    location: "Cambridge, UK",
    lat: 52.2043,
    lng: 0.1149,
    applying: "No",
    level: "Reach",
    appType: "EA",
    stars: 5,
    major1: "Aerospace",
    major2: "Applied Math",
    whyFit:
      "The Engineering Tripos and a 3:1 ratio were tempting, but the UK logistics and a whole separate application cycle didn't make the cut.",
    notes: "5 on both C-mech and E&M",
    acceptRate: 0.067,
    students: 12910,
    tuition: 59062,
    sfRatio: "3:1",
    avgSat: null,
    website: "https://www.cam.ac.uk",
    portal: "https://www.ucas.com",
    portalName: "UCAS",
  },
  {
    id: "caltech",
    rank: null,
    name: "Caltech",
    location: "Pasadena, CA",
    lat: 34.1377,
    lng: -118.1253,
    applying: "No",
    level: "Reach",
    appType: "RD",
    stars: 5,
    major1: "Aerospace",
    major2: "Applied Math",
    whyFit:
      "A 3% acceptance rate and a 987-person student body — decided the lottery ticket wasn't worth another essay set.",
    acceptRate: 0.03,
    students: 987,
    tuition: 93912,
    sfRatio: "3:1",
    avgSat: 1550,
    website: "https://www.caltech.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
  {
    id: "cmu",
    rank: null,
    name: "CMU",
    location: "Pittsburgh, PA",
    lat: 40.4433,
    lng: -79.9436,
    applying: "No",
    level: "Target",
    appType: "RD",
    stars: 3,
    major1: "Mechatronics",
    major2: "Data Sci",
    whyFit:
      "Mechatronics + data science is a cool combo, but it lost the head-to-head against the schools already on the list.",
    acceptRate: 0.12,
    students: 7824,
    tuition: 89390,
    sfRatio: "6:1",
    avgSat: 1540,
    website: "https://www.cmu.edu",
    portal: "https://www.commonapp.org",
    portalName: "Common App",
  },
];

export const ACTIVE = COLLEGES.filter((c) => c.applying !== "No");
export const CUT = COLLEGES.filter((c) => c.applying === "No");

export const HOME = {
  name: "Home",
  location: "Simi Valley, CA",
  lat: 34.2694,
  lng: -118.7815,
};

/** Great-circle distance from home, in miles. */
export function distanceFromHome(c: { lat: number; lng: number }): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(c.lat - HOME.lat);
  const dLng = toRad(c.lng - HOME.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(HOME.lat)) * Math.cos(toRad(c.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function miles(n: number): string {
  return `${Math.round(n).toLocaleString("en-US")} mi`;
}

export function pct(rate: number): string {
  const p = rate * 100;
  return `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(1)}%`;
}

export function money(n: number): string {
  return `$${Math.round(n / 1000)}k`;
}

export function moneyFull(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
