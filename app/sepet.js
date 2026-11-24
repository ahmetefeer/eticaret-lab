import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSepet } from '../context/SepetContext';

function SepetUrunu({ item, adetAzalt, adetArtir, urunSil }) {
  return (
    <View style={styles.kart}>
      <Image source={{ uri: item.thumbnail }} style={styles.resim} resizeMode="contain" />
      <View style={styles.bilgiler}>
        <Text style={styles.urunAdi} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.fiyat}>${(item.price * item.adet).toFixed(2)}</Text>
        <View style={styles.altSatir}>
          <View style={styles.adetAlani}>
            <Pressable accessibilityRole="button" accessibilityLabel={`${item.title} adedini azalt`} style={styles.adetButon} onPress={() => adetAzalt(item.id)}>
              <Text style={styles.adetButonYazi}>−</Text>
            </Pressable>
            <Text style={styles.adet}>{item.adet}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`${item.title} adedini artır`} style={styles.adetButon} onPress={() => adetArtir(item.id)}>
              <Text style={styles.adetButonYazi}>+</Text>
            </Pressable>
          </View>
          <Pressable accessibilityRole="button" onPress={() => urunSil(item.id)}>
            <Text style={styles.sil}>Sil</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function SepetSayfasi() {
  const router = useRouter();
  const { sepet, urunSil, adetArtir, adetAzalt, toplamTutar, toplamAdet } = useSepet();

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.ustAlan}>
        <Text style={styles.baslik}>Sepetim</Text>
        <Text style={styles.altBaslik}>Toplam ürün adedi: {toplamAdet}</Text>
      </View>

      {sepet.length === 0 ? (
        <View style={styles.bosSepet}>
          <Text style={styles.bosIkon}>🛒</Text>
          <Text style={styles.bosBaslik}>Sepetin şu an boş</Text>
          <Text style={styles.bosYazi}>Beğendiğin ürünleri buradan bulabilirsin.</Text>
          <Pressable style={styles.alisverisButon} onPress={() => router.navigate('/')}>
            <Text style={styles.butonYazi}>Alışverişe Dön</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={sepet}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SepetUrunu item={item} adetAzalt={adetAzalt} adetArtir={adetArtir} urunSil={urunSil} />
            )}
            contentContainerStyle={styles.liste}
          />
          <View style={styles.altAlan}>
            <View style={styles.toplamSatir}>
              <Text style={styles.toplamEtiket}>Ara toplam</Text>
              <Text style={styles.toplam}>${toplamTutar.toFixed(2)}</Text>
            </View>
            <Text style={styles.not}>Fiyatlara varsa indirimler uygulanmıştır.</Text>
            <Pressable style={styles.alisverisButon} onPress={() => router.navigate('/')}>
              <Text style={styles.butonYazi}>Alışverişe Devam Et</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  ustAlan: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 13, backgroundColor: '#ffffff' },
  baslik: { color: '#111827', fontSize: 23, fontWeight: '800' },
  altBaslik: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  liste: { padding: 14, paddingBottom: 20 },
  kart: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, padding: 12, marginBottom: 11 },
  resim: { width: 82, height: 82, marginRight: 12 },
  bilgiler: { flex: 1 },
  urunAdi: { color: '#111827', fontSize: 14, fontWeight: '700', lineHeight: 19, marginBottom: 5 },
  fiyat: { color: '#2563eb', fontSize: 16, fontWeight: '800', marginBottom: 9 },
  altSatir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  adetAlani: { flexDirection: 'row', alignItems: 'center' },
  adetButon: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb', borderRadius: 8 },
  adetButonYazi: { color: '#111827', fontSize: 19, fontWeight: '700' },
  adet: { color: '#111827', fontSize: 15, fontWeight: '700', marginHorizontal: 13 },
  sil: { color: '#dc2626', fontSize: 13, fontWeight: '700', padding: 6 },
  altAlan: { backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e5e7eb', padding: 17, paddingBottom: 20 },
  toplamSatir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toplamEtiket: { color: '#374151', fontSize: 15 },
  toplam: { color: '#111827', fontSize: 22, fontWeight: '800' },
  not: { color: '#9ca3af', fontSize: 12, marginTop: 5, marginBottom: 14 },
  alisverisButon: { backgroundColor: '#2563eb', borderRadius: 12, padding: 14, alignItems: 'center' },
  butonYazi: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  bosSepet: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  bosIkon: { fontSize: 42, marginBottom: 12 },
  bosBaslik: { color: '#111827', fontSize: 19, fontWeight: '800' },
  bosYazi: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginTop: 7, marginBottom: 20 },
});
