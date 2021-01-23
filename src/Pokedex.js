import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Grid, Card, CardMedia, CardContent, Button, CircularProgress, Typography, TextField } from '@material-ui/core';
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

const Pokedex = props => {
    const { history } = props;
    const classes = useStyles();
    const [ pokemonData, setPokemonData ] = useState({});
    const [ myPokemons, setMyPokemons ] = useState([]);
    const [ filter, setfilter ] = useState('');
    const [ currentPageUrl, setCurrentPageUrl ] = useState('https://pokeapi.co/api/v2/pokemon');
    const [ previousPageUrl, setPreviousPageUrl ] = useState();
    const [ nextPageUrl, setNextPageUrl ] = useState();
    const [ loading, setLoading ] = useState(true);

    //Recuperando do storage os pokemons capturados
    let newMyPokemons = []
    if(localStorage.getItem('myPokemons') !== null && newMyPokemons.length == 0){
        newMyPokemons = JSON.parse(localStorage.getItem('myPokemons'));          
    }

    //Manter apenas pokemons que não foram capturados
    const keepPokemon = (pokemonId) => {        
        var i;
        for (i = 0; i < newMyPokemons.length; i++) {
            if (newMyPokemons[i].id == pokemonId) {               
                return false;
            }           
        }       
        return true;
    }

    const handleSearchChange = (e) => {
        setfilter(e.target.value);
    };

    useEffect (() => {
        setLoading(false)
        axios
            .get(currentPageUrl)
            .then(function(response){
                const { data } = response;
                const { results } = data;
                setLoading(false)
                setPreviousPageUrl(response.data.previous)
                setNextPageUrl(response.data.next)
                const newPokemonData = {};
                results.forEach((pokemon, index) => {
                    if(keepPokemon(index + 1)){
                        newPokemonData[index + 1] = {
                            id: index + 1,
                            name: pokemon.name,
                            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
                        };
                    }
                });
                setPokemonData(newPokemonData);
            });

        }, [currentPageUrl]);


        function previousPage(){
            setCurrentPageUrl(previousPageUrl);
        }

        function nextPage(){
            setCurrentPageUrl(nextPageUrl);
        }

        if (loading) return "Loading...";


    const getPokemonCard = (pokemonId) => {
        console.log(pokemonData[`${pokemonId}`]);
        const { id, name, sprite } = pokemonData[pokemonId];
        
        return (
            <Grid item xs= {4} key={pokemonId}>
                <Card>
                    <CardMedia onClick = {() => history.push(`/${pokemonId}`)} className={classes.cardMedia}
                        image={sprite}
                        style= {{ width: "130px", height: "130px"}} />
                    <CardContent onClick = {() => history.push(`/${pokemonId}`)} className={classes.CardContent}>
                        <Typography>{`${id}. ${toFirstCharUpperCase(name)}`}</Typography>
                    </CardContent>
                    <Button color="primary" variant="contained" onClick={capture(pokemonData[pokemonId])}>+</Button>
                </Card>
            </Grid>
        );
    };



    const removePokemonFromList = (removedPokemon) =>
        Object.values(pokemonData).filter(pokemon => pokemon !== removedPokemon);

    const capture = (pokemon) => () => {          
        newMyPokemons = [ ...newMyPokemons, pokemon ];
        setMyPokemons(newMyPokemons);    
        localStorage.setItem('myPokemons', JSON.stringify(newMyPokemons));
        setPokemonData(removePokemonFromList(pokemon));
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
        {pokemonData ? (
            
            <Grid container spacing={2} className={classes.pokedexContainer}>
                {Object.keys(pokemonData).map((pokemonId) => 
                    pokemonData[pokemonId].name.includes(filter) &&                    
                    getPokemonCard(pokemonId))
                }
            </Grid>

        ) : (
            <CircularProgress />
        )}
        <Pagination 
            nextPage = { nextPageUrl ? nextPage : null }
            previousPage = { previousPageUrl ? previousPage : null }
            />
      </>
    )
}

export default Pokedex;
