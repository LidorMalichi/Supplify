import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';


import LoginScreen from './src/Screens/login/login';
import RegisterScreen from './src/Screens/registration/registration';
// import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
 import HomeScreen from './src/Screens/Home/Home'
 import AddSupplierScreen from './src/Screens/AddSupplir/AddSupplir';
import AddProductScreen from './src/Screens/AddProduct/AddProduct';
import SuppliersListScreen from './src/Screens/SuppliersList/SuppliersList';
import ProductListScreen from './src/Screens/ProductList/ProductList';
export const API_BASE_URL = 'http:///10.0.0.10:8080';


export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home:undefined;
  AddSupplier:undefined;
  AddProduct: undefined;
  SuppliersList:undefined;
  ProductList:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddSupplier" component={AddSupplierScreen} />
      <Stack.Screen name="SuppliersList" component={SuppliersListScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;