//import logo from './logo.svg';
import './App.css';
import Pokemon from './Pokemon';
import Pokedex from './Pokedex';
import mockData from './mockData';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route exact path="/" render = {(props) => <Pokedex {...props} />} />
      <Route
        exact
        path="/:pokemonId"
        render={(props) => <Pokemon {...props} />} 
      />
    </Switch>
  );
}

export default App;
