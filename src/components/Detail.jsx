import { useState, useEffect } from 'react';

function Detail({ pokemonName, onBack }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(res => res.json())
            .then(json => {
                console.log(json); // <-- dit toevoegen
                setData(json);
            });
    }, [pokemonName]);

    if (!data) return <p>Data wordt gezocht in de grassen...</p>;

    return (
        <div className="detail-page" style={{ textAlign: 'center', padding: '20px' }}>
            <button onClick={onBack}>← Ga Terug</button>

            <h1 style={{ textTransform: 'uppercase' }}>{data.name}</h1>

            <img
                src={data.sprites.other['official-artwork'].front_default}
                alt={data.name}
                style={{ width: '200px' }}
            />

            <div style={{ marginTop: '20px' }}>
                <p><strong>Type:</strong> {data.types[0].type.name}</p>
            </div>

            <h3>Moves:</h3>
            <p>{data.moves[0].move.name}, {data.moves[1].move.name}</p>
        </div>
    );
}

export default Detail;