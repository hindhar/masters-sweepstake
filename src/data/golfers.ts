import { GolferInfo } from "@/types";

export const golfers: GolferInfo[] = [
  // Group 1 - Scheffler, McIlroy, DeChambeau
  { name: "Scottie Scheffler", group: "G1", owgr: 1 },
  { name: "Rory McIlroy", group: "G1", owgr: 2 },
  { name: "Bryson DeChambeau", group: "G1", owgr: 24 },

  // Group 2 - Rahm, Aberg, Fleetwood, Fitzpatrick, Schauffele, Morikawa, Young, Morikawa
  { name: "Jon Rahm", group: "G2", owgr: 30 },
  { name: "Ludvig Aberg", group: "G2", owgr: 17 },
  { name: "Matt Fitzpatrick", group: "G2", owgr: 6 },
  { name: "Xander Schauffele", group: "G2", owgr: 10 },
  { name: "Tommy Fleetwood", group: "G2", owgr: 4 },
  { name: "Cameron Young", group: "G2", owgr: 3 },
  { name: "Collin Morikawa", group: "G2", owgr: 7 },

  // Group 3 - Rose, Reed, Gotterup, Matsuyama, Hovland, Koepka, MacIntyre, Thomas
  { name: "Justin Rose", group: "G3", owgr: 9 },
  { name: "Robert MacIntyre", group: "G3", owgr: 8 },
  { name: "Hideki Matsuyama", group: "G3", owgr: 14 },
  { name: "Viktor Hovland", group: "G3", owgr: 22 },
  { name: "Patrick Reed", group: "G3", owgr: 23 },
  { name: "Chris Gotterup", group: "G3", owgr: 11 },
  { name: "Brooks Koepka", group: "G3", owgr: 169 },
  { name: "Justin Thomas", group: "G3", owgr: 15 },

  // Group 4 - Hatton, Spieth, Lowry, Cantlay, Bhatia, Griffin, Si Woo Kim, Knapp
  { name: "Jordan Spieth", group: "G4", owgr: 61 },
  { name: "Akshay Bhatia", group: "G4", owgr: 21 },
  { name: "Shane Lowry", group: "G4", owgr: 32 },
  { name: "Patrick Cantlay", group: "G4", owgr: 35 },
  { name: "Tyrrell Hatton", group: "G4", owgr: 31 },
  { name: "Si Woo Kim", group: "G4", owgr: 28 },
  { name: "Ben Griffin", group: "G4", owgr: 16 },
  { name: "Jake Knapp", group: "G4", owgr: 42 },

  // Group 5 - Conners, Henley, Scott, Day, Homa, Burns, Penge, Woodland, Im, Min Woo Lee, C.Smith, Straka
  { name: "Min Woo Lee", group: "G5", owgr: 25 },
  { name: "Cameron Smith", group: "G5" },
  { name: "Adam Scott", group: "G5", owgr: 53 },
  { name: "Corey Conners", group: "G5", owgr: 44 },
  { name: "Sepp Straka", group: "G5", owgr: 13 },
  { name: "Max Homa", group: "G5" },
  { name: "Sungjae Im", group: "G5", owgr: 71 },
  { name: "Jason Day", group: "G5", owgr: 41 },
  { name: "Sam Burns", group: "G5", owgr: 33 },
  { name: "Gary Woodland", group: "G5" },
  { name: "Russell Henley", group: "G5" },
  { name: "Marco Penge", group: "G5", owgr: 37 },
  { name: "Daniel Berger", group: "G5", owgr: 38 },

  // Group 6 - Clark, Spaun, Bridgeman, English, D.Johnson, A.Noren, McCarty, McNealy, Bradley, N.Hojgaard, Garcia
  { name: "J.J. Spaun", group: "G6", owgr: 5 },
  { name: "Nicolai Hojgaard", group: "G6", owgr: 36 },
  { name: "Wyndham Clark", group: "G6", owgr: 78 },
  { name: "Jacob Bridgeman", group: "G6", owgr: 18 },
  { name: "Harris English", group: "G6", owgr: 20 },
  { name: "Sergio Garcia", group: "G6" },
  { name: "Dustin Johnson", group: "G6" },
  { name: "Keegan Bradley", group: "G6", owgr: 26 },
  { name: "Alex Noren", group: "G6", owgr: 19 },
  { name: "Maverick McNealy", group: "G6", owgr: 27 },
  { name: "Matt McCarty", group: "G6", owgr: 49 },
  { name: "Ryan Gerard", group: "G6", owgr: 29 },
  { name: "Kurt Kitayama", group: "G6", owgr: 34 },

  // Group 7 - Fox, Rai, M.Kim, Jarvis, Potgieter, Mickelson, Greyserman, Watson, Hall, Keefer, NP-Petersen, Harman, McKibbin, Stevens, R.Hojgaard, Ortiz, Li, N.Taylor
  { name: "Brian Harman", group: "G7", owgr: 50 },
  { name: "Aaron Rai", group: "G7", owgr: 39 },
  { name: "Rasmus Hojgaard", group: "G7", owgr: 57 },
  { name: "Harry Hall", group: "G7", owgr: 62 },
  { name: "Ryan Fox", group: "G7", owgr: 51 },
  { name: "Bubba Watson", group: "G7" },
  { name: "Michael Kim", group: "G7", owgr: 43 },
  { name: "Phil Mickelson", group: "G7" },
  { name: "Rasmus Neergaard-Petersen", group: "G7", owgr: 69 },
  { name: "Casey Jarvis", group: "G7", owgr: 70 },
  { name: "Hao-Tong Li", group: "G7", owgr: 84 },
  { name: "Aldrich Potgieter", group: "G7", owgr: 77 },
  { name: "Carlos Ortiz", group: "G7" },
  { name: "Nick Taylor", group: "G7", owgr: 67 },
  { name: "Max Greyserman", group: "G7", owgr: 59 },
  { name: "Sam Stevens", group: "G7", owgr: 45 },
  { name: "John Keefer", group: "G7" },
  { name: "Tom McKibbin", group: "G7" },

  // Group 8 - Woods, Echavarria, Novak, Reitan, Valimaki, Riley, Schwartzel, Campbell, Z.Johnson, Cabrera, Willett, Couples, Weir, Herrington, Holtz, Kataoka, Pulcini, Fang, Singh, Howell, Brennan, Olazabal
  { name: "Nicolas Echavarria", group: "G8", owgr: 40 },
  { name: "Zach Johnson", group: "G8" },
  { name: "Danny Willett", group: "G8" },
  { name: "Andrew Novak", group: "G8", owgr: 48 },
  { name: "Davis Riley", group: "G8" },
  { name: "Charl Schwartzel", group: "G8" },
  { name: "Vijay Singh", group: "G8" },
  { name: "Kristoffer Reitan", group: "G8", owgr: 46 },
  { name: "Fred Couples", group: "G8" },
  { name: "Sami Valimaki", group: "G8", owgr: 56 },
  { name: "Tiger Woods", group: "G8" },
  { name: "Brian Campbell", group: "G8" },
  { name: "Brandon Holtz", group: "G8" },
  { name: "Mateo Pulcini", group: "G8" },
  { name: "Mason Howell", group: "G8" },
  { name: "Michael Brennan", group: "G8", owgr: 47 },
  { name: "Angel Cabrera", group: "G8" },
  { name: "Ethan Fang", group: "G8" },
  { name: "Jose Maria Olazabal", group: "G8" },
  { name: "Mike Weir", group: "G8" },
  { name: "Jackson Herrington", group: "G8" },
  { name: "Naoyuki Kataoka", group: "G8" },
];

// Build a lookup map: golfer name -> group
export const golferGroupMap = new Map<string, string>(
  golfers.map((g) => [g.name, g.group])
);
