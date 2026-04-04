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

// R32 bracket definition — ordered by official match schedule
// Each entry: { a: "X1"/"X2", b: "X1"/"X2"/"3rd", thirdFrom: [...groups] }
export const R32_BRACKET = [
  { a: "A2", b: "B2" },                                    // M73 index 0
  { a: "C1", b: "F2" },                                    // M76 index 1
  { a: "E1", b: "3rd", thirdFrom: ["A","B","C","D","F"] }, // M74 index 2
  { a: "F1", b: "C2" },                                    // M75 index 3
  { a: "E2", b: "I2" },                                    // M78 index 4
  { a: "I1", b: "3rd", thirdFrom: ["C","D","F","G","H"] }, // M77 index 5
  { a: "A1", b: "3rd", thirdFrom: ["C","E","F","H","I"] }, // M79 index 6
  { a: "L1", b: "3rd", thirdFrom: ["E","H","I","J","K"] }, // M80 index 7
  { a: "G1", b: "3rd", thirdFrom: ["A","E","H","I","J"] }, // M82 index 8
  { a: "D1", b: "3rd", thirdFrom: ["B","E","F","I","J"] }, // M81 index 9
  { a: "H1", b: "J2" },                                    // M84 index 10
  { a: "K2", b: "L2" },                                    // M83 index 11
  { a: "B1", b: "3rd", thirdFrom: ["E","F","G","I","J"] }, // M85 index 12
  { a: "D2", b: "G2" },                                    // M88 index 13
  { a: "J1", b: "H2" },                                    // M86 index 14
  { a: "K1", b: "3rd", thirdFrom: ["D","E","I","J","L"] }, // M87 index 15
];

// Round of 16: pairs of R32 match indices (0-based)
// M89: W74(2) vs W77(5)
// M90: W73(0) vs W75(3)
// M91: W76(1) vs W78(4)
// M92: W79(6) vs W80(7)
// M93: W83(11) vs W84(10)
// M94: W81(9) vs W82(8)
// M95: W86(14) vs W88(13)
// M96: W85(12) vs W87(15)
export const R16_BRACKET = [
  [2, 5],   // M89: W74 vs W77
  [0, 3],   // M90: W73 vs W75
  [1, 4],   // M91: W76 vs W78
  [6, 7],   // M92: W79 vs W80
  [11, 10], // M93: W83 vs W84
  [9, 8],   // M94: W81 vs W82
  [14, 13], // M95: W86 vs W88
  [12, 15], // M96: W85 vs W87
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
