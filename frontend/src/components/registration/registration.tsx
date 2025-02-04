import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../../App';
import {ToastPromise} from '../../utils/ToastPromise';
import { doPost } from '../../utils/HTTPRequests';
import { globals } from '../../utils/Globals';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const SignUpScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    // כאן תבוצע לוגיקת הרשמה
    console.log('הרשמה:', { 
      firstName, 
      lastName, 
      businessName,
      username, 
      phone, 
      email,
      password 
    });

    const newAccount = async () => { await ToastPromise(doPost(globals.account.register, { firstName, lastName, businessName, phone, email, password })); };
    
    // לאחר הרשמה, עבור למסך ההתחברות
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Supplify</Text>
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.halfInput}
            placeholder="שם משפחה"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#A0A0A0"
          />
           <TextInput
            style={styles.halfInput}
            placeholder="שם פרטי"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="שם העסק"
          value={businessName}
          onChangeText={setBusinessName}
          placeholderTextColor="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="שם משתמש”"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="טלפון"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="מייל"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="סיסמא"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="אישור סיסמא"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#A0A0A0"
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>הירשם</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F1FB',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;