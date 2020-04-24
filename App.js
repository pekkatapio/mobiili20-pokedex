import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, Image, TextInput } from 'react-native';
import pokemons from './pokemons';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [joke, setJoke] = useState("");

  async function fetchData() {
    try {
      setIsLoading(value => true);
      let response = await fetch('https://cat-fact.herokuapp.com/facts/random');
      let responseJson = await response.json();
      console.log(responseJson);
      setJoke(responseJson.text);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  },[]);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('./assets/pokeball.png')} resizeMode='contain' />
      <View style={styles.searchbox}>
        <TextInput style={styles.searchbox_input}/>
        <Button title="Search" color="#ff0000"/>
      </View>
      <SearchResults pokemons={pokemons} query={"Pikachu"} />
      { isLoading ? 
          <View style={styles.jokebox}>
            <ActivityIndicator size="large" color="#00ff00" /> 
          </View>
        :
          <View style={styles.jokebox}>
            <Text style={styles.joke}>{joke}</Text>
            <Button title="GET A NEW FACT" onPress={fetchData} />
          </View>
      }
    </View>
  );
}

function SearchResults(props) {
  const query = props.query;
  const re = /Bulba/;
  const results = props.pokemons.filter(pokemon => pokemon.match(re));
  
  return (
    <View>
      <Text>{results}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  image: {
    width: '60%',
    height: '50%'
  },
  searchbox: {
    marginTop:10,
    marginBottom: 10,
    flexDirection: 'row'
  },
  searchbox_input: {
    backgroundColor: '#fff',
    padding: 5,
    flex: 1,
    marginRight: 5,
  },
  joke: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center', 
    marginBottom: 20
  },
  jokebox: {
    height: '40%'
  }
});
