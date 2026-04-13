import { useState, useEffect } from 'react';
import './Home.css';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import GenerationButtons, { GENERATIONS } from './GenerationButtons';

function Home({ favorieten, toggleFavoriet }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [generation, setGeneration] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { offset, limit } = GENERATIONS[generation];
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await res.json();

            const withTypes = await Promise.all(
                data.results.map(async (p, i) => {
                    const detail = await fetch(p.url).then(r => r.json());
                    return {
                        name: p.name,
                        id: offset + i + 1,
                        types: detail.types.map(t => t.type.name),
                    };
                })
            );

            setPokemonList(withTypes);
            const allTypes = [...new Set(withTypes.flatMap(p => p.types))].sort();
            setTypes(allTypes);
            setTypeFilter('all');
            setLoading(false);
        };

        fetchData();
    }, [generation]);

    const filtered = pokemonList.filter(pokemon => {
        const searchMatch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (typeFilter === 'favorites') return searchMatch && favorieten.includes(pokemon.name);
        if (typeFilter === 'all') return searchMatch;
        return searchMatch && pokemon.types.includes(typeFilter);
    });

    return (
        <div className="home-container">
            <h1>THE ULTIMATE Pokédex</h1>

            <GenerationButtons generation={generation} setGeneration={setGeneration} />

            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                types={types}
            />

            {loading && <p>Loading Pokémon...</p>}

            <div className="pokemon-grid">
                {filtered.map(pokemon => (
                    <PokemonCard
                        key={pokemon.name}
                        pokemon={pokemon}
                        isFavorite={favorieten.includes(pokemon.name)}
                        toggleFavoriet={toggleFavoriet}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;