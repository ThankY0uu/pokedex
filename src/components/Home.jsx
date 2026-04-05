import { useState, useEffect } from 'react';

const GENERATIES = [
    { label: 'Gen 1', offset: 0, limit: 151 },
    { label: 'Gen 2', offset: 151, limit: 100 },
    { label: 'Gen 3', offset: 251, limit: 135 },
];

function Home({ onSelect, favorieten, toggleFavoriet }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [generatie, setGeneratie] = useState(0);
    const [zoekterm, setZoekterm] = useState('');
    const [typeFilter, setTypeFilter] = useState('alles');
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Als de generatie verandert, haal nieuwe pokemon op
    useEffect(() => {
        const haalOp = async () => {
            setLoading(true);

            const { offset, limit } = GENERATIES[generatie];

            // Stap 1: haal de lijst op
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await res.json();

            // Stap 2: haal per pokemon het type op
            const metTypes = await Promise.all(
                data.results.map(async (p, i) => {
                    const detail = await fetch(p.url).then(r => r.json());
                    return {
                        name: p.name,
                        id: offset + i + 1,
                        types: detail.types.map(t => t.type.name),
                    };
                })
            );

            setPokemonList(metTypes);

            // Stap 3: verzamel alle unieke types voor de dropdown
            const alleTypes = [...new Set(metTypes.flatMap(p => p.types))].sort();
            setTypes(alleTypes);
            setTypeFilter('alles');
            setLoading(false);
        };

        haalOp();
    }, [generatie]);

    // Filter de lijst op zoekterm en type
    const gefilterd = pokemonList.filter(pokemon => {
        const zoekMatch = pokemon.name.toLowerCase().includes(zoekterm.toLowerCase());

        if (typeFilter === 'favorieten') {
            return zoekMatch && favorieten.includes(pokemon.name);
        }

        if (typeFilter === 'alles') {
            return zoekMatch;
        }

        return zoekMatch && pokemon.types.includes(typeFilter);
    });

    return (
        <div className="home-container">
            <h1>DE ULTIEME Pokédex</h1>

            {/* Generatie knoppen */}
            <div style={{ marginBottom: '10px' }}>
                {GENERATIES.map((gen, i) => (
                    <button
                        key={gen.label}
                        onClick={() => setGeneratie(i)}
                        style={{ marginRight: '8px', fontWeight: generatie === i ? 'bold' : 'normal' }}
                    >
                        {gen.label}
                    </button>
                ))}
            </div>

            {/* Zoekbalk en filter dropdown */}
            <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Zoek een Pokémon..."
                    value={zoekterm}
                    onChange={e => setZoekterm(e.target.value)}
                />
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="alles">Alle types</option>
                    <option value="favorieten"> Favorieten</option>
                    {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Laadbericht */}
            {loading && <p>Pokémon worden geladen...</p>}

            {/* Pokemon grid */}
            <div className="pokemon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                {gefilterd.map(pokemon => {
                    const plaatje = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                    const isFavoriet = favorieten.includes(pokemon.name);

                    return (
                        <div
                            key={pokemon.name}
                            className="pokemon-card"
                            onClick={() => onSelect(pokemon.name)}
                            style={{ border: '1px solid #ccc', padding: '10px', cursor: 'pointer', textAlign: 'center', position: 'relative' }}
                        >
                            {/* Hartje voor favoriet */}
                            <span
                                onClick={e => { e.stopPropagation(); toggleFavoriet(pokemon.name); }}
                                style={{ position: 'absolute', top: '5px', right: '8px', cursor: 'pointer', fontSize: '16px' }}
                            >
                {isFavoriet ? '❤️' : '🤍'}
              </span>

                            <img src={plaatje} alt={pokemon.name} />
                            <p style={{ textTransform: 'capitalize' }}>{pokemon.name}</p>
                            <p style={{ fontSize: '12px', color: '#888' }}>{pokemon.types.join(', ')}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;