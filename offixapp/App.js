import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Modal, TextInput } from 'react-native';
import { ApolloProvider, graphql, Mutation } from 'react-apollo';
import { ApolloOfflineClient } from "offix-client"
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from "apollo-link-http";
import AsyncStorage from "@react-native-community/async-storage"
import NetInfo from "@react-native-community/netinfo"

const cacheStorage = {
  getItem: async (key) => {
    //await AsyncStorage.clear();
    const data = await AsyncStorage.getItem(key);

    if (typeof data === 'string') //FIX: Required to prevent data becoming corrupt and bloated
      return JSON.parse(data);

    console.log("data getItem", data);
    return data;
  },
  setItem: async (key, value) => {
    console.log("data setItem 1", key, value);
    let valueStr = value;
    if (typeof valueStr === 'object') {
      valueStr = JSON.stringify(value);
    }
    console.log("data setItem", valueStr);
    return AsyncStorage.setItem(key, valueStr);
  },
};



const offlineClient = new ApolloOfflineClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  offlineStorage: cacheStorage,
  cacheStorage,
  networkStatus: {
    onStatusChangeListener(callback) {
      const listener = (connected) => {
        console.log("network changed", connected)
        callback.onStatusChange({ online: connected })
      };
      NetInfo.isConnected.addEventListener('connectionChange', listener)
    },
    isOffline() {
      return false; NetInfo.isConnected.fetch().then(connected => !connected)
    }
  }
});

const shopsQuery = gql`
  query {
    findAllShops{
      id
      name
    }
  }
`;

const addShopMutation = gql`
  mutation createShop($name: String!) {
    createShop(input: { name: $name }) {
      id
      name
    }
  }
`;

const App = () => {
  // First we initialize a piece of state called apolloClient
  // It's null at the start
  const [apolloClient, setApolloClient] = useState(null)

  console.log('app render')

  // Inside useEffect, initialize the offix client and set the apollo client
  // This only happens once.
  useEffect(() => {
    offlineClient.init().then(() => {
      console.log('offline client initialized')
      // TODO temporay hack to use offline mutations inside hoc components
      // We will move this to react hooks package we support
      // offlineClient.mutate = offlineClient.offlineMutate.bind(offlineClient);
      setApolloClient(offlineClient)
    })
  }, [])

  // load the app if the apolloClient is there, otherwise load a loading screen
  if (apolloClient) {
    return (
      <ApolloProvider client={apolloClient}>
        <ShopScreen></ShopScreen>
      </ApolloProvider>
    )
  }
  return <Text>Loading</Text>
};

const ShopComponent = graphql(shopsQuery)(props => {
  const { error, findAllShops } = props.data;
  if (error) {
    console.log(error);
    return <Text>Error</Text>;
  }
  if (findAllShops) {
    return (
      <View>
        {findAllShops.map(shop => {
          return <Text key={shop.name}>{shop.name}</Text>;
        })}
      </View>
    );
  }

  return <Text>Loading...</Text>;
});

export class ShopScreen extends Component {
  state = {
    name: '',
    type: ''
  };

  render() {
    return (
      <View style={styles.container}>
        <Mutation mutation={addShopMutation} refetchQueries={[{ query: shopsQuery }]}>
          {(addShopMutation, { data }) => (
            <View>
              <Text style={styles.welcome}>Shops data:</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => this.setState({ name: text })}
                value={this.state.name}
                placeholder="name"
              />
              <Button
                onPress={() => {
                  addShopMutation({
                    variables: {
                      name: this.state.name
                    }
                  })
                    .then(res => res)
                    .catch(err => <Text>{err}</Text>);
                  this.setState({ type: '', name: '' });
                }}
                title="Add shop"
              />
            </View>
          )}
        </Mutation>
        <Text style={styles.welcome}>My shops:</Text>
        <ShopComponent />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  input: {
    height: 30,
    width: 150,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    padding: 1
  }
});


export default App;
