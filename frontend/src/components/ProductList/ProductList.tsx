import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../Sidebar/sidebar';
import {doGet} from '../../util/HTTPRequests';
import {globals} from '../../util/Globals';
import {useCart} from '../../contexts/CartContext';
import styles from './ProductList.styles';
import {BusinessProduct} from '../../types/models';
import {LoginContext} from '../../contexts/LoginContext';
import {LoginContextType} from '../../contexts/UserContext';

const ProductList = () => {
  const {userInfo} = useContext(LoginContext) as LoginContextType;
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {addToCart} = useCart();
  const [businessProducts, setBusinessProducts] = useState<BusinessProduct[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await doGet(
        `${globals.BUSINESS.getBusinessProducts}/${userInfo.businessId}`,
      );

      if (response.status === 200) {
        setBusinessProducts(response.data);

        // Initialize product quantities
        const initialQuantities = response.data.reduce(
          (acc: {[key: string]: number}, businessProduct: BusinessProduct) => {
            acc[businessProduct.product.id] = 0;
            return acc;
          },
          {},
        );
        setQuantities(initialQuantities);
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בטעינת רשימת המוצרים');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (productId: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] + (increment ? 1 : -1)),
    }));
  };

  const handleAddToCart = (businessProduct: BusinessProduct) => {
    const quantity = quantities[businessProduct.product.id] || 0;
    if (quantity > 0) {
      addToCart({
        businessProduct,
        quantity,
      });

      setSuccessMessage('מוצר נוסף לסל בהצלחה');

      // Hide the message after 2 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } else {
      Alert.alert('שגיאה', 'נא לבחור כמות לפני הוספה לסל');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>טוען מוצרים...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar />}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon
              name={isSidebarVisible ? 'x' : 'menu'}
              size={24}
              color="#4A90E2"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>רשימת מוצרים</Text>
        </View>

        {/* Success message */}
        {successMessage && (
          <View style={styles.successMessage}>
            <Text style={styles.successMessageText}>{successMessage}</Text>
          </View>
        )}
        {businessProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>אין מוצרים להצגה</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.productList}>
              {businessProducts.map(businessProduct => (
                <View
                  key={businessProduct.product.id}
                  style={styles.productCard}>
                  <View style={styles.cardContent}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: `${globals.PRODUCTION_URL}${businessProduct.imageUrl}`,
                        }}
                        style={styles.image}
                      />
                    </View>

                    <View style={styles.detailsSection}>
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>
                          {businessProduct.product.productName}
                        </Text>
                      </View>

                      <View style={styles.actionsSection}>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() =>
                              updateQuantity(businessProduct.product.id, false)
                            }>
                            <Icon name="minus" size={16} color="#4A90E2" />
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>
                            {quantities[businessProduct.product.id] || 0}
                          </Text>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() =>
                              updateQuantity(businessProduct.product.id, true)
                            }>
                            <Icon name="plus" size={16} color="#4A90E2" />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          style={styles.addToCartButton}
                          onPress={() => handleAddToCart(businessProduct)}>
                          <Icon name="shopping-cart" size={16} color="white" />
                          <Text style={styles.addToCartText}>הוסף לסל</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProductList;
