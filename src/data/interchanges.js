/**
 * Interchange stations: which station ids connect which lines.
 * A station id that appears on multiple lines (in lines.js) is an interchange.
 * This file can list them explicitly for documentation and for validation.
 * Route finder derives interchanges from LINES (same id on multiple lines).
 */
const INTERCHANGES = [
  { stationId: "siam", lines: ["bts_sukhumvit", "bts_silom"] },
  { stationId: "krung_thon_buri", lines: ["bts_silom", "bts_gold"] },
  { stationId: "mo_chit", lines: ["bts_sukhumvit", "mrt_blue"] },
  { stationId: "phaya_thai", lines: ["bts_sukhumvit", "arl"] },
  { stationId: "asok", lines: ["bts_sukhumvit", "mrt_blue"] },
  { stationId: "sala_daeng", lines: ["bts_silom", "mrt_blue"] },
  { stationId: "bang_wa", lines: ["bts_silom", "mrt_blue"] },
  { stationId: "ratchayothin", lines: ["bts_sukhumvit", "mrt_blue"] },
  { stationId: "tao_poon", lines: ["mrt_blue", "mrt_purple"] },
  { stationId: "phetchaburi", lines: ["mrt_blue", "arl"] },
  { stationId: "lat_phrao", lines: ["mrt_blue", "mrt_yellow"] },
  { stationId: "hua_mak", lines: ["arl", "mrt_yellow"] },
  { stationId: "samrong", lines: ["bts_sukhumvit", "mrt_yellow"] },
  { stationId: "nonthaburi_civic_center", lines: ["mrt_purple", "mrt_pink"] },
  { stationId: "wat_phra_sri_mahathat", lines: ["bts_sukhumvit", "mrt_pink"] },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { INTERCHANGES };
}
if (typeof window !== "undefined") {
  window.INTERCHANGES = INTERCHANGES;
}
