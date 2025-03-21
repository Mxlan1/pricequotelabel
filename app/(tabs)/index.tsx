//starten van applicatie npm run web

import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, Text } from 'react-native';
import { View } from '@/components/Themed';

const API_BASE_URL = 'https://hogent-shipit-milanmoerman-quote.azurewebsites.net/api/pricequotes';

interface PriceQuoteResponse {
  id: string;
  price: number;
  validUntil: string; 
}

export default function TabOneScreen() {
  const [form, setForm] = useState({
    WidthCm: '',
    HeightCm: '',
    DepthCm: '',
    WeightKg: '',
    CountryFrom: '',
    CountryTo: '',
  });

  const [responseData, setResponseData] = useState<PriceQuoteResponse | null>(null);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          WidthCm: parseInt(form.WidthCm, 10),
          HeightCm: parseInt(form.HeightCm, 10),
          DepthCm: parseInt(form.DepthCm, 10),
          WeightKg: parseFloat(form.WeightKg),
          CountryFrom: form.CountryFrom,
          CountryTo: form.CountryTo,
        }),
      });

      const responseJson = await response.json();
      console.log('API Response:', responseJson);

      if (!response.ok) {
        throw new Error(`Serverfout: ${JSON.stringify(responseJson)}`);
      }

      setResponseData(responseJson);
    } catch (error) {
      console.error('API-fout:', error);
      Alert.alert('Fout');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PriceQuote</Text>
      <TextInput
        style={styles.input}
        placeholder="Width (cm)"
        keyboardType="numeric"
        value={form.WidthCm}
        onChangeText={(value) => handleChange('WidthCm', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={form.HeightCm}
        onChangeText={(value) => handleChange('HeightCm', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Depth (cm)"
        keyboardType="numeric"
        value={form.DepthCm}
        onChangeText={(value) => handleChange('DepthCm', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={form.WeightKg}
        onChangeText={(value) => handleChange('WeightKg', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Country From"
        value={form.CountryFrom}
        onChangeText={(value) => handleChange('CountryFrom', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Country To"
        value={form.CountryTo}
        onChangeText={(value) => handleChange('CountryTo', value)}
      />
      <Button title="Verstuur aanvraag" onPress={handleSubmit} />

      {responseData && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>ID: {responseData.id}</Text>
          <Text style={styles.responseText}>Price: {responseData.price}</Text>
          <Text style={styles.responseText}>Valid Until: {responseData.validUntil}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  responseText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
