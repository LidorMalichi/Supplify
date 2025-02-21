import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import {API_BASE_URL, RootStackParamList} from '../../../App';
import {Alert} from 'react-native';
import styles from './SuppliersList.styles';
import { doGet, doPost } from '../../util/HTTPRequests';
import { globals } from '../../util/Globals';

type SuppliersListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SuppliersList'
>;

interface Supplier {
  supplierId: number; 
  companyName: string; 
  contactPerson: string;
  phone: string;
  email: string;
}

const SuppliersListScreen = () => {
  const navigation = useNavigation<SuppliersListScreenNavigationProp>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const data = await doGet(globals.SUPPLIERS.displaySupplier);
      console.log('API Response:', data);

      if (data) {
        setSuppliers(data);
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בטעינת רשימת הספקים');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    console.log('עריכת ספק:', supplier);
  };

 //
//add deletesupplier
// 
  
 
  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar userRole={userRole} />}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon name={isSidebarVisible ? 'x' : 'menu'} size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>רשימת ספקים</Text>
          {userRole === 'manager' && (
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddSupplier')}>
              <Icon name="plus" size={24} color="#4A90E2" />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={suppliers}
          renderItem={({ item }) => (
            <View style={styles.supplierCard}>
              <View style={styles.supplierHeader}>
                <Text style={styles.supplierName}>{item.companyName}</Text>
                {userRole === 'manager' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => handleEditSupplier(item)} style={styles.actionButton}>
                      <Icon name="edit-2" size={20} color="#4A90E2" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.supplierDetails}>
              <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>שם חברה:</Text>
                  <Text style={styles.detailText}>{item.contactPerson}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>איש קשר:</Text>
                  <Text style={styles.detailText}>{item.contactPerson}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>טלפון:</Text>
                  <Text style={styles.detailText}>{item.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>מייל:</Text>
                  <Text style={styles.detailText}>{item.email}</Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item.supplierId.toString()}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

export default SuppliersListScreen;


