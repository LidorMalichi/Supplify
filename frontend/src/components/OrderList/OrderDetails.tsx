import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useOrder } from '../../contexts/OrderContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import { doGet } from '../../util/HTTPRequests';
import { globals } from '../../util/Globals';
import styles from './OrderDetails.styles';
import { LoginContext } from '../../contexts/LoginContext';
import { LoginContextType } from '../../contexts/UserContext';

interface CreateOrderRequest {
  businessId: string | null;
  orderId?: number;
}

interface OrderDetails {
  id: number;
  user: {
    id: number;
    name: string;
  };
  business: {
    id: number;
    name: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price?: number;
  }[];
  totalAmount: number;
  status: string;
  orderDate: string;
}

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'approved':
        return { bg: '#D1FAE5', text: '#059669' };
      case 'rejected':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#E5E7EB', text: '#374151' };
    }
  };

  const colors = getStatusColor();
  return (
    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.statusText, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

const OrderDetailsScreen = () => {
  const { selectedOrderId } = useOrder();
  const navigation = useNavigation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  const [userRole] = useState<'manager' | 'employee'>('manager');

  useEffect(() => {
    if (!selectedOrderId) {
      navigation.goBack();
      return;
    }
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
    
        const orderRequest: CreateOrderRequest = {
          businessId: userInfo.businessId,
          orderId: selectedOrderId,
        };
    
        const queryParams = new URLSearchParams({
          businessId: orderRequest.businessId ? orderRequest.businessId.toString() : '',
          orderId: orderRequest.orderId?.toString() || '',
        }).toString();
    
        const response = await doGet(`${globals.ORDER.getOrderInfo}?${queryParams}`);
        console.log('API Response:', response); // Add this to inspect the full API response
    
        setOrderDetails({
          id: response.id || 0,
          user: response.user || { id: 0, name: '' },
          business: response.business || { id: 0, name: '' },
          items: response.orderProducts || [], // Make sure you're using the correct property here
          totalAmount: response.totalAmount || 0,
          status: response.status || '',
          orderDate: response.orderDate || '',
        });
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchOrderDetails();
  }, [selectedOrderId]);

  if (!selectedOrderId) return null;

  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar userRole={userRole} />}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon name={isSidebarVisible ? 'x' : 'menu'} size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>פרטי הזמנה</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-right" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.retryButtonText}>חזור אחורה</Text>
            </TouchableOpacity>
          </View>
        ) : orderDetails ? (
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <OrderStatusBadge status={orderDetails.status} />
                <Text style={styles.orderId}>הזמנה #{orderDetails.id}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>תאריך:</Text>
                <Text style={styles.value}>
                  {new Date(orderDetails.orderDate).toLocaleDateString('he-IL')}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>ספק:</Text>
                <Text style={styles.value}>
                  {orderDetails.business ? orderDetails.business.name : 'N/A'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>מזמין:</Text>
                <Text style={styles.value}>
                  {orderDetails.user ? orderDetails.user.name : 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
  <Text style={styles.sectionTitle}>פריטים</Text>
  {orderDetails.items && orderDetails.items.length > 0 ? (
    orderDetails.items.map((item) => {
      return (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text> 
            <Text style={styles.itemQuantity}>כמות: {item.quantity}</Text>
          </View>
          {item.price && (
            <Text style={styles.itemPrice}>
              ₪{(item.price * item.quantity).toFixed(2)}
            </Text>
          )}
        </View>
      );
    })
  ) : (
    <Text style={styles.noItemsText}>No items found in this order.</Text>
  )}
</View>

            {orderDetails.totalAmount > 0 && (
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>סה"כ:</Text>
                <Text style={styles.totalAmount}>
                  ₪{orderDetails.totalAmount.toFixed(2)}
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>No order details found.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;
