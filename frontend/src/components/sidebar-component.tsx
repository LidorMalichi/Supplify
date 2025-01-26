import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome';
type SidebarNavigationProp = StackNavigationProp<RootStackParamList>;

interface SidebarProps {
  userRole: 'manager' | 'employee';
}

const menuItems = [
  { id: 'Home', title: 'דף הבית', icon: 'home' },
  { id: 'AddSupplier', title: 'הוספת ספק', icon: 'user-plus' },
  { id: 'AddProduct', title: 'הוספת מוצר', icon: 'plus-square-o' },
  { id: 'orders', title: 'רשימת הזמנות', icon: 'list-alt' },
  { id: 'ProductList', title: 'רשימת מוצרים', icon: 'cube' },
  { id: 'SuppliersList', title: 'רשימת ספקים', icon: 'users' },
  { id: 'search', title: 'חיפוש מוצר', icon: 'search' },
  { id: 'cart', title: 'סל קניות', icon: 'shopping-cart' },];

const managerItems = [
  { id: 'Admin', title: 'מסך ניהול', icon: 'cog' },
  { id: 'RegisterEmployee', title: 'הרשמת עובד', icon: 'user-plus' },
];

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const navigation = useNavigation<SidebarNavigationProp>();

  const handleNavigation = (route: keyof RootStackParamList) => {
    console.log('Available routes:', navigation.getState().routeNames);
    console.log('Attempting to navigate to:', route);
    if (navigation.getState().routeNames.includes(route)) {
      console.log('Navigation successful');
      navigation.navigate(route);
    } else {
      console.warn(`Screen ${route} is not yet implemented`);

      console.warn(`Route ${route} is not defined in the navigator`);
    }
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <Text style={styles.logo}>Supplify</Text>
      </View>

      <ScrollView style={styles.menuItems}>
        {menuItems.map((item) => (
         <TouchableOpacity 
         key={item.id}
         style={styles.menuItem} 
         onPress={() => handleNavigation(item.id as keyof RootStackParamList)}
       >
            <FontAwesome name={item.icon} size={20} color="#4A90E2" style={styles.menuIcon} />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        {userRole === 'manager' && managerItems.map((item) => (
         <TouchableOpacity 
         key={item.id}
         style={styles.menuItem} 
         onPress={() => handleNavigation(item.id as keyof RootStackParamList)}
       >
            <FontAwesome name={item.icon} size={20} color="#4A90E2" style={styles.menuIcon} />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#E1E1E1',
    height: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1D1',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  menuIcon: {
    marginLeft: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#2E3A59',
    textAlign: 'right',
    flex: 1,
  },
});

export default Sidebar;