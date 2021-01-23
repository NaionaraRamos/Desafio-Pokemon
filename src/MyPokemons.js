import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Grid, Card, CardMedia, CardContent, CircularProgress, Typography, TextField } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { toFirstCharUpperCase } from './constant';
import axios from 'axios';
import Pagination from './pagination';

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
        paddingLeft: "20px",
        paddingRight: "20px",
        marginTop: "5px",
        marginBottom: "5px",
    },
    searchIcon: {
        alignSelf: "flex-end",
        marginBottom: "5px",
    },
    searchInput: {
        width: "200px",
        margin: "5px",
    }
}));

const MyPokemons = props => {
    const { history } = props;
    const classes = useStyles();    
    const [ filter, setfilter ] = useState('');
    //const [ currentPageUrl, setCurrentPageUrl ] = useState('https://pokeapi.co/api/v2/pokemon');
    // const [ previousPageUrl, setPreviousPageUrl ] = useState();
    // const [ nextPageUrl, setNextPageUrl ] = useState();
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
                        <Typography>{`${id}. ${toFirstCharUpperCase(name)}`}</Typography>
                    </CardContent>
                    <Button color="primary" variant="contained" onClick={release(myPokemons[pokemonId])}>-</Button>
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
        
        <AppBar position = "static">
            <Toolbar>
                <div className={classes.searchContainer}>
                    <SearchIcon className={classes.SearchIcon}/>
                    <TextField
                    onChange={handleSearchChange}
                    className={classes.searchInput}
                    label="Pokemon"
                    variant="standard"/>
                </div>

                <Button color="primary" variant="contained" onClick={() => history.push('/')}>Home</Button>
                <Button color="primary" variant="contained" onClick={() => history.push('/mypokemons')}>Meus Pokemons</Button>
               
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
        {/* <Pagination 
            nextPage = { nextPageUrl ? nextPage : null }
            previousPage = { previousPageUrl ? previousPage : null }
            /> */}
      </>
    )
}

export default MyPokemons;
