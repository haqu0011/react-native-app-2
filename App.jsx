import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import UserAvatar from 'react-native-user-avatar';
import {FAB} from 'react-native-paper';

const App = () => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async (count = 10) => {
    try {
      const response = await axios.get(
        `https://random-data-api.com/api/v2/users?size=${count}`,
      );
      let data = response.data;
      if (Array.isArray(data)) {
        data = data.map(user => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          avatar: user.avatar,
        }));
      } else {
        data = [
          {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            avatar: data.avatar,
          },
        ];
      }
      setUsers(prevUsers => [...data, ...prevUsers]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <UserAvatar
        size={50}
        name={`${item.firstName} ${item.lastName}`}
        src={item.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.firstName}>{item.firstName}</Text>
        <Text style={styles.lastName}>{item.lastName}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to the User List</Text>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <FAB style={styles.fab} icon="plus" onPress={() => fetchUsers(1)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 15,
  },
  firstName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastName: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default App;
