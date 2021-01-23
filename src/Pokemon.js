import React, { useEffect, useState } from 'react';
//import mockData from './mockData';
import { AppBar, Toolbar, Grid, Card, CardMedia, CardContent, Button, CircularProgress, Typography, TextField } from '@material-ui/core';
import { toFirstCharUpperCase } from './constant';
import axios from 'axios';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
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
   
    grow: {
        flexGrow: '1',
    },
   
}));

const Pokemon = props => {
    const { history, match } = props;
    const { params } = match;
    const { pokemonId } = params;
    const [ pokemon, setPokemon ] = useState( undefined );
    const classes = useStyles();

    useEffect(() => {
        axios 
            .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
            .then(function( response ) {
                const { data } = response;
                setPokemon( data );
            })
            .catch( function(error ){
                setPokemon( false );
            });
    }, [ pokemonId ]);

    const generatePokemonJSX = () => {
        const {name, id, species, height, weight, types, sprites } = pokemon;
        const fullImageUrl = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
        const { front_default } = sprites;
        return (
            <>
                <Typography variant="h1" align="center">
                    {`${id}.`} {toFirstCharUpperCase(name)}
                    <img src={front_default} />
                </Typography>
                <img style={{width: "300px", height: "300px", marginLeft:"37%"}} src={fullImageUrl} />
                <Typography variant="h3" align="center">Pokemon Info</Typography>
                <Typography align="center" >
                    {"Species: "}
                    {/* <Link href={species.url}>{species.name}</Link> */}
                </Typography>
                <Typography align="center" >Height: {height}</Typography>
                <Typography align="center" >Weight: {weight}</Typography>
                <Typography align="center"  variant="h6">Types: </Typography>
                {types.map((typeInfo) => {
                    const {type} = typeInfo;
                    const {name} = type;
                    return <Typography align="center"  key={name}>{`${name}`}</Typography>
                })};
            </>
        )
    }
    return (
        <>
        <AppBar position = "static" className={classes.AppBar}>
            <Toolbar>
                <img src={logo} id="logo"/>
                <img src={logo2} id="logo2"/>
                <div className={classes.grow}/>
                              
                <Button startIcon={<HomeIcon/>} color="primary" variant="contained" onClick={() => history.push('/')}>Home</Button>
                <Button startIcon={<FavoriteIcon/>} color="primary" variant="contained" onClick={() => history.push('/mypokemons')}>Meus Pokemons</Button>               
            </Toolbar>
        </AppBar>

        <div className={classes.pokedexContainer}>
            {pokemon === undefined && <CircularProgress />}
            {pokemon !== undefined && pokemon && generatePokemonJSX()}
            {pokemon === false && <Typography>Pokemon not found.</Typography>} 
            <div class="paginacao">
                <Button align="center" color="primary" variant="contained" onClick={() => history.push("/")}>Pokedex</Button>
            </div>
        </div>
        </>
    )
}

export default Pokemon;
