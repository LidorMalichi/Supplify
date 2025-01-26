import React, { useState, useEffect } from 'react';
import {
 View, Text, TextInput, TouchableOpacity, StyleSheet, 
 ScrollView, SafeAreaView, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import { API_BASE_URL } from '../../../App';

interface Product {
 id: number;
 productName: string;
 description: string;
 basePrice: number;
 stockQuantity: number;
 barcode: string;
 sellingPrice: number;
 requestedStock: number;
 imagePath: string;
}

const ProductList = () => {
 const [products, setProducts] = useState<Product[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [userRole] = useState<'manager' | 'employee'>('manager');
 const [isSidebarVisible, setIsSidebarVisible] = useState(false);
 const [quantities, setQuantities] = useState<{[key: number]: number}>({});

 useEffect(() => {
   fetchProducts();
 }, []);

 const fetchProducts = async () => {
   setIsLoading(true);
   try {
     const response = await fetch(`${API_BASE_URL}/api/products/business/20`);
     if (response.ok) {
       const data = await response.json();
       setProducts(data);
       const initialQuantities = data.reduce((acc: {[key: number]: number}, product: Product) => {
         acc[product.id] = 0;
         return acc;
       }, {});
       setQuantities(initialQuantities);
     } else {
       throw new Error('Failed to fetch products');
     }
   } catch (error) {
     console.error('Error fetching products:', error);
     Alert.alert('שגיאה', 'אירעה שגיאה בטעינת רשימת המוצרים');
   } finally {
     setIsLoading(false);
   }
 };

 const updateQuantity = (productId: number, increment: boolean) => {
   setQuantities(prev => ({
     ...prev,
     [productId]: Math.max(0, prev[productId] + (increment ? 1 : -1))
   }));
 };

 const filteredProducts = products.filter(product => 
   (product.productName?.includes(searchQuery) || product.barcode?.includes(searchQuery)) ?? false
 );

 return (
   <SafeAreaView style={styles.container}>
     {isSidebarVisible && <Sidebar userRole={userRole} />}
     <View style={styles.mainContent}>
       <View style={styles.header}>
         <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
           <Icon name={isSidebarVisible ? "x" : "menu"} size={24} color="#4A90E2" />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>רשימת מוצרים</Text>
       </View>

       <View style={styles.searchContainer}>
         <TextInput
           style={styles.searchInput}
           placeholder="חיפוש לפי שם מוצר / ברקוד"
           value={searchQuery}
           onChangeText={setSearchQuery}
         />
         <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
       </View>

       <ScrollView style={styles.productList}>
         {filteredProducts.map(product => (
           <View key={product.id} style={styles.productCard}>
             <View style={styles.cardContent}>
               {/* Image Section */}
               <View style={styles.imageContainer} />
               
               {/* Details Section */}
               <View style={styles.detailsSection}>
                 {/* Product Info */}
                 <View style={styles.productInfo}>
                   <Text style={styles.productName}>{product.productName}</Text>
                   <Text style={styles.productBarcode}>ברקוד: {product.barcode}</Text>
                   <Text style={styles.productPrice}>₪{product.basePrice}</Text>
                 </View>
                 
                 {/* Actions Section */}
                 <View style={styles.actionsSection}>
                   <View style={styles.quantityControls}>
                     <TouchableOpacity 
                       style={styles.quantityButton}
                       onPress={() => updateQuantity(product.id, false)}>
                       <Icon name="minus" size={16} color="#4A90E2" />
                     </TouchableOpacity>
                     <Text style={styles.quantityText}>{quantities[product.id]}</Text>
                     <TouchableOpacity 
                       style={styles.quantityButton}
                       onPress={() => updateQuantity(product.id, true)}>
                       <Icon name="plus" size={16} color="#4A90E2" />
                     </TouchableOpacity>
                   </View>
                   <TouchableOpacity style={styles.addToCartButton}>
                     <Icon name="shopping-cart" size={16} color="white" />
                     <Text style={styles.addToCartText}>הוסף לסל</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             </View>
           </View>
         ))}
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
 },
 searchContainer: {
   flexDirection: 'row-reverse',
   padding: 16,
   backgroundColor: 'white',
   borderBottomWidth: 1,
   borderBottomColor: '#E5E7EB',
 },
 searchInput: {
   flex: 1,
   height: 40,
   backgroundColor: '#F9FAFB',
   borderWidth: 1,
   borderColor: '#E5E7EB',
   borderRadius: 8,
   paddingHorizontal: 16,
   textAlign: 'right',
 },
 searchIcon: {
   marginLeft: 12,
 },
 productList: {
   padding: 16,
 },
 productCard: {
   backgroundColor: 'white',
   borderRadius: 12,
   marginBottom: 12,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 2,
 },
 cardContent: {
   padding: 12,
   flexDirection: 'row-reverse',
 },
 imageContainer: {
   width: 90,
   height: 90,
   backgroundColor: '#F3F4F6',
   borderRadius: 8,
   marginLeft: 12,
 },
 detailsSection: {
   flex: 1,
   justifyContent: 'space-between',
 },
 productInfo: {
   alignItems: 'flex-end',
 },
 productName: {
   fontSize: 16,
   fontWeight: '600',
   color: '#1F2937',
   marginBottom: 4,
 },
 productBarcode: {
   fontSize: 13,
   color: '#6B7280',
   marginBottom: 4,
 },
 productPrice: {
   fontSize: 15,
   fontWeight: '600',
   color: '#4A90E2',
 },
 actionsSection: {
   marginTop: 8,
   alignItems: 'flex-end',
 },
 quantityControls: {
   flexDirection: 'row-reverse',
   alignItems: 'center',
   marginBottom: 8,
 },
 quantityButton: {
   width: 24,
   height: 24,
   borderWidth: 1,
   borderColor: '#4A90E2',
   borderRadius: 6,
   justifyContent: 'center',
   alignItems: 'center',
   marginHorizontal: 4,
 },
 quantityText: {
   fontSize: 14,
   fontWeight: '500',
   paddingHorizontal: 8,
 },
 addToCartButton: {
   flexDirection: 'row-reverse',
   backgroundColor: '#4A90E2',
   paddingVertical: 8,
   paddingHorizontal: 12,
   borderRadius: 6,
   alignItems: 'center',
 },
 addToCartText: {
   color: 'white',
   fontSize: 14,
   fontWeight: '500',
   marginRight: 6,
 },
});

export default ProductList;