import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import UrunKarti from '../components/UrunKarti';
import { useSepet } from '../context/SepetContext';

export default function AnaSayfa() {
  const router = useRouter();
  const { toplamAdet } = useSepet();
  const [arama, setArama] = useState('');
  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [yenilemeNo, setYenilemeNo] = useState(0);

  useEffect(() => {
    let aktif = true;
    const zamanlayici = setTimeout(async () => {
      try {
        setYukleniyor(true);
        setHata('');
        const q = arama.trim();
        const url = q
          ? `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=20`
          : 'https://dummyjson.com/products?limit=20';
        const cevap = await fetch(url);
        if (!cevap.ok) throw new Error('Ürünler alınamadı. İnternet bağlantını kontrol edip tekrar dene.');
        const veri = await cevap.json();
        if (aktif) setUrunler(Array.isArray(veri.products) ? veri.products : []);
      } catch (error) {
        if (aktif) setHata(error.message || 'Beklenmeyen bir hata oluştu.');
      } finally {
        if (aktif) setYukleniyor(false);
      }
    }, arama.trim() ? 350 : 0);

    return () => {
      aktif = false;
      clearTimeout(zamanlayici);
    };
  }, [arama, yenilemeNo]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.ustAlan}>
        <View style={styles.baslikAlani}>
          <Text style={styles.kucukBaslik}>HOŞ GELDİN</Text>
          <Text style={styles.baslik}>E-Ticaret Mağazam</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.sepetButon, pressed && styles.basili]}
          onPress={() => router.push('/sepet')}
        >
          <Text style={styles.sepetIkon}>🛒</Text>
          <Text style={styles.sepetYazi}>Sepetim ({toplamAdet})</Text>
        </Pressable>
      </View>

      <View style={styles.aramaKutusu}>
        <Text style={styles.aramaIkon}>⌕</Text>
        <TextInput
          value={arama}
          onChangeText={setArama}
          placeholder="Ürün ara..."
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          style={styles.aramaInput}
          accessibilityLabel="Ürün ara"
        />
        {arama.length > 0 && (
          <Pressable onPress={() => setArama('')} accessibilityRole="button" accessibilityLabel="Aramayı temizle">
            <Text style={styles.temizle}>×</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.listeBaslik}>{arama.trim() ? 'Arama sonuçları' : 'Öne çıkan ürünler'}</Text>

      {yukleniyor ? (
        <View style={styles.mesajAlani}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.bilgiMetni}>Ürünler yükleniyor...</Text>
        </View>
      ) : hata ? (
        <View style={styles.mesajAlani}>
          <Text style={styles.hata}>{hata}</Text>
          <Pressable style={styles.tekrarButon} onPress={() => setYenilemeNo((value) => value + 1)}>
            <Text style={styles.tekrarYazi}>Tekrar Dene</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={urunler}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.liste}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<Text style={styles.bosListe}>Bu aramayla eşleşen ürün bulunamadı.</Text>}
          renderItem={({ item }) => (
            <UrunKarti urun={item} onPress={() => router.push(`/urun/${item.id}`)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  ustAlan: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 10, paddingBottom: 15 },
  baslikAlani: { flex: 1 },
  kucukBaslik: { color: '#6b7280', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  baslik: { color: '#111827', fontSize: 20, fontWeight: '800' },
  sepetButon: { backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  sepetIkon: { fontSize: 17 },
  sepetYazi: { color: '#ffffff', fontWeight: '700', fontSize: 11, marginTop: 2 },
  basili: { opacity: 0.72 },
  aramaKutusu: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 13, marginHorizontal: 16, marginBottom: 18, paddingHorizontal: 13, borderWidth: 1, borderColor: '#e5e7eb' },
  aramaIkon: { fontSize: 24, color: '#6b7280', marginRight: 8 },
  aramaInput: { flex: 1, minHeight: 48, color: '#111827', fontSize: 15 },
  temizle: { color: '#6b7280', fontSize: 24, paddingHorizontal: 4 },
  listeBaslik: { marginHorizontal: 18, marginBottom: 10, color: '#374151', fontSize: 16, fontWeight: '700' },
  liste: { paddingHorizontal: 16, paddingBottom: 24 },
  mesajAlani: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  bilgiMetni: { color: '#6b7280', marginTop: 12 },
  hata: { color: '#b91c1c', textAlign: 'center', lineHeight: 21, marginBottom: 14 },
  tekrarButon: { backgroundColor: '#2563eb', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11 },
  tekrarYazi: { color: '#ffffff', fontWeight: '700' },
  bosListe: { color: '#6b7280', textAlign: 'center', marginTop: 32 },
});
