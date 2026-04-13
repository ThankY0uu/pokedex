import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import './Detail.css';

function Detail({ favorites, toggleFavorite }) {
    const { name } = useParams(); // 'name' komt overeen met :name in App.jsx
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(res => {
                if (!res.ok) throw new Error('Pokémon niet gevonden');
                return res.json();
            })
            .then(json => {
                setData(json);
                setError(false);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(true);
                setLoading(false);
            });
    }, [name]);

    if (loading) return <div className="detail-page"><p>Loading Pokémon...</p></div>;

    if (error) return (
        <div className="detail-page">
            <p>Oeps! Pokémon "{name}" bestaat niet.</p>
            <button onClick={() => navigate('/')}>← Terug naar Home</button>
        </div>
    );

    // Check of deze pokemon in de favorieten lijst staat
    const isFavorite = favorites?.includes(data.name);

    return (
        <div className="detail-page">
            <div className="nav-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Go Back
                </button>

                {/* Favoriet knop op de detailpagina */}
                <button
                    className={`fav-btn ${isFavorite ? 'is-fav' : ''}`}
                    onClick={() => toggleFavorite(data.name)}
                >
                    {isFavorite ? '❤️ In Favorites' : '🤍 Add to Favorites'}
                </button>
            </div>

            <h1 className="pokemon-title">
                {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
            </h1>

            <div className="detail-grid">
                <div className="image-container">
                    <img
                        className="official-artwork"
                        src={data.sprites.other['official-artwork'].front_default}
                        alt={data.name}
                    />
                </div>

                <div className="stats-container">
                    <div className="detail-section">
                        <h3>Physical Traits</h3>
                        <p><strong>Weight:</strong> {data.weight / 10} kg</p>
                        <p><strong>Height:</strong> {data.height / 10} m</p>
                    </div>

                    <div className="detail-section">
                        <h3>Types</h3>
                        <div className="tag-list">
                            {data.types.map(t => (
                                <span key={t.type.name} className={`type-tag ${t.type.name}`}>
                                    {t.type.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Base Stats</h3>
                        {data.stats.map(s => (
                            <div key={s.stat.name} className="stat-bar-wrapper">
                                <label>{s.stat.name}</label>
                                <div className="stat-bar-bg">
                                    <div
                                        className="stat-bar-fill"
                                        style={{ width: `${Math.min(s.base_stat, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="stat-num">{s.base_stat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="extra-info">
                <div className="detail-section">
                    <h3>Abilities</h3>
                    <p>{data.abilities.map(a => a.ability.name + (a.is_hidden ? ' (hidden)' : '')).join(', ')}</p>
                </div>

                <div className="detail-section">
                    <h3>Moves (top 5)</h3>
                    <p>{data.moves.slice(0, 5).map(m => m.move.name).join(', ')}</p>
                </div>
            </div>
        </div>
    );
}

export default Detail;