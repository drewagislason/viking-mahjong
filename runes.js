/* Copyright (c) 2026 Drew Gislason */
/* The 24 Elder Futhark runes, in the same order and with the same names as the
   Runes button in Viking Sudoku. Each mark is a straight-cut stroke path whose
   proportions were traced from Noto Sans Runic renderings of the canonical
   Unicode glyphs ᚠᚢᚦᚨᚱᚲ ᚷᚹᚺᚾᛁᛃ ᛇᛈᛉᛋᛏᛒ ᛖᛗᛚᛝᛞᛟ, then rebuilt with only
   straight line segments (no curves) so they read as carved cuts. */
const RUNE_DEFS = [
  { glyph: "ᚠ", name: "Fehu",     d: "M5.3 36 L5.3 4 M5.3 13.6 L16.7 4 M5.3 23 L26.6 4" },
  { glyph: "ᚢ", name: "Urus",     d: "M6.8 36 L6.8 4 L25.1 18.1 L25.1 36" },
  { glyph: "ᚦ", name: "Thurizaz", d: "M9.4 36 L9.4 4 M9.4 9.1 L24.5 19.6 L9.4 30.6" },
  { glyph: "ᚨ", name: "Ansuz",    d: "M12.2 36 L12.2 4 M12.2 4 L21 9.8 M12.2 13.1 L21 17" },
  { glyph: "ᚱ", name: "Raido",    d: "M9.7 36 L9.7 4 L22.1 12 L16.2 20.4 L22.1 36" },
  { glyph: "ᚲ", name: "Kanu",     d: "M24.4 4 L7.6 19.2 L24.4 36" },
  { glyph: "ᚷ", name: "Gebo",     d: "M5.2 36 L26.3 4 M5.2 4 L26.3 36" },
  { glyph: "ᚹ", name: "Wunjo",    d: "M11.1 36 L11.1 4 L22.9 14.6 L11.1 23.4" },
  { glyph: "ᚺ", name: "Hagall",   d: "M6 36 L6 4 M26 36 L26 4 M6 15.2 L26 24.6" },
  { glyph: "ᚾ", name: "Nyedis",   d: "M16 36 L16 4 M7.2 14.6 L24.8 24.8" },
  { glyph: "ᛁ", name: "Ice",      d: "M16 36 L16 4" },
  { glyph: "ᛃ", name: "Jera",     d: "M14.5 4 L3 15 L12.1 25.4 M19.9 14.6 L29 25 L17.5 36" },
  { glyph: "ᛇ", name: "Eywaz",    d: "M7.2 30.2 L16 36 L16 4 L24.8 9.8" },
  { glyph: "ᛈ", name: "Pertho",   d: "M10.2 36 L10.2 4 M10.2 4 L17.8 11.3 L23.9 4 L23.9 8.3 M10.2 36 L17.8 28.7 L23.9 36 L23.9 31.7" },
  { glyph: "ᛉ", name: "Ælgiz",    d: "M16 36 L16 4 M16 17.5 L4.8 4 M16 17.5 L27.2 4" },
  { glyph: "ᛋ", name: "Sowull",   d: "M7.8 4 L7.8 24 L24.2 12.2 L24.2 36" },
  { glyph: "ᛏ", name: "Telwaz",   d: "M16.1 36 L16.1 4 M7.1 9.5 L16.1 4 L24.9 9.8" },
  { glyph: "ᛒ", name: "Berkano",  d: "M9.8 36 L9.8 4 M9.8 4 L24.2 13.2 L9.8 19.8 M9.8 19.8 L24.2 26.2 L9.8 36" },
  { glyph: "ᛖ", name: "Ehwaz",    d: "M5.9 36 L5.9 4 M26.1 36 L26.1 4 M5.9 4 L15.8 11.8 L26.1 4" },
  { glyph: "ᛗ", name: "Mannaz",   d: "M5.2 36 L5.2 4 M26.8 36 L26.8 4 M5.2 4 L26.8 25 M26.8 4 L5.2 25" },
  { glyph: "ᛚ", name: "Laguz",    d: "M12.2 36 L12.2 4 M12.2 4 L21 9.8" },
  { glyph: "ᛝ", name: "Ingwaz",   d: "M7.3 4 L24.9 19.4 M24.7 4 L7.1 19.4 M7.3 36 L24.9 19.4 M24.7 36 L7.1 19.4" },
  { glyph: "ᛞ", name: "Dagaz",    d: "M5.8 36 L5.8 4 M26.3 36 L26.3 4 M5.8 4 L26.3 36 M26.3 4 L5.8 36" },
  { glyph: "ᛟ", name: "Othala",   d: "M15.9 4 L7 15.3 L24.9 36 M15.9 4 L25 15.3 L7.1 36" }
];
