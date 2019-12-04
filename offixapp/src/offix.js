import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from "apollo-link-http";
import AsyncStorage from "@react-native-community/async-storage"
import NetInfo from "@react-native-community/netinfo"
import { ApolloOfflineClient } from "offix-client"

const cacheStorage = {
  getItem: async (key) => {
    const data = await AsyncStorage.getItem(key);
    if (typeof data === 'string') {
      console.log("Get item string", data)
      return JSON.parse(data);
    }
    console.log("Get item", data)
    return data;
  },
  setItem: (key, value) => {
    let valueStr = value;
    if (typeof valueStr === 'object') {
      valueStr = JSON.stringify(value);
    }
    console.log("set item", valueStr)
    return AsyncStorage.setItem(key, valueStr);
  },
  removeItem: (key) => {
    return AsyncStorage.removeItem(key);
  }
};

const networkStatus = {
  onStatusChangeListener(callback) {
    const listener = (connected) => {
      console.log("network changed", connected)
      callback.onStatusChange({ online: false })

      setTimeout(() => {
        callback.onStatusChange({ online: true })
      }, 10000)
    };
    NetInfo.isConnected.addEventListener('connectionChange', listener)
  },
  isOffline() {
    return true; NetInfo.isConnected.fetch().then(connected => !connected)
  }
};

export const offlineClient = new ApolloOfflineClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  offlineStorage: cacheStorage,
  cacheStorage,
  networkStatus
});

