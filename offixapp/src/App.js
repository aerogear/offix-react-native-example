import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useQuery, ApolloProvider } from 'react-apollo';
import { ApolloOfflineProvider, useOfflineMutation } from 'react-offix-hooks'
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
          <ShopScreen />
        </ApolloProvider>
      </ApolloOfflineProvider>
    )
  }
  return <Text>Loading</Text>
};

const ShopComponent = forwardRef((props, ref) => {

  const { error, data, loading } = useQuery(shopsQuery, { options: { fetchPolicy: "cache-and-network" }})

  console.log(JSON.stringify(loading ? "Loading..." : "Loaded."))

  if ( loading === true ) {
    return <Text>Loading...</Text>;
  } else {

    if (error) {
      console.log(error);
      return <Text>Error when querying data</Text>;
    } else {
      const { findAllShops } = data;
      if (findAllShops) {
        return (
          <View>
            {findAllShops.map((ref, index) => {
              return <Text key={index}>{ref.name}</Text>;
            })}
          </View>
        );
      }
    }
  }
});


export function ShopScreen() {

  const shopRef = useRef({
    name: '',
    type: ''
  });

  const shopInputRef = useRef();

  const [addShop, state] = useOfflineMutation(addShopMutation, {
    updateQuery: shopsQuery,
    returnType: 'Task'
  })
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.welcome}>Shops data:</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => shopRef.current.name = text }
          ref={shopInputRef}
          defaultValue={shopRef.current.name}
          // value={shopRef.current.name} // this doesn't work
          placeholder="name"
        />
        <Button
          onPress={() => {
            addShop({
              variables: {
                name: shopRef.current.name
              }
            })
              .then(res => {
                return res;
              })
              .catch(err => <Text>{err}</Text>);
            shopRef.current =  { type: '', name: '' };
          }}
          title="Add shop"
        />
      </View>
      <Text style={styles.welcome}>My shops:</Text>
      <ShopComponent ref={shopRef}/>

      <Text style={styles.welcome}>
        {state.calledWhileOffline ? 'Enqueued offline change' : ''}
        {state.offlineChangeReplicated ? '\nChange replicated' : ''}
      </Text>
    </View>
  );
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
