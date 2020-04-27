import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, Image, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import pokemons from './pokemons';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState("");
  const [pokedata, setPokedata] = useState(undefined);

  async function fetchData() {
    try {
      setIsLoading(value => true);
      const index = pokemons.findIndex(item => pokemon === item); 
      let response = await fetch('https://pokeapi.co/api/v2/pokemon/' + (index+1));
      let responseJson = await response.json();
      setPokedata(responseJson);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (pokemon) {
      fetchData();
    } else {
      setPokedata(undefined);
    }
  },[pokemon]);

  return (
    <ScrollView style={styles.scrollcontainer} 
                contentContainerStyle={styles.container} >

      <Modal animationType='slide'
             transparent={false}
             visible={pokemon ? true : false}>
        <View>
          

          { isLoading ? 
          <View style={styles.jokebox}>
            <ActivityIndicator size="large" color="#00ff00" /> 
          </View>
        :
          pokedata ? 
              <View style={styles.jokebox}>
                <Text>{pokemon}</Text>
                <Text>{pokedata.name}</Text>
                <Text>Id: {pokedata.id}</Text>
                <Text>Tyyppi: {pokedata.types.map(slot => slot.type.name + " ")}</Text>
              </View> 
            :
              null  

      }

          <Button title="close" onPress={() => setPokemon("")} />
        </View>
      </Modal>

      <Image style={styles.image} source={require('./assets/pokeball.png')} resizeMode='contain' />
      <View style={styles.searchbox}>
        <TextInput style={styles.searchbox_input} 
                   onChangeText={text => setQuery(text)} 
                   defaultValue={query} 
                   placeholder="Input search text here" />
      { /*  <Button title="Search" color="#ff0000" 
                onPress={() => {setQuery(input)}} /> */ }
      </View>
      <SearchResults pokemons={pokemons} query={query} setPokemon={setPokemon}/>
     
    </ScrollView>
  );
}

function SearchResults(props) {
  const query = props.query;
  const re = new RegExp(props.query, "i");
  const results = props.pokemons.filter(pokemon => pokemon.match(re));

  if (results.length > 20) {
    return (
      <View style={styles.searchresults} >
        <Text>Too many results, please narrow search.</Text>
      </View>      
    );
  }

  const rows = results.map(name => <Result key={name} name={name} setPokemon={props.setPokemon} />);
  return (
    <View style={styles.searchresults} >
      {rows}
    </View>
  );
}

function Result(props) {
  return (
    <TouchableOpacity onPress={() => {props.setPokemon(props.name)}} >
      <View style={styles.result}>
        <Text style={styles.result_text}>{props.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollcontainer: {
    flex: 1,
    backgroundColor: '#999',
    padding: 40
  },
  container: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200
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
  searchresults: {
    width: '100%',
    padding: 5
  },
  result: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: '#666',
    borderWidth: 2,
    width: '100%'
  },
  result_text: {
    fontSize: 18
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
