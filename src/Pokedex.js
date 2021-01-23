import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Grid, Card, CardMedia, CardContent, Button, CircularProgress, Typography, TextField } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { toFirstCharUpperCase } from './constant';
import axios from 'axios';
import Pagination from './pagination';
import logo from './logo.png';
import logo2 from './logo2.png';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { AutorenewTwoTone } from '@material-ui/icons';

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

const Pokedex = props => {
    const { history } = props;
    const classes = useStyles();
    const [ pokemonData, setPokemonData ] = useState({});
    const [ myPokemons, setMyPokemons ] = useState([]);
    const [ filter, setfilter ] = useState('');
    const [ currentPageUrl, setCurrentPageUrl ] = useState('https://pokeapi.co/api/v2/pokemon');
    const [ previousPageUrl, setPreviousPageUrl ] = useState();
    const [ nextPageUrl, setNextPageUrl ] = useState();
    const [ currentPageNumber, setCurrentPageNumber ] = useState(0);
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
                    let indice = index + 1 + (currentPageNumber * 20);
                    if(keepPokemon(indice)){
                        newPokemonData[indice] = {
                            id: indice,
                            name: pokemon.name,
                            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1 + (currentPageNumber * 20)}.png`
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
                        <Typography align="center">{`${id}. ${toFirstCharUpperCase(name)}`}</Typography>
                    </CardContent>
                    <Grid container justify="flex-end">
                        <Button color="primary" variant="contained" onClick={capture(pokemonData[pokemonId])}>+</Button>
                    </Grid>
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

    const paginate = (page) => {
        console.log(page);
        if( page === "next" ){    
            const number = currentPageNumber;        
            setCurrentPageNumber(number+1);
            setCurrentPageUrl(nextPageUrl);            
        }
        if( page === "previous" ) {
            const number = currentPageNumber;        
            setCurrentPageNumber(number-1);
            setCurrentPageUrl(previousPageUrl);
        }       
    }    

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
            paginate = { paginate }
        />        
      </>
    )
}

export default Pokedex;
