import { useState, useEffect } from 'react';
import './Detail.css';

function Detail({ pokemonName, onBack }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setData(json);
            });
    }, [pokemonName]);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="detail-page">
            <button onClick={onBack}>← Go Back</button>

            <h1>{data.name}</h1>

            <img
                src={data.sprites.other['official-artwork'].front_default}
                alt={data.name}
            />

            {/* Basic info */}
            <div className="detail-info">
                <p><strong>Weight:</strong> {data.weight / 10} kg</p>
                <p><strong>Height:</strong> {data.height / 10} m</p>
                <p><strong>Base experience:</strong> {data.base_experience} xp</p>
            </div>

            {/* Types */}
            <div className="detail-section">
                <h3>Types</h3>
                {data.types.map(t => (
                    <span key={t.type.name} className="detail-tag">
            {t.type.name}
          </span>
                ))}
            </div>

            {/* Stats */}
            <div className="detail-section">
                <h3>Stats</h3>
                {data.stats.map(s => (
                    <p key={s.stat.name} className="detail-stat">
                        <strong>{s.stat.name}:</strong> {s.base_stat}
                    </p>
                ))}
            </div>

            {/* Abilities */}
            <div className="detail-section">
                <h3>Abilities</h3>
                {data.abilities.map(a => (
                    <span key={a.ability.name} className="detail-tag">
            {a.ability.name} {a.is_hidden ? '(hidden)' : ''}
          </span>
                ))}
            </div>

            {/* Moves */}
            <div className="detail-section">
                <h3>Moves (first 5)</h3>
                <p>{data.moves.slice(0, 5).map(m => m.move.name).join(', ')}</p>
            </div>

        </div>
    );
}

export default Detail;