import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { ApolloProvider, graphql as query, Mutation } from 'react-apollo';
import { ApolloOfflineProvider, useOfflineMutation } from 'react-offix-hooks'
import { ApolloProvider } from '@apollo/react-hooks'
import { offlineClient } from './offix'
import { addShopMutation, shopsQuery } from './queries'

const App = () => {
  const [initialized, setInitialized] = useState(false)

  // initialize the offix client and set the apollo client
  useEffect(() => {
    offlineClient.init().then(() => setInitialized(true))
  }, [])

  // load the app if the apolloClient is there, otherwise load a loading screen
  if (initialized) {
    return (
      <ApolloOfflineProvider client={offlineClient}>
        <ApolloProvider client={offlineClient}>
          <ShopScreen></ShopScreen>
        </ApolloProvider>
      </ApolloOfflineProvider>
    )
  }
  return <Text>Loading</Text>
};

const ShopComponent = query(shopsQuery)(props => {
  const { error, findAllShops } = props.data;
  if (error) {
    console.log(error);
    return <Text>Error when querying data</Text>;
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

    const [addShop, state] = useOfflineMutation(addShopMutation, {
      variables: {
        chatId,
        content: inputRef.current.value,
      }
    })

    return (
      <View style={styles.container}>
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
              addShop({
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
