
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Grid, Card, CardMedia, CardContent, CircularProgress, Typography, TextField } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { toFirstCharUpperCase } from './constant';
import logo from './logo.png';
import logo2 from './logo2.png';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles(theme => ({
  pokedexContainer: {
    paddingTop: "20px",
    paddingLeft: "50px",
    paddingRight: "50px",
  },
  cardMedia: {
      margin: "auto",
  },
  cardContent: {
      textAlign: "center",
  },
  searchContainer: {
      display: 'flex',
      backgroundColor: fade(theme.palette.common.white, 0.15),
      // height: "40px",
      paddingLeft: "20px",
      paddingRight: "20px",
      marginTop: "5px",
      marginBottom: "5px",    
      marginRight: "20px", 
      borderRadius: "5px",
  },
  searchIcon: {
      alignSelf: "flex-end",
      marginBottom: "5px",
      // fontSize: "2.5rem",
  },
  searchInput: {
      width: "200px",
      // margin: "5px",
  },
  grow: {
      flexGrow: '1',
  },
}));

const MyPokemons = props => {
    const { history } = props;
    const classes = useStyles();    
    const [ filter, setfilter ] = useState('');    
    const [ loading, setLoading ] = useState(true);    
    const myPokemons = JSON.parse(localStorage.getItem('myPokemons'));
    const [ PokemonsList, setPokemonsList ] = useState({myPokemons}); 
       
    const handleSearchChange = (e) => {
        setfilter(e.target.value);
    };

    const getPokemonCard = (pokemonId) => {
        console.log(myPokemons[`${pokemonId}`]);
        const { id, name, sprite } = myPokemons[pokemonId];

        return (
            <Grid item xs= {4} key={pokemonId}>
                <Card>
                    <CardMedia onClick = {() => history.push(`/${id}`)} className={classes.cardMedia }
                    image={sprite}
                    style= {{ width: "130px", height: "130px"}} />
                    <CardContent onClick = {() => history.push(`/${id}`)} className={classes.CardContent}>
                        <Typography align="center">{`${id}. ${toFirstCharUpperCase(name)}`}</Typography>
                    </CardContent>
                    <Grid container justify="flex-end">
                      <Button color="primary" variant="contained" onClick={release(myPokemons[pokemonId])}>-</Button>
                    </Grid>
                </Card>
            </Grid>
        );
    };

      
    const removePokemonFromList = (removedPokemon) =>
      Object.values(PokemonsList).filter(pokemon => pokemon !== removedPokemon);

    const release = (pokemon) => () => {          
        var ind = -1; 

        myPokemons.forEach((pokemonStorage, index) => {    
          if(pokemonStorage.id == pokemon.id){
            ind = myPokemons.indexOf(pokemonStorage);
          }            
        });       
        
        if(ind != -1){
          myPokemons.splice(ind, 1);         
        }
        setPokemonsList(removePokemonFromList(pokemon));
        localStorage.setItem('myPokemons', JSON.stringify(myPokemons));
    };

    return (
      <>
        
        <AppBar position = "static" className={classes.AppBar}>
            <Toolbar>
                <img src={logo} id="logo"/>
                <img src={logo2} id="logo2"/>
                <div className={classes.grow}/>
                <div className={classes.searchContainer}>
                    <SearchIcon className={classes.SearchIcon} id="search-icon"/>
                    <TextField startIcon={<SearchIcon/>}
                    onChange={handleSearchChange}
                    className={classes.searchInput}
                    label="Buscar Pokemon"
                    variant="standard"/>
                </div>                
                <Button startIcon={<HomeIcon/>} color="primary" variant="contained" onClick={() => history.push('/')}>Home</Button>
                <Button startIcon={<FavoriteIcon/>} color="primary" variant="contained" onClick={() => history.push('/mypokemons')}>Meus Pokemons</Button>               
            </Toolbar>
        </AppBar>
        {PokemonsList ? (
            
            <Grid container spacing={2} className={classes.pokedexContainer}>
                {Object.keys(myPokemons).map((pokemonId) => 
                  myPokemons[pokemonId].name.includes(filter) &&
                    getPokemonCard(pokemonId))}
            </Grid>

        ) : (
            <CircularProgress />
        )}       
      </>
    )
}

export default MyPokemons;
