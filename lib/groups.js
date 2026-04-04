export const GROUPS = {
  A: ["Mexico", "South Africa", "Korea Republic", "Czechia"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Curaçao", "Côte d'Ivoire", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "IR Iran", "New Zealand"],
  H: ["Spain", "Cabo Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "Congo DR", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

// R32 bracket definition
// Each entry: { a: "X1"/"X2", b: "X1"/"X2"/"3rd", thirdFrom: [...groups] }
// thirdFrom = which groups' 3rd place teams are eligible for that slot
export const R32_BRACKET = [
  { a: "A2", b: "B2" },                          // M73
  { a: "E1", b: "3rd", thirdFrom: ["A","B","C","D","F"] }, // M74
  { a: "F1", b: "C2" },                          // M75
  { a: "C1", b: "F2" },                          // M76
  { a: "I1", b: "3rd", thirdFrom: ["C","D","F","G","H"] }, // M77
  { a: "E2", b: "I2" },                          // M78
  { a: "A1", b: "3rd", thirdFrom: ["C","E","F","H","I"] }, // M79
  { a: "L1", b: "3rd", thirdFrom: ["E","H","I","J","K"] }, // M80
  { a: "D1", b: "3rd", thirdFrom: ["B","E","F","I","J"] }, // M81
  { a: "G1", b: "3rd", thirdFrom: ["A","E","H","I","J"] }, // M82
  { a: "K2", b: "L2" },                          // M83
  { a: "H1", b: "J2" },                          // M84
  { a: "B1", b: "3rd", thirdFrom: ["E","F","G","I","J"] }, // M85
  { a: "J1", b: "H2" },                          // M86
  { a: "K1", b: "3rd", thirdFrom: ["D","E","I","J","L"] }, // M87
  { a: "D2", b: "G2" },                          // M88
];

// Round of 16: pairs of R32 match indices (0-based)
// M89: W74 vs W77, M90: W73 vs W75
// M91: W76 vs W78, M92: W79 vs W80
// M93: W83 vs W84, M94: W81 vs W82
// M95: W86 vs W88, M96: W85 vs W87
export const R16_BRACKET = [
  [1, 4],   // M89: W74 vs W77
  [0, 2],   // M90: W73 vs W75
  [3, 5],   // M91: W76 vs W78
  [6, 7],   // M92: W79 vs W80
  [10, 11], // M93: W83 vs W84
  [8, 9],   // M94: W81 vs W82
  [13, 15], // M95: W86 vs W88
  [12, 14], // M96: W85 vs W87
];

// Quarterfinal: pairs of R16 match indices (0-based)
// M97: W89 vs W90, M98: W93 vs W94
// M99: W91 vs W92, M100: W95 vs W96
export const QF_BRACKET = [
  [0, 1], // M97: W89 vs W90
  [4, 5], // M98: W93 vs W94
  [2, 3], // M99: W91 vs W92
  [6, 7], // M100: W95 vs W96
];

// Semifinal: pairs of QF match indices (0-based)
// M101: W97 vs W98, M102: W99 vs W100
export const SF_BRACKET = [
  [0, 1], // M101: W97 vs W98
  [2, 3], // M102: W99 vs W100
];
