import React, { useState, useEffect } from 'react';
import {
 View, Text, TextInput, TouchableOpacity, StyleSheet, 
 ScrollView, SafeAreaView, Alert, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { API_BASE_URL, RootStackParamList } from '../../../App';
import Sidebar from '../../components/sidebar-component';

type AddProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddProduct'>;

interface SupplierItem {
 label: string;
 value: string;
}

const AddProductScreen = () => {
 const navigation = useNavigation<AddProductScreenNavigationProp>();
 const [userRole] = useState<'manager' | 'employee'>('manager');
 const [isSidebarVisible, setIsSidebarVisible] = useState(false);
 const [openSupplierDropdown, setOpenSupplierDropdown] = useState(false);
 const [supplierItems, setSupplierItems] = useState<SupplierItem[]>([]);

 const [productData, setProductData] = useState({
  barcode: '',
  productName: '', 
  basePrice: '', 
  description: '',
  supplier: '',
  sellingPrice: '',
  requestedStock: '',
  imagePath: null as string | null, 
});
 useEffect(() => {
   fetchSuppliers();
 }, []);

 interface Supplier {
  supplierId: number;
  companyName: string;
}

const fetchSuppliers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/business/20`);
    if (response.ok) {
      const data = await response.json();
      const items = data.map((supplier: Supplier) => ({
        label: supplier.companyName,
        value: supplier.supplierId.toString(),

      }));
      setSupplierItems(items);
    } else {
      throw new Error('Failed to fetch suppliers');
    }
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    Alert.alert("שגיאה", "אירעה שגיאה בטעינת רשימת הספקים");
  }
};

 const handleAddProduct = async () => {
  console.log("Supplier ID:", productData.supplier);

   try {
     const response = await fetch(`${API_BASE_URL}/api/products/business/${productData.supplier}`, {
      //const response = await fetch(`${API_BASE_URL}/api/products/business/13`, {

       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(productData),
     });

     if (response.ok) {
       Alert.alert('הצלחה', 'המוצר נוסף בהצלחה!');
       navigation.goBack();
     } else {
       throw new Error('Failed to add product');
     }
   } catch (error) {
     console.error('Error adding product:', error);
     Alert.alert('שגיאה', 'אירעה שגיאה בהוספת המוצר');
   }
 };

 const handleImagePicker = () => {
   launchImageLibrary({ mediaType: 'photo' }, (response) => {
     if (response.didCancel) {
       console.log('User cancelled image picker');
     } else if (response.errorMessage) {
       console.log('ImagePicker Error: ', response.errorMessage);
     } else if (response.assets && response.assets[0].uri) {
       setProductData({ ...productData, imagePath: response.assets[0].uri });
     }
   });
 };

 return (
   <SafeAreaView style={styles.container}>
     {isSidebarVisible && <Sidebar userRole={userRole} />}
     <View style={styles.mainContent}>
       <View style={styles.header}>
         <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
           <Icon name={isSidebarVisible ? "x" : "menu"} size={24} color="#4A90E2" />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>הוספת מוצר חדש</Text>
       </View>
       <ScrollView contentContainerStyle={styles.scrollViewContent}>
         <View style={styles.inputContainer}>
           <TextInput
             style={styles.input}
             placeholder="ברקוד"
             value={productData.barcode}
             onChangeText={(text) => setProductData({ ...productData, barcode: text })}
             keyboardType="numeric"
           />
           <TextInput
             style={styles.input}
             placeholder="שם מוצר"
             value={productData.productName}
             onChangeText={(text) => setProductData({ ...productData, productName: text })}
           />
           <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
             <Text style={styles.imagePickerText}>העלה תמונה</Text>
           </TouchableOpacity>
           {productData.imagePath && (
             <Image source={{ uri: productData.imagePath }} style={styles.productImage} />
           )}
           <TextInput
             style={styles.input}
             placeholder="מחיר (אופציונלי)"
             value={productData.basePrice}
             onChangeText={(text) => setProductData({ ...productData, basePrice: text })}
             keyboardType="numeric"
           />
           <TextInput
             style={[styles.input, styles.textArea]}
             placeholder="תיאור מוצר"
             value={productData.description}
             onChangeText={(text) => setProductData({ ...productData, description: text })}
             multiline
           />

           <View style={{ zIndex: 3000, marginBottom: 16 }}>
             <DropDownPicker
               open={openSupplierDropdown}
               value={productData.supplier}
               items={supplierItems}
               setOpen={setOpenSupplierDropdown}
               setValue={(callback) => {
                 if (typeof callback === 'function') {
                   const value = callback(productData.supplier);
                   setProductData(prev => ({ ...prev, supplier: value }));
                 } else {
                   setProductData(prev => ({ ...prev, supplier: callback }));
                 }
               }}
               setItems={setSupplierItems}
               placeholder="בחר ספק"
               style={styles.input}
               textStyle={{
                 textAlign: 'right'
               }}
               rtl={true}
               listMode="SCROLLVIEW"
             />
           </View>

           <TextInput
             style={styles.input}
             placeholder="מחיר מכירה"
             value={productData.sellingPrice}
             onChangeText={(text) => setProductData({ ...productData, sellingPrice: text })}
             keyboardType="numeric"
           />
           {userRole === 'manager' && (
             <TextInput
               style={styles.input}
               placeholder="מלאי מתבקש"
               value={productData.requestedStock}
               onChangeText={(text) => setProductData({ ...productData, requestedStock: text })}
               keyboardType="numeric"
             />
           )}
         </View>
         <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
           <Text style={styles.buttonText}>הוסף מוצר</Text>
         </TouchableOpacity>
       </ScrollView>
     </View>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   flexDirection: 'row-reverse',
   backgroundColor: '#F6F7FC',
 },
 mainContent: {
   flex: 1,
 },
 header: {
   flexDirection: 'row-reverse',
   alignItems: 'center',
   padding: 16,
   borderBottomWidth: 1,
   borderBottomColor: '#E1E1E1',
 },
 headerTitle: {
   fontSize: 20,
   fontWeight: 'bold',
   color: '#4A90E2',
   marginRight: 16,
 },
 scrollViewContent: {
   flexGrow: 1,
   padding: 20,
 },
 inputContainer: {
   backgroundColor: 'white',
   borderRadius: 8,
   padding: 16,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 3,
 },
 input: {
   height: 50,
   borderWidth: 1,
   borderColor: '#D1D1D1',
   borderRadius: 8,
   paddingHorizontal: 16,
   marginBottom: 16,
   textAlign: 'right',
 },
 textArea: {
   height: 100,
   textAlignVertical: 'top',
 },
 button: {
   backgroundColor: '#4A90E2',
   height: 50,
   borderRadius: 8,
   justifyContent: 'center',
   alignItems: 'center',
   marginTop: 24,
 },
 buttonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
 },
 imagePickerButton: {
   backgroundColor: '#E1E1E1',
   padding: 10,
   borderRadius: 8,
   alignItems: 'center',
   marginBottom: 16,
 },
 imagePickerText: {
   color: '#4A90E2',
   fontWeight: 'bold',
 },
 productImage: {
   width: '100%',
   height: 200,
   resizeMode: 'cover',
   borderRadius: 8,
   marginBottom: 16,
 },
});

export default AddProductScreen;