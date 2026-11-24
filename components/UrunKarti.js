import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function UrunKarti({ urun, onPress }) {
  const indirimliFiyat = urun.price * (1 - (urun.discountPercentage || 0) / 100);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${urun.title}, $${indirimliFiyat.toFixed(2)}, puan ${urun.rating}`}
      style={({ pressed }) => [styles.kart, pressed && styles.basili]}
      onPress={onPress}
    >
      <Image
        source={{ uri: urun.thumbnail }}
        style={styles.resim}
        resizeMode="contain"
      />
      <View style={styles.bilgiler}>
        <Text style={styles.baslik} numberOfLines={2}>{urun.title}</Text>
        <View style={styles.fiyatSatiri}>
          <Text style={styles.fiyat}>${indirimliFiyat.toFixed(2)}</Text>
          {urun.discountPercentage > 0 && (
            <Text style={styles.eskiFiyat}>${urun.price.toFixed(2)}</Text>
          )}
        </View>
        <Text style={styles.puan}>★ {Number(urun.rating || 0).toFixed(1)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kart: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 12,
  },
  basili: { opacity: 0.75 },
  resim: { width: 88, height: 88, marginRight: 14 },
  bilgiler: { flex: 1 },
  baslik: { color: '#111827', fontSize: 15, lineHeight: 20, fontWeight: '600', marginBottom: 7 },
  fiyatSatiri: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  fiyat: { color: '#2563eb', fontSize: 17, fontWeight: '800' },
  eskiFiyat: { color: '#9ca3af', fontSize: 13, textDecorationLine: 'line-through' },
  puan: { color: '#b45309', fontSize: 13, fontWeight: '600', marginTop: 5 },
});
