'use client';  // Ye line sabse important hai

import { useEffect } from 'react';

export default function HistatsTracker() {
  useEffect(() => {
    // Sirf client pe div banao
    const counterDiv = document.createElement('div');
    counterDiv.id = 'histats_counter';
    document.body.appendChild(counterDiv);

    // Histats code inject karo
    var _Hasync = _Hasync || [];
    _Hasync.push(['Histats.start', '1,4996996,4,511,95,18,00000000']);
    _Hasync.push(['Histats.fasi', '1']);
    _Hasync.push(['Histats.track_hits', '']);

    (function() {
      var hs = document.createElement('script');
      hs.type = 'text/javascript';
      hs.async = true;
      hs.src = '//s10.histats.com/js15_as.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
    })();

    // Cleanup (optional, achhi practice)
    return () => {
      if (counterDiv.parentNode) {
        counterDiv.parentNode.removeChild(counterDiv);
      }
    };
  }, []);

  // Kuch render mat karo
  return null;
}