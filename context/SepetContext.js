import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const SepetContext = createContext(null);

export function SepetProvider({ children }) {
  const [sepet, setSepet] = useState([]);

  const sepeteEkle = useCallback((urun) => {
    setSepet((oncekiSepet) => {
      const varOlanUrun = oncekiSepet.find((item) => item.id === urun.id);
      if (varOlanUrun) {
        return oncekiSepet.map((item) => (
          item.id === urun.id ? { ...item, adet: item.adet + 1 } : item
        ));
      }
      return [...oncekiSepet, { ...urun, adet: 1 }];
    });
  }, []);

  const urunSil = useCallback((id) => {
    setSepet((oncekiSepet) => oncekiSepet.filter((item) => item.id !== id));
  }, []);

  const adetArtir = useCallback((id) => {
    setSepet((oncekiSepet) => oncekiSepet.map((item) => (
      item.id === id ? { ...item, adet: item.adet + 1 } : item
    )));
  }, []);

  const adetAzalt = useCallback((id) => {
    setSepet((oncekiSepet) => oncekiSepet.map((item) => (
      item.id === id ? { ...item, adet: Math.max(1, item.adet - 1) } : item
    )));
  }, []);

  const toplamTutar = useMemo(
    () => sepet.reduce((toplam, item) => toplam + item.price * item.adet, 0),
    [sepet],
  );
  const toplamAdet = useMemo(
    () => sepet.reduce((toplam, item) => toplam + item.adet, 0),
    [sepet],
  );

  const value = useMemo(() => ({
    sepet,
    sepeteEkle,
    urunSil,
    adetArtir,
    adetAzalt,
    toplamTutar,
    toplamAdet,
  }), [sepet, toplamTutar, toplamAdet, sepeteEkle, urunSil, adetArtir, adetAzalt]);

  return <SepetContext.Provider value={value}>{children}</SepetContext.Provider>;
}

export function useSepet() {
  const context = useContext(SepetContext);
  if (!context) {
    throw new Error('useSepet, SepetProvider içinde kullanılmalıdır.');
  }
  return context;
}
