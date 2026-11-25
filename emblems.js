/* Copyright (c) 2026 Drew Gislason */
/* Bold single-colour emblems on a 32x32 grid, drawn to stay readable at about 14px on a phone. */
const ICONS = (function () {
  const S = (inner) => '<svg viewBox="0 0 32 32" aria-hidden="true">' + inner + '</svg>';
  const stroke = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';

  /* Dragon head, facing right. Same outline for all four; they differ in ink colour and the White one is hollow. */
  const dragonD = 'M5 28 6 18 9 12 3 4 14 9 19 8 25 9 30 12 29 15 24 15.500 25.500 19 21 16.800 17 17.500 26 22.500 24 25 14 24 12 28Z';
  const dragonEye = 'M15.200 12.500a1.900 1.900 0 1 0 3.800 0 1.900 1.900 0 1 0-3.800 0Z';
  const dragonSolid = S('<path fill="currentColor" fill-rule="evenodd" d="' + dragonD + dragonEye + '"/>');
  const dragonHollow = S('<path ' + stroke + ' stroke-width="2.4" d="' + dragonD + '"/><circle cx="17.100" cy="12.500" r="1.900" fill="currentColor"/>');

  /* Longship: the same hull and mast, four different sails. */
  const hull = '<path fill="currentColor" d="M2 19 5.5 11 7 19H25L26.500 11 30 19C27.500 25 22 27 16 27 10 27 4.500 25 2 19Z"/><rect fill="currentColor" x="15.100" y="3" width="1.800" height="16"/>';
  const sailBox = 'x="8" y="4.500" width="16" height="11"';
  const ship = {
    solid: S(hull + '<rect fill="currentColor" ' + sailBox + '/>'),
    hollow: S(hull + '<rect fill="none" stroke="currentColor" stroke-width="2" x="9" y="5.500" width="14" height="9"/>'),
    stripes: S(hull + '<rect fill="currentColor" x="8" y="4.500" width="3.600" height="11"/><rect fill="currentColor" x="14.200" y="4.500" width="3.600" height="11"/><rect fill="currentColor" x="20.400" y="4.500" width="3.600" height="11"/>'),
    cross: S(hull + '<rect fill="none" stroke="currentColor" stroke-width="2" x="9" y="5.500" width="14" height="9"/><path ' + stroke + ' stroke-width="2" d="M9 5.500 23 14.500M23 5.500 9 14.500"/>')
  };

  const snow = '<path d="M16 3v26M12 6.500l4 3.500 4-3.500M12 25.500l4-3.500 4 3.500"/>';
  return {
    /* Seasons */
    spring: S('<path fill="currentColor" d="M14.600 29V15h2.800v14z"/><path fill="currentColor" d="M15 17C8 17 4 13 4 6c7 0 11 4 11 11z"/><path fill="currentColor" d="M17 14c0-6 4-9 11-9 0 6-4 10-11 9z"/>'),
    summer: S('<circle fill="currentColor" cx="16" cy="16" r="6"/><path ' + stroke + ' stroke-width="2.800" d="M16 3v4M16 25v4M3 16h4M25 16h4M6.800 6.800l2.800 2.800M22.400 22.400l2.800 2.800M25.200 6.800l-2.800 2.800M9.600 22.400l-2.800 2.800"/>'),
    autumn: S('<path ' + stroke + ' stroke-width="2.400" d="M16 3C26 8 27 19 16 26 5 19 6 8 16 3z"/><path ' + stroke + ' stroke-width="2.400" d="M16 29V10M16 17l5-4M16 21l-5-4"/>'),
    winter: S('<g ' + stroke + ' stroke-width="2.600">' + snow + '<g transform="rotate(60 16 16)">' + snow + '</g><g transform="rotate(120 16 16)">' + snow + '</g></g>'),
    /* Norns: tall stooped left-facing crones in a peaked hood, with a hooked nose,
       pointed chin, hanging hair and a flared cloak. Urd leans on a gnarled staff
       with a well-bucket; Verdandi holds a drop-spindle; Skuld holds shears; Wyrd
       holds a knot of thread. */
    urd: S('<path fill="currentColor" fill-rule="evenodd" d="M16.2.3 20.2 2.2 22.4 5.6 25.2 6.8 27.4 9.6 26.6 13.4 26.2 17.6 26.8 22 28.2 26.4 29.6 31 24.8 30.2 20.2 31.5 15.4 30.2 10.6 31.5 7.2 30.4 6.2 28.6 8.4 24.2 11 19.6 12.4 15.8 10.6 14.6 6.8 14.8 8.8 13.2 3 11.2 1.8 8.6 8 9.6 8.6 7.2 5 5.6 9.6 3 13.2 1.2Z M8 9.8 9.6 9.3 9.2 11Z"/><path fill="currentColor" d="M11.2 15 9.4 27.2 11 26.8 12 20.8 13 27.6 14.6 27 13.4 15.2Z"/><path fill="currentColor" d="M1.2.3 3.3.9 2.8 5.4 4.6 7 3.4 11 5.2 14.2 3.4 18.2 4.8 22.6 3.4 27 4.2 31.6 2.2 31.6 1.4 27 2.8 22.6 1.2 18.2 2.8 14.2 1.6 11 3.2 7 1.4 5.4Z"/><path fill="currentColor" d="M3.2 16.4 8 17.4 7 19.4 2.6 18Z"/><path fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" d="M3.2 16.1 7.2 15.2M3.3 17.3 7.6 17M3.5 18.5 7.2 19.2"/><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" d="M.8 20.6H7"/><path fill="currentColor" d="M1 20.6H7.2L6.4 27.6H1.8Z"/>'),
    verdandi: S('<path fill="currentColor" fill-rule="evenodd" d="M15.4.3 19.4 1.8 21.8 5.2 24.6 6.4 26.8 9.2 26 13 25.6 17.2 26.2 21.6 27.6 26 29 31 24.2 30.2 19.6 31.5 14.8 30.2 10 31.5 6.6 30.4 5.6 28.4 7.8 24 10.4 19.2 11.8 15 10 13.8 6.2 14 8.2 12.4 2.6 10.4 1.4 8 7.4 8.8 8 6.4 4.4 4.8 9 2.4 12.6.9Z M7.4 9 9 8.5 8.6 10.2Z"/><path fill="currentColor" d="M10.6 14.2 8.8 26.2 10.4 25.8 11.4 19.8 12.4 26.6 14 26 12.8 14.4Z"/><path fill="currentColor" d="M1.8 1H3.9V23H1.8Z"/><path fill="currentColor" d="M.2 10 3.1 7.1 6 10 3.1 12.9Z"/><path fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" d="M5.4 12.2C9 14.8 8.8 21 4.8 22.6"/><path fill="currentColor" d="M4.2 15.8 8 16.8 7 18.8 3.4 17.6Z"/><path fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" d="M4.4 15.6 7.4 14.8M4.6 16.8 7.8 16.6M4.6 18 7.4 18.6"/>'),
    skuld: S('<path fill="currentColor" fill-rule="evenodd" d="M16 .3 20 2.2 22.2 5.6 25 6.8 27.2 9.6 26.4 13.4 26 17.6 26.6 22 28 26.4 29.4 31 24.6 30.2 20 31.5 15.2 30.2 10.4 31.5 7 30.4 6 28.6 8.2 24.2 10.8 19.6 12.2 15.6 10.4 14.4 6.6 14.6 8.6 13 3 11 1.8 8.6 7.8 9.4 8.4 7 4.8 5.4 9.4 2.8 13 1.2Z M7.8 9.6 9.4 9.1 9 10.8Z"/><path fill="currentColor" d="M11 14.8 9.2 26.8 10.8 26.4 11.8 20.4 12.8 27.2 14.4 26.6 13.2 15Z"/><path fill="currentColor" d="M.2 4.2 10.6 15.4 2.2 13 1.5 11 7.4 14.4.8 5.8Z M.2 27.6 10.6 15.4 2.2 18 1.5 20 7.4 16.2.8 26.2Z"/><circle cx="12" cy="14.6" r="2.05" fill="none" stroke="currentColor" stroke-width="1.55"/><circle cx="12" cy="17.6" r="2.05" fill="none" stroke="currentColor" stroke-width="1.55"/><path fill="currentColor" d="M8.6 16.2 12 17.4 10.8 19.4 7.6 18Z"/><path fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" d="M8.4 15.8 11.2 15M8.6 17 11.6 16.8M8.6 18.4 11.2 19"/>'),
    wyrd: S('<path fill="currentColor" fill-rule="evenodd" d="M17.4.3 21.4 2.2 23.6 5.6 26.4 6.8 28.6 9.6 27.8 13.4 27.4 17.6 28 22 29.4 26.4 30.8 31 26 30.2 21.4 31.5 16.6 30.2 11.8 31.5 8.4 30.4 7.4 28.6 9.6 24.2 12.2 19.6 13.6 15.6 11.8 14.4 8 14.6 10 13 4.6 11 3.4 8.6 9.2 9.4 9.8 7 6.2 5.4 10.8 2.8 14.4 1.2Z M9.2 9.6 10.8 9.1 10.4 10.8Z"/><path fill="currentColor" d="M12.4 14.8 10.8 25.6 12.4 25.2 13.2 19.8 14 26 15.6 25.4 14.4 15Z"/><circle cx="4.2" cy="16.6" r="3.15" fill="none" stroke="currentColor" stroke-width="1.85"/><circle cx="4.2" cy="22.2" r="3.15" fill="none" stroke="currentColor" stroke-width="1.85"/><path fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" d="M7 24.4C9.6 26.8 9 29.8 6 30.6"/><path fill="currentColor" d="M8 18.4 11.8 19.4 10.6 21.4 7 20.2Z"/><path fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" d="M7.8 18.2 10.8 17.4M8 19.4 11.4 19.2M8 20.8 10.8 21.4"/>'),

    /* Dragons */
    dragonSolid: dragonSolid,
    dragonHollow: dragonHollow,
    /* Directions */
    north: S('<path fill="currentColor" d="M16 3 27 17h-7v12h-8V17H5z"/>'),
    south: S('<path fill="currentColor" d="M16 29 5 15h7V3h8v12h7z"/>'),
    east:  S('<path fill="currentColor" d="M29 16 15 27v-7H3v-8h12V5z"/>'),
    west:  S('<path fill="currentColor" d="M3 16 17 5v7h12v8H17v7z"/>'),
    /* Longships */
    shipSolid: ship.solid, shipHollow: ship.hollow, shipStripes: ship.stripes, shipCross: ship.cross,
    /* Gods */
    odin: S('<path ' + stroke + ' stroke-width="2.600" d="M2 16C7 8 25 8 30 16 25 24 7 24 2 16z"/><circle fill="currentColor" cx="16" cy="16" r="5"/>'),
    thor: S('<path fill="currentColor" d="M4 4h24v10H4z"/><path fill="currentColor" d="M13.500 14h5v13h-5z"/><circle fill="none" stroke="currentColor" stroke-width="2.200" cx="16" cy="28" r="2.400"/>'),
    frigg: S('<circle fill="none" stroke="currentColor" stroke-width="3" cx="16" cy="9" r="6"/><path fill="currentColor" d="M14.600 14h2.800v16h-2.800z"/><path fill="currentColor" d="M17.400 22h6v2.800h-6zM17.400 27h4.200v2.800h-4.200z"/>'),
    freyr: S('<path fill="currentColor" d="M14.600 12h2.800v18h-2.800z"/><path fill="currentColor" d="M16 2c3.500 3 3.500 7 0 11-3.500-4-3.500-8 0-11z"/><path fill="currentColor" d="M15 25c-6 0-8-4-8-9 6 0 8 4 8 9zM17 25c6 0 8-4 8-9-6 0-8 4-8 9zM15 18c-5.500 0-7.500-3.500-7.500-8 5.500 0 7.500 3.500 7.500 8zM17 18c5.500 0 7.500-3.500 7.500-8-5.500 0-7.500 3.500-7.500 8z"/>'),
    tyr: S('<g transform="rotate(40 16 16)"><path fill="currentColor" d="M15 12h2v19h-2z"/><path fill="currentColor" d="M16 0l5.500 12.500L16 10.500 10.500 12.500z"/><path fill="currentColor" d="M11 14.500h10v2H11z"/></g>'),
    loki: S('<path fill="currentColor" d="M17 2c1 6 8 9 8 18a9 9 0 0 1-18 0c0-5 3-8 5.500-11 .5 3 1.500 4.500 3 5 1.500-3.500 0-8 1.500-12z"/>'),
    hel: S('<path fill="currentColor" fill-rule="evenodd" d="M16 3C9.500 3 5 7.500 5 13.500c0 3.800 1.800 6.200 4 7.500v6h3.500v-3h1.800v3h3.400v-3h1.800v3H23v-6c2.200-1.300 4-3.700 4-7.500C27 7.500 22.500 3 16 3zM11.500 11.300a3.100 3.100 0 1 0 0 6.200 3.100 3.100 0 1 0 0-6.200zM20.500 11.300a3.100 3.100 0 1 0 0 6.200 3.100 3.100 0 1 0 0-6.200zM16 17.800l-2 3.200h4z"/>')
  };
})();
