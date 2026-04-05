import { useState, useEffect } from 'react';

const GENERATIES = [
    { label: 'Gen 1', offset: 0, limit: 151 },
    { label: 'Gen 2', offset: 151, limit: 100 },
    { label: 'Gen 3', offset: 251, limit: 135 },
];

function Home({ onSelect }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [generatie, setGeneratie] = useState(0);
    const [zoekterm, setZoekterm] = useState('');
    const [typeFilter, setTypeFilter] = useState('alles');
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const haalOp = async () => {
            setLoading(true);

            const { offset, limit } = GENERATIES[generatie];

            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await res.json();

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

            const alleTypes = [...new Set(metTypes.flatMap(p => p.types))].sort();
            setTypes(alleTypes);
            setTypeFilter('alles');
            setLoading(false);
        };

        haalOp();
    }, [generatie]);

    const gefilterd = pokemonList.filter(pokemon => {
        const zoekMatch = pokemon.name.toLowerCase().includes(zoekterm.toLowerCase());

        if (typeFilter === 'alles') {
            return zoekMatch;
        }

        return zoekMatch && pokemon.types.includes(typeFilter);
    });

    return (
        <div className="home-container">
            <h1>DE ULTIEME Pokédex</h1>

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

            <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Zoek een Pokémon..."
                    value={zoekterm}
                    onChange={e => setZoekterm(e.target.value)}
                />
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="alles">Alle types</option>
                    {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {loading && <p>Pokémon worden geladen...</p>}

            <div className="pokemon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                {gefilterd.map(pokemon => {
                    const plaatje = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

                    return (
                        <div
                            key={pokemon.name}
                            className="pokemon-card"
                            onClick={() => onSelect(pokemon.name)}
                            style={{ border: '1px solid #ccc', padding: '10px', cursor: 'pointer', textAlign: 'center' }}
                        >
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