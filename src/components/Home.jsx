import { useState, useEffect } from 'react';
import './Home.css';

const GENERATIONS = [
    { label: 'Gen 1', offset: 0, limit: 151 },
    { label: 'Gen 2', offset: 151, limit: 100 },
    { label: 'Gen 3', offset: 251, limit: 135 },
];

function Home({ onSelect, favorieten, toggleFavoriet }) {
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

            // Step 1: fetch the list
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await res.json();

            // Step 2: fetch the type for each pokemon
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

            // Step 3: collect all unique types for the dropdown
            const allTypes = [...new Set(withTypes.flatMap(p => p.types))].sort();
            setTypes(allTypes);
            setTypeFilter('all');
            setLoading(false);
        };

        fetchData();
    }, [generation]);

    // Filter the list by search term and type
    const filtered = pokemonList.filter(pokemon => {
        const searchMatch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());

        if (typeFilter === 'favorites') {
            return searchMatch && favorieten.includes(pokemon.name);
        }

        if (typeFilter === 'all') {
            return searchMatch;
        }

        return searchMatch && pokemon.types.includes(typeFilter);
    });

    return (
        <div className="home-container">
            <h1>THE ULTIMATE Pokédex</h1>

            {/* Generation buttons */}
            <div className="generation-buttons">
                {GENERATIONS.map((gen, i) => (
                    <button
                        key={gen.label}
                        onClick={() => setGeneration(i)}
                        style={{ fontWeight: generation === i ? 'bold' : 'normal' }}
                    >
                        {gen.label}
                    </button>
                ))}
            </div>

            {/* Search bar and filter dropdown */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search a Pokémon..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="all">All types</option>
                    <option value="favorites">❤️ Favorites</option>
                    {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {loading && <p>Loading Pokémon...</p>}

            {/* Pokemon grid */}
            <div className="pokemon-grid">
                {filtered.map(pokemon => {
                    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                    const isFavorite = favorieten.includes(pokemon.name);

                    return (
                        <div
                            key={pokemon.name}
                            className="pokemon-card"
                            onClick={() => onSelect(pokemon.name)}
                        >
                            {/* Favorite button */}
                            <button
                                className="favorite-btn"
                                onClick={e => { e.stopPropagation(); toggleFavoriet(pokemon.name); }}
                            >
                                {isFavorite ? '❤️' : '🤍'}
                            </button>

                            <img src={image} alt={pokemon.name} />
                            <p>{pokemon.name}</p>
                            <p className="pokemon-type">{pokemon.types.join(', ')}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;