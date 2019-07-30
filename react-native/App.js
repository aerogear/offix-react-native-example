/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Modal, TextInput } from 'react-native';
import { ApolloProvider, graphql, Mutation } from 'react-apollo';
import { OfflineClient } from "offix-client"
import gql from 'graphql-tag';

import { AsyncStorage } from "@react-native-community/async-storage"
import { ReactNativeNetworkStatus } from "./network"

const offlineClient = new OfflineClient({
  httpUrl: 'http://localhost:4000/graphql',
  storage: AsyncStorage,
  networkStatus: new ReactNativeNetworkStatus()
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
    offlineClient.init().then((client) => {
      console.log('offline client initialized')
      setApolloClient(client)
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
    return <Text>{error}</Text>;
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
        <Mutation mutation={addShopMutation}>
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
        <Text style={styles.welcome}>My dogs:</Text>
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
