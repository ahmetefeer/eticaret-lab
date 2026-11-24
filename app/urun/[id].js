import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSepet } from '../../context/SepetContext';

export default function UrunDetay() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { sepeteEkle } = useSepet();
  const [urun, setUrun] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');

  useEffect(() => {
    let aktif = true;
    async function urunGetir() {
      try {
        setYukleniyor(true);
        setHata('');
        const cevap = await fetch(`https://dummyjson.com/products/${id}`);
        if (!cevap.ok) throw new Error('Ürün bulunamadı.');
        const veri = await cevap.json();
        if (aktif) setUrun(veri);
      } catch (error) {
        if (aktif) setHata(error.message || 'Ürün yüklenemedi.');
      } finally {
        if (aktif) setYukleniyor(false);
      }
    }
    if (id) urunGetir();
    return () => { aktif = false; };
  }, [id]);

  const indirimliFiyat = urun
    ? urun.price * (1 - (urun.discountPercentage || 0) / 100)
    : 0;

  return (
    <>
      <Stack.Screen options={{ title: urun ? urun.title : 'Ürün Detayı' }} />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        {yukleniyor ? (
          <View style={styles.durumAlani}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.durumMetni}>Ürün bilgisi yükleniyor...</Text>
          </View>
        ) : hata ? (
          <View style={styles.durumAlani}><Text style={styles.hata}>{hata}</Text></View>
        ) : urun ? (
          <ScrollView contentContainerStyle={styles.icerik}>
            <View style={styles.resimAlani}>
              <Image source={{ uri: urun.thumbnail }} style={styles.resim} resizeMode="contain" />
              {urun.discountPercentage > 0 && (
                <View style={styles.indirimRozeti}>
                  <Text style={styles.indirimYazi}>%{Math.round(urun.discountPercentage)} İNDİRİM</Text>
                </View>
              )}
            </View>
            <Text style={styles.baslik}>{urun.title}</Text>
            <Text style={styles.kategori}>{urun.category}</Text>
            <View style={styles.puanSatiri}>
              <Text style={styles.puan}>★ {Number(urun.rating || 0).toFixed(1)}</Text>
              <Text style={styles.stok}>Stok: {urun.stock}</Text>
            </View>
            <View style={styles.fiyatAlani}>
              <Text style={styles.fiyat}>${indirimliFiyat.toFixed(2)}</Text>
              {urun.discountPercentage > 0 && (
                <Text style={styles.eskiFiyat}>${urun.price.toFixed(2)}</Text>
              )}
            </View>
            <Text style={styles.aciklamaBaslik}>Ürün açıklaması</Text>
            <Text style={styles.aciklama}>{urun.description}</Text>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.buton, pressed && styles.basili]}
              onPress={() => {
                sepeteEkle(urun);
                router.push('/sepet');
              }}
            >
              <Text style={styles.butonYazi}>Sepete Ekle</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <View style={styles.durumAlani}><Text style={styles.hata}>Ürün bilgisi bulunamadı.</Text></View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  durumAlani: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  durumMetni: { color: '#6b7280', marginTop: 12 },
  hata: { color: '#b91c1c', textAlign: 'center', fontSize: 16 },
  icerik: { padding: 18, paddingBottom: 34 },
  resimAlani: { backgroundColor: '#f9fafb', borderRadius: 18, marginBottom: 18, position: 'relative' },
  resim: { width: '100%', height: 250 },
  indirimRozeti: { position: 'absolute', left: 12, top: 12, backgroundColor: '#dc2626', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  indirimYazi: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  baslik: { color: '#111827', fontSize: 23, fontWeight: '800', lineHeight: 29 },
  kategori: { color: '#6b7280', fontSize: 14, textTransform: 'capitalize', marginTop: 7 },
  puanSatiri: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 },
  puan: { color: '#b45309', fontSize: 14, fontWeight: '700' },
  stok: { color: '#6b7280', fontSize: 13 },
  fiyatAlani: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 17, marginBottom: 21 },
  fiyat: { color: '#2563eb', fontSize: 28, fontWeight: '800' },
  eskiFiyat: { color: '#9ca3af', fontSize: 16, textDecorationLine: 'line-through' },
  aciklamaBaslik: { color: '#111827', fontSize: 17, fontWeight: '700', marginBottom: 8 },
  aciklama: { color: '#4b5563', fontSize: 15, lineHeight: 23, marginBottom: 24 },
  buton: { backgroundColor: '#2563eb', borderRadius: 13, paddingVertical: 15, alignItems: 'center' },
  basili: { opacity: 0.75 },
  butonYazi: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
