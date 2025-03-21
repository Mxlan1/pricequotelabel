import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';

const API_BASE_URL = 'https://localhost:7290/api/labels';

export default function TabTwoScreen() {
  const [form, setForm] = useState({
    QuoteId: '',
    RecipientName: '',
    RecipientAddressLine1: '',
    RecipientAddressLine2: '',
    RecipientCountry: '',
  });

  const [trackingNumber, setTrackingNumber] = useState('');  

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleTrackingNumberChange = (value: string) => {
    setTrackingNumber(value);
  };

  const handleSubmit = async () => {
    try {
      console.log("Form Data:", form);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          QuoteId: form.QuoteId,
          RecipientName: form.RecipientName,
          RecipientAddressLine1: form.RecipientAddressLine1,
          RecipientAddressLine2: form.RecipientAddressLine2,
          RecipientCountry: form.RecipientCountry
        }),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        throw new Error(`Serverfout: ${JSON.stringify(responseData)}`);
      }

      // Als het succesvol is, toon je een alert
      Alert.alert('Succes', 'Label succesvol aangemaakt!');
    } catch (error) {
      console.error('API-fout:', error);
      Alert.alert('Fout', 'Er is iets mis gegaan bij het versturen van de aanvraag');
    }
  };

  const handleDownload = async () => {
    if (!trackingNumber) {
      Alert.alert('Fout', 'Voer een trackingnummer in');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${trackingNumber}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream', 
        },
      });

      if (response.ok) {
        const blob = await response.blob(); 
        const url = window.URL.createObjectURL(blob); 

        const link = document.createElement('a');
        link.href = url;
        link.download = `${trackingNumber}.pdf`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
      } else {
        throw new Error('Er ging iets mis bij het downloaden van het bestand');
      }
    } catch (error) {
      console.error('Download fout:', error);
      Alert.alert('Fout', 'Er is iets mis gegaan bij het downloaden van het bestand');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Label Aanmaken</Text>

      {/* Formulier om gegevens in te voeren */}
      <TextInput
        style={styles.input}
        placeholder="Quote ID"
        value={form.QuoteId}
        onChangeText={(value) => handleChange('QuoteId', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipient Name"
        value={form.RecipientName}
        onChangeText={(value) => handleChange('RecipientName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipient Address Line 1"
        value={form.RecipientAddressLine1}
        onChangeText={(value) => handleChange('RecipientAddressLine1', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipient Address Line 2"
        value={form.RecipientAddressLine2}
        onChangeText={(value) => handleChange('RecipientAddressLine2', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipient Country"
        value={form.RecipientCountry}
        onChangeText={(value) => handleChange('RecipientCountry', value)}
      />

      <Button title="Verzend Label Info" onPress={handleSubmit} />

      <TextInput
        style={styles.input}
        placeholder="Voer Trackingnummer in"
        value={trackingNumber}
        onChangeText={handleTrackingNumberChange}
      />

      <Button title="Download Label" onPress={handleDownload} />
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
});
