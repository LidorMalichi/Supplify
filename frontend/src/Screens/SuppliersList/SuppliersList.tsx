import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import Sidebar from '../../components/sidebar-component';
import { API_BASE_URL, RootStackParamList } from '../../../App';
import axios from 'axios';
import { Alert } from 'react-native';

type SuppliersListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SuppliersList'>;

interface Supplier {
  supplierId: number; // שינוי מ-id ל-supplierId להתאמה למודל בשרת
  companyName: string; // שינוי מ-name ל-companyName להתאמה למודל בשרת
  contactPerson: string;
  phone: string;
  email: string;
}

const SuppliersListScreen = () => {
  const navigation = useNavigation<SuppliersListScreenNavigationProp>();
  const [userRole] = useState<'manager' | 'employee'>('manager');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // הוספת state לספקים
  const [isLoading, setIsLoading] = useState(false); // הוספת state לטעינה


  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        console.log('Attempting to fetch suppliers for business ID: 20');
        const response = await fetch(`${API_BASE_URL}/api/suppliers/business/20`); // Use the base URL here
  
        if (response.ok) {
          const data = await response.json();
          console.log('Response:', data);
          setSuppliers(data);
        } else {
          const errorData = await response.json();
          console.error('Error fetching suppliers:', errorData);
          Alert.alert(
            "שגיאה",
            errorData.message || "אירעה שגיאה בטעינת רשימת הספקים",
            [{ text: "אישור" }]
          );
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        Alert.alert(
          "שגיאה",
          "אירעה שגיאה בטעינת רשימת הספקים",
          [{ text: "אישור" }]
        );
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSuppliers();
  }, []); // הפונקציה תרוץ פעם אחת כשהקומפוננטה נטענת
  const handleEditSupplier = (supplier: Supplier) => {
    // Navigate to edit screen with supplier data
    console.log('עריכת ספק:', supplier);
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}`, {
        method: 'DELETE',  // Use DELETE method
      });
  
      if (response.ok) {
        // Filter the suppliers list to remove the deleted supplier
        setSuppliers(suppliers.filter(supplier => supplier.supplierId !== supplierId));
        console.log('Supplier deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Error deleting supplier:', errorData);
        Alert.alert(
          "שגיאה",
          errorData.message || "אירעה שגיאה במחיקת הספק",
          [{ text: "אישור" }]
        );
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      Alert.alert(
        "שגיאה",
        "אירעה שגיאה במחיקת הספק",
        [{ text: "אישור" }]
      );
    }
  };

  const renderSupplierCard = ({ item: supplier }: { item: Supplier }) => (
    <View style={styles.supplierCard}>
      <View style={styles.supplierHeader}>
        <Text style={styles.supplierName}>{supplier.companyName}</Text>
        {userRole === 'manager' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => handleEditSupplier(supplier)}
              style={styles.actionButton}
            >
              <Icon name="edit-2" size={20} color="#4A90E2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteSupplier(supplier.supplierId)}
              style={styles.actionButton}
            >
              <Icon name="trash-2" size={20} color="#FF4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.supplierDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>איש קשר:</Text>
          <Text style={styles.detailText}>{supplier.contactPerson}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>טלפון:</Text>
          <Text style={styles.detailText}>{supplier.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>מייל:</Text>
          <Text style={styles.detailText}>{supplier.email}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isSidebarVisible && <Sidebar userRole={userRole} />}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
            <Icon name={isSidebarVisible ? "x" : "menu"} size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>רשימת ספקים</Text>
          {userRole === 'manager' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddSupplier')}
            >
              <Icon name="plus" size={24} color="#4A90E2" />
            </TouchableOpacity>
          )}
        </View>
        {isLoading ? (
          <View style={styles.loadingContainer}>
          </View>
        ) : (
          <FlatList
            data={suppliers}
            renderItem={renderSupplierCard}
            keyExtractor={(item) => item.supplierId.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
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
    justifyContent: 'space-between',
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
  addButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  supplierCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supplierHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row-reverse',
  },
  actionButton: {
    marginLeft: 16,
    padding: 4,
  },
  supplierDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    width: 70,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SuppliersListScreen;