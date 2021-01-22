import React, { useState } from 'react';

const PokemonsList = () => {
    const [pokemons] = useState([
        { id: 1, name: 'Um'},
        { id: 2, name: 'Dois'},
        { id: 3, name: 'Três'}
    ]);

    return (
        <div className = "pokemons-list">
            <h2>Pokemons List</h2>

            {pokemons.map((pokemon) =>
                <div key={`${pokemon.id} - ${pokemon.name}`}>
                    <p>{pokemon.id}</p>
                    <p>{pokemon.name}</p>
                </div>)}
        </div>
    )
}

export default PokemonsList;